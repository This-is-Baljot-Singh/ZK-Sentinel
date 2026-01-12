pragma circom 2.0.0;

// Import the comparator from circomlib
include "node_modules/circomlib/circuits/comparators.circom";

template CreditCheck() {
    // 1. Private Input: The User's Credit Score (from AI)
    signal input creditScore;

    // 2. Public Input: The Lender's Requirement (e.g., 700)
    signal input threshold;

    // 3. Output: 1 if qualified, 0 if not (though we usually constrain this)
    signal output isQualified;

    // 4. Component: GreaterEqThan(n) where n is number of bits
    // 16 bits is enough for scores up to 65535 (Credit scores are max 900)
    component ge = GreaterEqThan(16);

    ge.in[0] <== creditScore;
    ge.in[1] <== threshold;

    // 5. Assign result to output
    isQualified <== ge.out;

    // 6. Constraint: We strictly ENFORCE that the user MUST be qualified to generate a valid proof.
    // If creditScore < threshold, proof generation will FAIL completely.
    isQualified === 1;
}

// Main component with public inputs explicitly defined
component main {public [threshold]} = CreditCheck();