from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from authlib.integrations.starlette_client import OAuth
import os
import shutil
from starlette.responses import RedirectResponse

from agent_tools import (
    run_risk_analysis_agent, 
    run_scoring_agent, 
    run_crypto_agent, 
    run_notary_agent
)
from services.ondemand import create_chat_session, send_chat_message, analyze_document
from services.voice import text_to_speech

# --- CONFIGURATION ---
# load_dotenv() is called in agent_tools or implicitly by OS, but good to ensure
from dotenv import load_dotenv
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "super_secret_key_for_session")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")

app = FastAPI()

# 1. Session Middleware for OAuth
app.add_middleware(SessionMiddleware, secret_key=SECRET_KEY)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. OAuth Setup
oauth = OAuth()
oauth.register(
    name='google',
    client_id=GOOGLE_CLIENT_ID,
    client_secret=GOOGLE_CLIENT_SECRET,
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={
        'scope': 'openid email profile'
    }
)

AGENT_INTERVIEWER_ID = os.getenv("AGENT_INTERVIEWER_ID", "agent-mock")
AGENT_AUDITOR_ID = os.getenv("AGENT_AUDITOR_ID", "agent-mock")

# --- DATA MODELS ---
class ChatRequest(BaseModel):
    session_id: str
    message: str

# --- AUTH ROUTES ---
@app.get("/login")
async def login(request: Request):
    # FIX: Explicitly create client and check for None to satisfy Pylance
    google = oauth.create_client('google')
    if not google:
        raise HTTPException(status_code=500, detail="Google OAuth client not configured")
        
    redirect_uri = request.url_for('auth')
    return await google.authorize_redirect(request, redirect_uri)

@app.get("/auth")
async def auth(request: Request):
    try:
        # FIX: Explicitly create client and check for None
        google = oauth.create_client('google')
        if not google:
            raise HTTPException(status_code=500, detail="Google OAuth client not configured")

        token = await google.authorize_access_token(request)
        user_info = token.get('userinfo')
        request.session['user'] = dict(user_info)
        
        # Redirect to Frontend Dashboard with query param
        return RedirectResponse(url=f"http://localhost:3000/dashboard?user={user_info['name']}")
    except Exception as e:
         raise HTTPException(status_code=400, detail=f"Auth failed: {e}")

@app.get("/user")
async def get_current_user(request: Request):
    user = request.session.get('user')
    if user:
        return {"authenticated": True, "user": user}
    return {"authenticated": False}

@app.get("/logout")
async def logout(request: Request):
    request.session.pop('user', None)
    return {"status": "logged_out"}


# --- ORCHESTRATOR ENDPOINT ---
@app.post("/verify-identity")
async def verify_identity(
    request: Request,
    wallet_address: str = Form(...),
    claimed_income: str = Form(None), 
    file: UploadFile = File(...)
):
    # Optional: Check Auth
    # user = request.session.get('user')
    # if not user:
    #     raise HTTPException(status_code=401, detail="Unauthorized")

    temp_path = f"temp_{file.filename}"
    
    try:
        print(f"📂 Orchestrator: Starting sequence for {wallet_address}")
        
        # 1. Save file locally
        with open(temp_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
        
        # 2. AGENT 2 (Auditor): Analyze Document via OnDemand
        auditor_data = analyze_document(AGENT_AUDITOR_ID, temp_path)
        
        # 3. Integrate AGENT 1 (Interviewer) Data
        if claimed_income and claimed_income.isdigit():
            user_stated_income = int(claimed_income)
        else:
            user_stated_income = auditor_data.get("verified_ledger_total", 0)

        interview_data = {
            "reported_income": user_stated_income
        }

        # 4. AGENT 3 (Risk): Risk Analysis
        risk_result = run_risk_analysis_agent(interview_data, auditor_data)

        # 5. AGENT 4 (Scorer): Scoring
        score_result = run_scoring_agent(risk_result, auditor_data)
        credit_score = score_result["credit_score"]

        # 6. AGENT 5 (Cryptographer): Proof Generation (Async)
        proof_result = await run_crypto_agent(credit_score, wallet_address)

        # 7. AGENT 6 (Notary): Solana Submission
        notary_result = {"status": "skipped", "message": "Proof failed"}
        if proof_result.get("status") == "success":
            notary_result = await run_notary_agent(proof_result)
        
        return {
            "status": "success",
            "orchestration": {
                "interview": interview_data,
                "audit": auditor_data,
                "risk": risk_result,
                "score": score_result,
            },
            "proof_data": proof_result,
            "blockchain_status": notary_result
        }
        
    except Exception as e:
        print(f"❌ Orchestrator Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

# --- INDIVIDUAL AGENT ENDPOINTS ---

@app.post("/api/interview/start")
async def start_interview():
    # Pass a generic user ID for the session
    sid = create_chat_session("user_hackathon_1")
    
    # Pass the AGENT ID for the query
    text = send_chat_message(sid, "Hello, please state your name and income.", AGENT_INTERVIEWER_ID)
    audio = text_to_speech(text) if text else None
    
    return {"session_id": sid, "text": text, "audio": audio}

@app.post("/api/interview/chat")
async def chat(data: ChatRequest):
    text = send_chat_message(data.session_id, data.message, AGENT_INTERVIEWER_ID)
    audio = text_to_speech(text) if text else None
    return {"text": text, "audio": audio}