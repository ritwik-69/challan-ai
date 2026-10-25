import os
import requests
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("SARVAM_API_KEY")

print(f"Loaded API key prefix: {api_key[:10]}...")

# Test Sarvam Text-to-Speech (Bulbul)
headers = {
    "api-subscription-key": api_key,
    "Content-Type": "application/json"
}

payload = {
    "inputs": ["नमस्ते। चालान-न्याय में आपका स्वागत है।"],
    "target_language_code": "hi-IN",
    "speaker": "aditya",
    "pitch": 0,
    "pace": 1.0,
    "loudness": 1.0,
    "speech_sample_rate": 8000,
    "enable_preprocessing": True,
    "model": "bulbul:v3"
}

try:
    print("Testing Sarvam Bulbul TTS API...")
    res = requests.post("https://api.sarvam.ai/text-to-speech", headers=headers, json=payload, timeout=15)
    print(f"Status Code: {res.status_code}")
    if res.status_code == 200:
        data = res.json()
        print("Success! Audio returned, audios count:", len(data.get("audios", [])))
    else:
        print("Response body:", res.text[:200])
except Exception as e:
    print("Request exception:", e)
