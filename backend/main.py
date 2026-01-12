from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from services.scoring import calculate_trust_score
from pydantic import BaseModel
from services.prover import generate_zk_proof

app = FastAPI(title="ZK-Sentinel API", version="0.1.0")

# CORS Setup (Allow Frontend to connect)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "active", "service": "ZK-Sentinel Backend"}

@app.post("/analyze")
async def analyze_financial_data(file: UploadFile = File(...)):
    """
    Takes an uploaded JSON/CSV file, reads it, and generates a Credit Score.
    """
    try:
        # 1. Read the file content
        content = await file.read()
        
        # 2. Decode bytes to string
        text_content = content.decode("utf-8")
        
        # 3. Run the "AI" Analysis
        result = calculate_trust_score(text_content)
        
        return {
            "status": "success",
            "filename": file.filename,
            "data": result
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
class ProofRequest(BaseModel):
    credit_score: int
    threshold: int = 700

@app.post("/prove")
def create_proof(request: ProofRequest):
    """
    Generates a ZK-SNARK proof that credit_score >= threshold.
    """
    result = generate_zk_proof(request.credit_score, request.threshold)
    
    if result["status"] == "error":
         # If proof fails (e.g. score too low), return 400 Bad Request
        raise HTTPException(status_code=400, detail=result)
        
    return result