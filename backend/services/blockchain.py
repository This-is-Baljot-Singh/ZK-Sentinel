import os
import json
from web3 import Web3
from dotenv import load_dotenv

load_dotenv()

# Configuration
RPC_URL = os.getenv("POLYGON_RPC_URL", "https://rpc-amoy.polygon.technology/")
PRIVATE_KEY = os.getenv("PRIVATE_KEY") # The wallet paying for gas
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")

# ABI - We only need the verifyCreditScore function
MINIMAL_ABI = [
    {
        "inputs": [
            {"internalType": "uint256[2]", "name": "a", "type": "uint256[2]"},
            {"internalType": "uint256[2][2]", "name": "b", "type": "uint256[2][2]"},
            {"internalType": "uint256[2]", "name": "c", "type": "uint256[2]"},
            {"internalType": "uint256[2]", "name": "input", "type": "uint256[2]"}
        ],
        "name": "verifyCreditScore",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

def submit_proof_on_chain(proof_data: dict, public_signals: list):
    """
    Acts as the 'Notary'. Submits the ZK Proof to Polygon.
    """
    if not PRIVATE_KEY or not CONTRACT_ADDRESS:
        return {"status": "error", "message": "Blockchain credentials missing"}

    try:
        w3 = Web3(Web3.HTTPProvider(RPC_URL))
        if not w3.is_connected():
            return {"status": "error", "message": "Could not connect to Polygon"}

        account = w3.eth.account.from_key(PRIVATE_KEY)

        # FIX 1: Convert string address to Checksum Address
        # Pylance requires this specific format to accept it as an address
        checksum_address = w3.to_checksum_address(CONTRACT_ADDRESS)

        contract = w3.eth.contract(address=checksum_address, abi=MINIMAL_ABI)

        # 1. Format Proof for Solidity
        p_a = [int(x) for x in proof_data["pi_a"][0:2]]
        p_b = [[int(x) for x in row] for row in proof_data["pi_b"][0:2]]
        p_c = [int(x) for x in proof_data["pi_c"][0:2]]
        p_input = [int(x) for x in public_signals]

        # 2. Build Transaction
        tx = contract.functions.verifyCreditScore(
            p_a, p_b, p_c, p_input
        ).build_transaction({
            'from': account.address,
            'nonce': w3.eth.get_transaction_count(account.address),
            'gas': 500000,
            'gasPrice': w3.eth.gas_price
        })

        # 3. Sign & Send
        signed_tx = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        
        # 4. Wait for Receipt
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

        # FIX 2: Use bracket notation for TypedDict access
        # receipt is an AttributeDict, but Pylance treats it strictly as a Dict
        return {
            "status": "success", 
            "tx_hash": tx_hash.hex(),
            "block_number": receipt["blockNumber"] 
        }

    except Exception as e:
        print(f"Blockchain Error: {e}")
        return {"status": "error", "message": str(e)}