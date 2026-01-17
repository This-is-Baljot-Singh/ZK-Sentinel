import os
import json
from dotenv import load_dotenv

# Modern Solana imports (solders)
from solana.rpc.api import Client
from solders.keypair import Keypair
from solders.pubkey import Pubkey
from solders.instruction import Instruction
from solders.message import Message
from solders.transaction import Transaction

load_dotenv()

# Configuration
SOLANA_RPC_URL = os.getenv("SOLANA_RPC_URL", "https://api.devnet.solana.com")
PRIVATE_KEY_BYTES = os.getenv("SOLANA_PRIVATE_KEY") 

def get_solana_client():
    return Client(SOLANA_RPC_URL)

def get_payer():
    if not PRIVATE_KEY_BYTES:
        # Generate a dummy keypair for testing if env is missing (prevent crash)
        print("⚠️ SOLANA_PRIVATE_KEY missing. Using random Keypair.")
        return Keypair()
        
    try:
        # Expecting a JSON list of integers: "[12, 44, ...]"
        pk_list = json.loads(PRIVATE_KEY_BYTES)
        return Keypair.from_bytes(bytes(pk_list))
    except Exception as e:
        print(f"Keypair Error: {e}")
        return None

def submit_proof_on_solana(proof_data: dict, public_signals: list):
    """
    Acts as the Solana Notary. 
    Records the Credit Score and Proof Hash as a Memo on the Solana Blockchain.
    """
    client = get_solana_client()
    payer = get_payer()

    if not payer:
        return {"status": "error", "message": "Solana Wallet credentials missing"}

    try:
        # 1. Prepare Data for On-Chain Record
        # signals[0] is usually the Score/Threshold
        score = public_signals[0] if len(public_signals) > 0 else "0"
        
        # Create a short hash of the proof to anchor it
        proof_hash = str(hash(json.dumps(proof_data)))[:16]
        
        memo_data = json.dumps({
            "project": "ZK-Sentinel",
            "type": "CreditVerify",
            "score": str(score),
            "proof_hash": proof_hash
        })
        
        memo_bytes = memo_data.encode("utf-8")

        # 2. Create Memo Instruction
        # Program ID for SPL Memo: MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcQb
        memo_program_id = Pubkey.from_string("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcQb")
        
        # Instruction(program_id, data, accounts)
        memo_ix = Instruction(
            memo_program_id,
            memo_bytes,
            [] # Memo program requires no accounts
        )

        # 3. Build & Sign Transaction
        # Fetch latest blockhash to ensure transaction validity
        recent_blockhash = client.get_latest_blockhash().value.blockhash
        
        # Create a Message containing the instruction
        msg = Message([memo_ix], payer.pubkey())
        
        # Create Transaction object (this automatically signs it with the provided keypair)
        tx = Transaction([payer], msg, recent_blockhash)
        
        # 4. Send Transaction
        # FIX: We only pass the transaction object. 'opts' is optional and defaults to None.
        response = client.send_transaction(tx)
        
        signature = response.value

        return {
            "status": "success", 
            "network": "Solana Devnet",
            "tx_hash": str(signature),
            "explorer_url": f"https://explorer.solana.com/tx/{signature}?cluster=devnet"
        }

    except Exception as e:
        print(f"Solana Notary Error: {e}")
        return {"status": "error", "message": str(e)}