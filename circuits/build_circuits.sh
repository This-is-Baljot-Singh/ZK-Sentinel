#!/bin/bash
set -e

# 1. Compile the Circuit
echo "Compiling Circuit..."
circom credit_score.circom --r1cs --wasm --sym --c -o .

# 2. Powers of Tau (The Ceremony - simplified for Hackathon)
# In real production, we'd use a larger power and a real ceremony.
# Power 12 is enough for ~4k constraints.
if [ ! -f pot12_final.ptau ]; then
    echo "Downloading/Generating Powers of Tau..."
    snarkjs powersoftau new bn128 12 pot12_0000.ptau -v
    snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="FirstContribution" -v
    snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau -v
fi

# 3. Phase 2 Setup (Groth16)
echo "Generating zKey..."
snarkjs groth16 setup credit_score.r1cs pot12_final.ptau credit_score_0000.zkey
snarkjs zkey contribute credit_score_0000.zkey credit_score_final.zkey --name="SecondContribution" -v -e="random_entropy"
snarkjs zkey export verificationkey credit_score_final.zkey verification_key.json

echo "Artifacts generated: credit_score_js/credit_score.wasm and credit_score_final.zkey"