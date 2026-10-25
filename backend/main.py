"""
ChallanAI API Gateway & Orchestration Backend.
Integrates live Sarvam AI Multimodal APIs (Bulbul TTS, Saaras STT, Translate).
"""
import os
import logging
import requests
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from services.legal_engine import LegalEngine
from services.sarvam_service import SarvamService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("challan-ai")

app = FastAPI(
    title="ChallanAI API",
    description="Multimodal Traffic E-Challan Defense Gateway powered by Sarvam AI",
    version="1.0.0"
)

# Enable CORS for frontend Vite development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

legal_engine = LegalEngine()
sarvam_service = SarvamService()

class TTSRequest(BaseModel):
    text: str
    target_language_code: str = "hi-IN"
    speaker: str = "aditya"

class TranslateRequest(BaseModel):
    text: str
    source_language_code: str = "en-IN"
    target_language_code: str = "hi-IN"

@app.get("/")
def read_root():
    return {
        "service": "ChallanAI (चालान-न्याय) Gateway",
        "status": "online",
        "sarvam_connected": bool(sarvam_service.api_key),
        "sarvam_models": {
            "vision": "Sarvam Vision (Document & Crop OCR)",
            "speech_stt": "Sarvam Saaras (Multilingual STT)",
            "reasoning": "Sarvam-105B (Indic Legal LLM)",
            "speech_tts": "Sarvam Bulbul v3 (Indic Voice Synthesis)"
        }
    }

@app.post("/api/v1/challan/evaluate")
def evaluate_challan(
    offence_date: str = Form(...),
    notice_date: str = Form(...),
    registered_plate: str = Form(...),
    camera_plate: str = Form(...),
    driver_statement: str = Form(""),
    offence_section: str = Form("Sec 112 / Sec 119")
):
    result = legal_engine.evaluate_challan(
        offence_date_str=offence_date,
        notice_date_str=notice_date,
        registered_plate=registered_plate,
        camera_crop_plate=camera_plate,
        driver_narrative=driver_statement,
        offence_section=offence_section
    )
    return {
        "status": "success",
        "evaluation": result
    }

@app.post("/api/v1/sarvam/tts")
def generate_speech(req: TTSRequest):
    """
    Generate live spoken audio using Sarvam Bulbul v3.
    """
    try:
        text = (req.text or "").strip()
        if not text:
            raise HTTPException(status_code=400, detail="Text parameter cannot be empty.")

        logger.info(f"TTS request: lang={req.target_language_code}, speaker={req.speaker}, text_len={len(text)}")
        data = sarvam_service.text_to_speech(
            text=text,
            target_language_code=req.target_language_code,
            speaker=req.speaker
        )
        return {
            "status": "success",
            "audios": data.get("audios", [])
        }
    except HTTPException:
        raise
    except requests.HTTPError as e:
        body = e.response.text if e.response is not None else str(e)
        logger.error(f"Sarvam TTS API error: {body}")
        raise HTTPException(status_code=502, detail=f"Sarvam TTS Error: {body}")
    except Exception as e:
        logger.error(f"TTS unexpected error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/sarvam/stt")
async def transcribe_speech(
    file: UploadFile = File(...),
    language_code: str = Form("hi-IN")
):
    """
    Transcribe live audio using Sarvam Saaras v4.
    """
    try:
        audio_bytes = await file.read()
        logger.info(f"STT request: language={language_code}, audio_size={len(audio_bytes)} bytes, content_type={file.content_type}")

        if len(audio_bytes) < 100:
            raise HTTPException(status_code=400, detail="Audio too short or empty. Please record at least 1 second of speech.")

        data = sarvam_service.speech_to_text(
            audio_bytes=audio_bytes,
            language_code=language_code
        )
        transcript = data.get("transcript", "")
        logger.info(f"STT result transcript length: {len(transcript)}")
        return {
            "status": "success",
            "transcript": transcript
        }
    except requests.HTTPError as e:
        # Expose Sarvam's actual error body
        body = e.response.text if e.response is not None else str(e)
        logger.error(f"Sarvam STT API error: {body}")
        raise HTTPException(status_code=502, detail=f"Sarvam STT API Error: {body}")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"STT unexpected error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/sarvam/translate")
def translate_text(req: TranslateRequest):
    """
    Translate text using Sarvam Translate API.
    """
    try:
        logger.info(f"Translate request: {req.source_language_code} -> {req.target_language_code}, text_len={len(req.text)}")
        data = sarvam_service.translate(
            input_text=req.text,
            source_lang=req.source_language_code,
            target_lang=req.target_language_code
        )
        return {
            "status": "success",
            "translated_text": data.get("translated_text", "")
        }
    except requests.HTTPError as e:
        body = e.response.text if e.response is not None else str(e)
        logger.error(f"Sarvam Translate API error: {body}")
        raise HTTPException(status_code=502, detail=f"Sarvam Translate Error: {body}")
    except Exception as e:
        logger.error(f"Translate unexpected error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
