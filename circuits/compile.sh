#!/bin/bash
set -e # Stop on error

echo "🔹 1. Compiling Circuit..."
# Generates credit_score.r1cs, credit_score.sym, and credit_score_js/
circom credit_score.circom --r1cs --wasm --sym

echo "🔹 2. Setup Groth16 (Phase 2)..."
# Setup using your existing Powers of Tau file (pot12_final.ptau)
snarkjs groth16 setup credit_score.r1cs pot12_final.ptau credit_score_0000.zkey

echo "🔹 3. Ceremony (ZKey Contribution)..."
# Contribute randomness to create the final zkey
echo "random text" | snarkjs zkey contribute credit_score_0000.zkey credit_score_final.zkey --name="SentinelContributor" -v

echo "🔹 4. Export Verification Key..."
snarkjs zkey export verificationkey credit_score_final.zkey verification_key.json

echo "✅ Compilation Complete! Artifacts updated."