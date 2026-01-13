import sys
import os
import json
from typing import Optional, Dict, Any, List

# --- PATH FIX ---
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.append(current_dir)
# ----------------

from fastapi import FastAPI, UploadFile, File, HTTPException, Form, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from services.scoring import calculate_trust_score
from services.prover import generate_zk_proof

app = FastAPI(
    title="ZK-Sentinel API", 
    version="1.0.0",
    description="Backend for verifiable financial identity."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models for Response Documentation ---
class AIAnalysis(BaseModel):
    score: int
    risk_level: str
    reasoning: str

class ProofData(BaseModel):
    proof: Dict[str, Any]
    public_signals: List[str]

class IdentityResponse(BaseModel):
    status: str
    analysis: Optional[AIAnalysis] = None
    proof_data: Optional[ProofData] = None
    error_details: Optional[str] = None

# --- Endpoints ---

@app.get("/")
def read_root():
    return {"status": "active", "service": "ZK-Sentinel Backend"}

@app.post("/verify-identity", response_model=IdentityResponse)
async def verify_identity(
    file: UploadFile = File(...),
    wallet_address: str = Form(..., description="EVM Address to bind the proof to"), 
    threshold: int = Form(700) 
):
    """
    **Core Pipeline:**
    1. **Ingest:** Reads financial data file.
    2. **AI Scoring:** Calculates credit score (Private).
    3. **ZK Proof:** Generates proof that Score > Threshold AND binds it to Wallet Address.
    """
    try:
        # 1. Read File
        content_bytes = await file.read()
        if len(content_bytes) > 500_000: # 500KB limit
             raise HTTPException(status_code=413, detail="File too large.")
        
        content_str = content_bytes.decode("utf-8")

        # 2. AI Analysis (Synchronous)
        # We wrap the dict in our Pydantic model for cleaner usage, but dict usage is fine too.
        analysis_result = calculate_trust_score(content_str)
        
        if analysis_result.get("status") == "error":
            # If AI fails (e.g., safety block), we return a graceful failure
            return {
                "status": "failure",
                "error_details": analysis_result.get("reasoning", "AI Analysis Failed")
            }

        user_score = analysis_result["score"]
        
        # 3. ZK Proof Generation (Async)
        # Pylance Note: We are awaiting an async function. This is correct.
        zk_result = await generate_zk_proof(user_score, content_str, wallet_address, threshold)
        
        if zk_result["status"] == "error":
            return {
                "status": "failure",
                "analysis": analysis_result,
                "error_details": zk_result.get("message")
            }

        # 4. Success Response
        return {
            "status": "success",
            "analysis": analysis_result,
            "proof_data": {
                "proof": zk_result["proof"],
                "public_signals": zk_result["public_signals"]
            }
        }

    except Exception as e:
        print(f"Server Error: {str(e)}")
        # In production, we don't expose raw exception strings to users, but for dev it's helpful
        raise HTTPException(status_code=500, detail=f"System Error: {str(e)}")