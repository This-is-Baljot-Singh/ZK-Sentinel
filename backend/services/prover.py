import asyncio
import json
import os
import uuid
import logging

# Configure Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Adjust path if needed to match where Docker sees the 'circuits' folder
CIRCUIT_DIR = os.path.abspath(os.path.join(BASE_DIR, "../circuits")) 
TEMP_DIR = os.path.join(BASE_DIR, "temp_proofs")

os.makedirs(TEMP_DIR, exist_ok=True)

# Artifact Paths
WASM_PATH = os.path.join(CIRCUIT_DIR, "credit_score_js/credit_score.wasm")
WITNESS_GEN_SCRIPT = os.path.join(CIRCUIT_DIR, "credit_score_js/generate_witness.js")
ZKEY_PATH = os.path.join(CIRCUIT_DIR, "credit_score_final.zkey")

def address_to_decimal(addr_str: str) -> str:
    """
    Converts an Ethereum address (hex) to a Decimal string 
    compatible with the BN128 scalar field.
    """
    # Remove '0x' prefix if present
    clean_addr = addr_str.lower().replace("0x", "")
    # Convert hex to int
    addr_int = int(clean_addr, 16)
    return str(addr_int)

async def run_subprocess(cmd: list, description: str):
    logger.info(f"Starting {description}...")
    try:
        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        stdout, stderr = await process.communicate()
        
        if process.returncode != 0:
            error_msg = stderr.decode().strip()
            logger.error(f"{description} failed: {error_msg}")
            raise Exception(f"{description} failed with code {process.returncode}")
            
        return stdout.decode()
    except Exception as e:
        logger.error(f"System Error in {description}: {str(e)}")
        raise e

async def generate_zk_proof(credit_score: int, file_content_str: str, wallet_address: str, threshold: int = 700):
    session_id = str(uuid.uuid4())
    
    # PRODUCTION FIX: Use Address as the Identity Binding
    # We ignore file_content_str for the proof binding now, relying on the Backend AI to validate the file.
    address_decimal = address_to_decimal(wallet_address)
    
    # Validation
    if not os.path.exists(WASM_PATH) or not os.path.exists(ZKEY_PATH):
        logger.critical(f"Circuit artifacts missing at {CIRCUIT_DIR}")
        return {"status": "error", "message": "Circuit artifacts missing."}

    input_data = {
        "creditScore": credit_score,
        "threshold": threshold,
        "userAddress": address_decimal 
    }
    
    input_path = os.path.join(TEMP_DIR, f"input_{session_id}.json")
    witness_path = os.path.join(TEMP_DIR, f"witness_{session_id}.wtns")
    proof_path = os.path.join(TEMP_DIR, f"proof_{session_id}.json")
    public_path = os.path.join(TEMP_DIR, f"public_{session_id}.json")

    try:
        # 1. Write Input
        with open(input_path, "w") as f:
            json.dump(input_data, f)

        # 2. Witness Gen
        await run_subprocess(
            ["node", WITNESS_GEN_SCRIPT, WASM_PATH, input_path, witness_path],
            "Witness Generation"
        )

        # 3. Proof Gen
        await run_subprocess(
            ["snarkjs", "groth16", "prove", ZKEY_PATH, witness_path, proof_path, public_path],
            "Proof Generation"
        )

        # 4. Read Results
        with open(proof_path, "r") as f:
            proof_data = json.load(f)
        
        with open(public_path, "r") as f:
            public_signals = json.load(f)

        return {
            "status": "success",
            "proof": proof_data,
            "public_signals": public_signals,
            "user_address_decimal": address_decimal
        }

    except Exception as e:
        return {"status": "error", "message": "Proof generation failed.", "details": str(e)}
    finally:
        for file in [input_path, witness_path, proof_path, public_path]:
            if os.path.exists(file):
                os.remove(file)