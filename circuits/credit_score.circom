pragma circom 2.0.0;

include "node_modules/circomlib/circuits/comparators.circom";

template CreditCheck() {
    // 1. Private Input: The User's Credit Score
    signal input creditScore;
    
    // 2. Public Input: The Threshold (e.g., 700)
    signal input threshold;
    
    // 3. Public Input: The User's Wallet Address (converted to Int)
    // This creates an unbreakable link between the proof and the sender.
    signal input userAddress;

    // 4. Check if Qualified
    component ge = GreaterEqThan(16);
    ge.in[0] <== creditScore;
    ge.in[1] <== threshold;

    // 5. Enforce Qualification
    ge.out === 1;

    // 6. Anchor the Address (Dummy constraint to ensure it's included in public signals)
    signal addressSquared;
    addressSquared <== userAddress * userAddress;
}

// Public inputs: Threshold AND userAddress
component main {public [threshold, userAddress]} = CreditCheck();