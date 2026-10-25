"""
Sarvam AI Multimodal Service Integration.
Provides live connectors to Sarvam Bulbul (TTS), Saaras (STT), and Translate APIs.
"""
import os
import requests
from dotenv import load_dotenv
from typing import Dict, Any, Optional

load_dotenv()

SARVAM_API_KEY = os.getenv("SARVAM_API_KEY", "")
BASE_URL = "https://api.sarvam.ai"

class SarvamService:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or SARVAM_API_KEY
        self.headers = {
            "api-subscription-key": self.api_key
        }

    def text_to_speech(
        self,
        text: str,
        target_language_code: str = "hi-IN",
        speaker: str = "aditya",
        model: str = "bulbul:v3"
    ) -> Dict[str, Any]:
        """
        Synthesize text into natural-sounding Indic audio using Sarvam Bulbul v3.
        """
        url = f"{BASE_URL}/text-to-speech"
        headers = {
            **self.headers,
            "Content-Type": "application/json"
        }
        payload = {
            "inputs": [text],
            "target_language_code": target_language_code,
            "speaker": speaker,
            "pitch": 0,
            "pace": 1.0,
            "loudness": 1.0,
            "speech_sample_rate": 8000,
            "enable_preprocessing": True,
            "model": model
        }
        res = requests.post(url, headers=headers, json=payload, timeout=20)
        res.raise_for_status()
        return res.json()

    def speech_to_text(
        self,
        audio_bytes: bytes,
        language_code: str = "hi-IN",
        model: str = "saaras:v4"
    ) -> Dict[str, Any]:
        """
        Transcribe spoken audio in Indic languages using Sarvam Saaras.
        """
        url = f"{BASE_URL}/speech-to-text"
        files = {
            "file": ("audio.wav", audio_bytes, "audio/wav")
        }
        data = {
            "model": model,
            "language_code": language_code
        }
        res = requests.post(url, headers=self.headers, files=files, data=data, timeout=30)
        res.raise_for_status()
        return res.json()

    def translate(
        self,
        input_text: str,
        source_lang: str = "en-IN",
        target_lang: str = "hi-IN"
    ) -> Dict[str, Any]:
        """
        Translate between Indian languages and English using Sarvam Translate.
        """
        url = f"{BASE_URL}/translate"
        headers = {
            **self.headers,
            "Content-Type": "application/json"
        }
        payload = {
            "input": input_text,
            "source_language_code": source_lang,
            "target_language_code": target_lang,
            "mode": "formal"
        }
        res = requests.post(url, headers=headers, json=payload, timeout=15)
        res.raise_for_status()
        return res.json()
