import subprocess
import json
import os

# Define paths relative to the Docker container structure
CIRCUIT_DIR = "/app/circuits"
WASM_PATH = os.path.join(CIRCUIT_DIR, "credit_score_js/credit_score.wasm")
WITNESS_GEN_SCRIPT = os.path.join(CIRCUIT_DIR, "credit_score_js/generate_witness.js")
ZKEY_PATH = os.path.join(CIRCUIT_DIR, "credit_score_final.zkey")

def generate_zk_proof(credit_score: int, threshold: int = 700):
    """
    1. Creates input.json
    2. Generates the Witness (Math)
    3. Generates the Proof (Cryptography)
    """
    
    # A. Prepare the Input
    input_data = {
        "creditScore": credit_score,
        "threshold": threshold
    }
    
    input_path = "input.json"
    witness_path = "witness.wtns"
    proof_path = "proof.json"
    public_path = "public.json"

    # Write input.json to disk temporarily
    with open(input_path, "w") as f:
        json.dump(input_data, f)

    try:
        # B. Generate Witness
        # Command: node generate_witness.js credit_score.wasm input.json witness.wtns
        subprocess.run(
            ["node", WITNESS_GEN_SCRIPT, WASM_PATH, input_path, witness_path],
            check=True,
            capture_output=True
        )

        # C. Generate Proof using SnarkJS
        # Command: snarkjs groth16 prove key.zkey witness.wtns proof.json public.json
        subprocess.run(
            ["snarkjs", "groth16", "prove", ZKEY_PATH, witness_path, proof_path, public_path],
            check=True,
            capture_output=True
        )

        # D. Read the results back into Python
        with open(proof_path, "r") as f:
            proof_data = json.load(f)
        
        with open(public_path, "r") as f:
            public_signals = json.load(f)

        return {
            "status": "success",
            "proof": proof_data,
            "public_signals": public_signals
        }

    except subprocess.CalledProcessError as e:
        return {
            "status": "error",
            "message": "Proof generation failed. Score likely below threshold.",
            "details": e.stderr.decode() if e.stderr else str(e)
        }
    finally:
        # Cleanup temp files to keep container clean
        for file in [input_path, witness_path, proof_path, public_path]:
            if os.path.exists(file):
                os.remove(file)