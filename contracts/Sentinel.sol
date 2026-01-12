// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Interface to talk to the auto-generated Verifier contract
interface IVerifier {
    function verifyProof(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[1] memory input
    ) external view returns (bool);
}

contract ZKSentinel {
    IVerifier public verifier;
    
    // Event to notify the frontend that verification succeeded
    event CreditVerified(address indexed user, uint256 timestamp);

    // Mapping to store user status so they don't have to prove again
    mapping(address => bool) public hasVerified;

    constructor(address _verifierAddress) {
        verifier = IVerifier(_verifierAddress);
    }

    function verifyCreditScore(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[1] memory input
    ) public {
        // 1. Check if the proof is valid on-chain
        // input[0] is the public signal. In our circuit, 
        // we didn't output the score, only the "threshold" is public?
        // Actually, for the logic `creditScore >= threshold`, usually `threshold` is a public input.
        
        bool isValid = verifier.verifyProof(a, b, c, input);
        require(isValid, "Invalid ZK Proof: Credit Score not met or proof forged.");

        // 2. Update state
        hasVerified[msg.sender] = true;

        // 3. Emit event for the UI
        emit CreditVerified(msg.sender, block.timestamp);
    }
    
    // Helper to check status
    function isVerified(address _user) external view returns (bool) {
        return hasVerified[_user];
    }
}