import json
import os
import asyncio
from web3 import Web3

# Import services
from services.scoring import calculate_trust_score 
from services.prover import generate_zk_proof 

# --- BLOCKCHAIN SELECTION ---
# Try importing Solana first, fall back to Mock
try:
    from services.blockchain_solana import submit_proof_on_solana
except ImportError:
    print("⚠️ Solana service not found. Using Mock.")
    def submit_proof_on_solana(proof_data, public_signals):
        return {"tx_hash": "0xMOCK_SOLANA_SIG", "status": "success", "network": "MockSolana"}

# --- AGENT 3: THE RISK OFFICER ---
def run_risk_analysis_agent(interview_data: dict, auditor_data: dict):
    print(f"⚖️ Agent 3 (Risk): Analyzing consistency...")
    
    try:
        claimed_income = int(interview_data.get("reported_income", 0))
    except (ValueError, TypeError):
        claimed_income = 0
        
    try:
        verified_total = int(auditor_data.get("verified_ledger_total", 0))
    except (ValueError, TypeError):
        verified_total = 0
    
    discrepancy = abs(claimed_income - verified_total)
    risk_level = "Low"
    reasoning = "Data is consistent."

    if discrepancy > 20000:
        risk_level = "High"
        reasoning = f"Major Discrepancy! Claimed {claimed_income} vs Verified {verified_total}"
    elif discrepancy > 5000:
        risk_level = "Medium"
        reasoning = f"Minor Discrepancy of {discrepancy} detected."

    return {
        "risk_level": risk_level,
        "reasoning": reasoning,
        "verified_income": verified_total
    }

# --- AGENT 4: THE SCORER ---
def run_scoring_agent(risk_data: dict, financials: dict):
    print(f"📊 Agent 4 (Scorer): Calculating Credit Score...")
    
    analysis_input = f"""
    Risk Level: {risk_data.get('risk_level', 'Unknown')}
    Verified Income: {risk_data.get('verified_income', 0)}
    Discrepancy Notes: {risk_data.get('reasoning', '')}
    """
    
    try:
        ai_result = calculate_trust_score(analysis_input)
        final_score = ai_result.get("score", 650)
    except Exception as e:
        print(f"⚠️ Scoring Service Error: {e}. Using fallback.")
        final_score = 600

    if risk_data.get("risk_level") == "High":
        final_score = min(final_score, 550) 
        
    return {
        "credit_score": final_score,
        "details": risk_data.get("reasoning")
    }

# --- AGENT 5: THE CRYPTOGRAPHER ---
async def run_crypto_agent(score: int, wallet_address: str):
    print(f"🔐 Agent 5 (Cryptographer): Generating ZK-Proof for score {score}...")
    
    if not wallet_address:
        return {"status": "error", "message": "Wallet address missing"}

    try:
        proof_result = await generate_zk_proof(
            credit_score=score, 
            file_content_str="agent_generated", 
            wallet_address=wallet_address,
            threshold=500
        )
        return proof_result
    except Exception as e:
        return {"status": "error", "message": str(e)}

# --- AGENT 6: THE NOTARY (UPDATED FOR SOLANA) ---
async def run_notary_agent(proof_data: dict):
    print(f"📜 Agent 6 (Notary): Minting credential on Solana...")
    
    if proof_data.get("status") == "error":
        return {"status": "skipped", "reason": "Proof generation failed previously."}

    proof = proof_data.get("proof", {})
    public_signals = proof_data.get("public_signals", [])

    if not proof or not public_signals:
        return {"status": "error", "message": "Invalid Proof Data"}

    try:
        # Switch to Solana implementation
        tx_result = submit_proof_on_solana(proof_data=proof, public_signals=public_signals)
        return tx_result
    except Exception as e:
        return {"status": "error", "message": str(e)}