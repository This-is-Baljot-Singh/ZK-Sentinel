# backend/services/voice.py
import os
import requests
import base64

ELEVEN_API_KEY = os.getenv("ELEVEN_API_KEY")

def text_to_speech(text: str):
    """Converts Agent response to Audio"""
    url = "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM"
    headers = {
        "xi-api-key": ELEVEN_API_KEY,
        "Content-Type": "application/json"
    }
    data = {"text": text, "model_id": "eleven_monolingual_v1"}
    
    response = requests.post(url, headers=headers, json=data)
    if response.status_code == 200:
        return base64.b64encode(response.content).decode('utf-8')
    return None