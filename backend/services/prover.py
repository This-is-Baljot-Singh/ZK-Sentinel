import asyncio
import json
import os
import uuid
import logging
from typing import Dict, Any, Optional

# Configure Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CIRCUIT_DIR = os.path.abspath(os.path.join(BASE_DIR, "../circuits")) 
TEMP_DIR = os.path.join(BASE_DIR, "temp_proofs")

os.makedirs(TEMP_DIR, exist_ok=True)

# Artifact Paths
WASM_PATH = os.path.join(CIRCUIT_DIR, "credit_score_js/credit_score.wasm")
WITNESS_GEN_SCRIPT = os.path.join(CIRCUIT_DIR, "credit_score_js/generate_witness.js")
ZKEY_PATH = os.path.join(CIRCUIT_DIR, "credit_score_final.zkey")

def address_to_decimal(addr_str: str) -> str:
    """
    Converts EVM address (hex) to BN128 Scalar Field compliant decimal.
    Matches the 'userAddress' input in credit_score.circom.
    """
    try:
        clean_addr = addr_str.lower().strip().replace("0x", "")
        addr_int = int(clean_addr, 16)
        return str(addr_int)
    except ValueError:
        raise ValueError("Invalid Wallet Address format")

async def run_subprocess(cmd: list, description: str):
    """Async wrapper for subprocess calls."""
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
            raise Exception(f"{description} failed: {error_msg}")
            
        return stdout.decode()
    except Exception as e:
        logger.error(f"System Error in {description}: {str(e)}")
        raise e

async def generate_zk_proof(
    credit_score: int, 
    file_content_str: str, 
    wallet_address: str, 
    threshold: int = 700
) -> Dict[str, Any]:
    """
    Generates a ZK-SNARK proof binding the Credit Score to the Wallet Address.
    """
    # 1. Initialize variables to None to prevent 'UnboundLocalError' in finally block
    input_path: Optional[str] = None
    witness_path: Optional[str] = None
    proof_path: Optional[str] = None
    public_path: Optional[str] = None
    
    session_id = str(uuid.uuid4())

    try:
        # 2. Pre-Check Artifacts (Fail Fast)
        if not os.path.exists(WASM_PATH) or not os.path.exists(ZKEY_PATH):
            logger.critical(f"Missing ZK Artifacts! Looked in: {CIRCUIT_DIR}")
            return {"status": "error", "message": "Server Misconfiguration: ZK Artifacts missing."}

        # 3. Format Inputs
        # This converts the address to the decimal format the Circuit expects
        address_decimal = address_to_decimal(wallet_address)
        
        input_data = {
            "creditScore": credit_score,
            "threshold": threshold,
            "userAddress": address_decimal 
        }

        # 4. Define Paths
        input_path = os.path.join(TEMP_DIR, f"input_{session_id}.json")
        witness_path = os.path.join(TEMP_DIR, f"witness_{session_id}.wtns")
        proof_path = os.path.join(TEMP_DIR, f"proof_{session_id}.json")
        public_path = os.path.join(TEMP_DIR, f"public_{session_id}.json")

        # 5. Write Input File
        with open(input_path, "w") as f:
            json.dump(input_data, f)

        # 6. Generate Witness (NodeJS)
        await run_subprocess(
            ["node", WITNESS_GEN_SCRIPT, WASM_PATH, input_path, witness_path],
            "Witness Generation"
        )

        # 7. Generate Proof (SnarkJS)
        await run_subprocess(
            ["snarkjs", "groth16", "prove", ZKEY_PATH, witness_path, proof_path, public_path],
            "Proof Generation"
        )

        # 8. Read & Return Results
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
        logger.error(f"Proof Gen Failed: {e}")
        return {
            "status": "error", 
            "message": "Proof generation failed.", 
            "details": str(e)
        }
    
    finally:
        # 9. Robust Cleanup
        # Only try to delete if the variable is not None and the file exists
        cleanup_targets = [input_path, witness_path, proof_path, public_path]
        for target in cleanup_targets:
            if target and os.path.exists(target):
                try:
                    os.remove(target)
                except Exception:
                    pass