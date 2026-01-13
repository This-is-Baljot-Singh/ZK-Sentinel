import os
import json
from google import genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def calculate_trust_score(data_content: str) -> dict:
    """
    Sends financial data to Gemini 2.0 via the google-genai SDK.
    Returns a structured dictionary with score and reasoning.
    """
    try:
        # 1. Initialize the Client
        client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

        prompt = f"""
        You are an advanced AI Financial Underwriter for ZK-Sentinel. 
        Analyze the following raw financial data and assign a Credit Score between 300 (High Risk) and 850 (Excellent).
        
        Rules:
        1. Analyze income stability, repayment history, and spending behavior.
        2. High Income (>50k) and timely repayments -> Higher Score (>700).
        3. Payment failures or erratic cash flow -> Lower Score (<600).
        
        Data to Analyze:
        {data_content}
        """

        # 2. Generate Content
        # We use 'response_mime_type' to force valid JSON output natively
        response = client.models.generate_content(
            model='gemini-flash-latest', 
            contents=prompt,
            config={
                'response_mime_type': 'application/json',
                'response_schema': {
                    "type": "OBJECT",
                    "properties": {
                        "score": {"type": "INTEGER"},
                        "risk_level": {"type": "STRING", "enum": ["Low", "Medium", "High"]},
                        "reasoning": {"type": "STRING"}
                    },
                    "required": ["score", "risk_level", "reasoning"]
                }
            }
        )
        
        # 3. Validation & Parsing
        # Check if text exists before stripping
        if not response.text:
            print("Block Reason:", response.candidates[0].finish_reason if response.candidates else "Unknown")
            raise ValueError("Model returned an empty response (likely triggered safety filters).")

        # Since we used JSON mode, we don't need to strip ```json markdown
        analysis_result = json.loads(response.text)
        
        return analysis_result

    except Exception as e:
        print(f"AI Error: {e}")
        return {
            "score": 600,
            "status": "error",
            "risk_level": "Unknown",
            "reasoning": "AI Service Unavailable. Returning baseline score."
        }