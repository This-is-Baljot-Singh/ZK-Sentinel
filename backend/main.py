import sys
import os

# --- PATH FIX ---
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.append(current_dir)
# ----------------

from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware

from services.scoring import calculate_trust_score
# Import the new async prover
from services.prover import generate_zk_proof

app = FastAPI(title="ZK-Sentinel API", version="0.3.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "active", "service": "ZK-Sentinel Backend v3 (Async+Binding)"}

@app.post("/verify-identity")
async def verify_identity(
    file: UploadFile = File(...),
    wallet_address: str = Form(...),  # NEW: Required for Identity Binding
    threshold: int = Form(700) 
):
    """
    FULL FLOW: 
    1. Upload File & Wallet Address
    2. AI Analysis (Calculate Score)
    3. Generate ZK Proof (Score + Address Binding)
    4. Return Proof
    """
    try:
        # 1. Read File
        content_bytes = await file.read()
        content_str = content_bytes.decode("utf-8")
        
        # Security: Prevent DoS with massive files
        if len(content_str) > 500_000: # 500KB limit
             raise HTTPException(status_code=413, detail="File too large.")

        # 2. AI Analysis
        # Note: calculate_trust_score is synchronous. In a super-high scale app, 
        # you'd run this in a threadpool too, but for hackathon, this is fine.
        analysis_result = calculate_trust_score(content_str)
        
        if analysis_result.get("status") == "error":
            raise HTTPException(status_code=400, detail=analysis_result.get("reason"))

        user_score = analysis_result["score"]
        
        # 3. ZK Proof Generation (Async)
        # We pass the wallet_address to bind the proof to this specific user.
        zk_result = await generate_zk_proof(user_score, content_str, wallet_address, threshold)
        
        if zk_result["status"] == "error":
            return {
                "status": "failure",
                "analysis": analysis_result,
                "zk_error": zk_result["message"],
                "debug_details": zk_result.get("details")
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
        raise HTTPException(status_code=500, detail=f"System Error: {str(e)}")