import json
import random

def calculate_trust_score(data_content: str) -> dict:
    """
    Simulates an AI Analysis of financial data.
    In production, this would send 'data_content' to Llama 3 via Groq/OpenAI.
    """
    
    # 1. Parse the incoming data (assuming JSON for now)
    try:
        data = json.loads(data_content)
    except json.JSONDecodeError:
        # Fallback if CSV or raw text
        return {
            "score": 600, 
            "status": "error", 
            "reason": "Invalid JSON format. Using baseline score."
        }

    # 2. Extract "Red Flags" or "Green Flags" (Simple heuristic logic for MVP)
    # This simulates what Llama 3 would look for.
    monthly_income = data.get("average_monthly_income", 0)
    upi_failures = data.get("upi_payment_failures", 0)
    loan_repayments = data.get("loan_repayments_on_time", False)

    base_score = 500

    # Logic: More income = higher score
    if monthly_income > 50000:
        base_score += 150
    elif monthly_income > 20000:
        base_score += 50

    # Logic: Failures = lower score
    if upi_failures > 5:
        base_score -= 50

    # Logic: Good history = higher score
    if loan_repayments:
        base_score += 100

    # Cap score between 300 and 850
    final_score = max(300, min(850, base_score))

    # 3. Return the structured analysis
    return {
        "score": final_score,
        "risk_level": "Low" if final_score > 700 else "Medium" if final_score > 600 else "High",
        "reasoning": f"Analyzed income of {monthly_income} and payment history."
    }