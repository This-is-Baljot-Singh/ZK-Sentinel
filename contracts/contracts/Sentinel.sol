// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Interface for the auto-generated Verifier contract
interface IVerifier {
    function verifyProof(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[2] memory input
    ) external view returns (bool);
}

contract ZKSentinel {
    IVerifier public verifier;
    
    // Store Verification Status: Address -> Timestamp (0 means not verified)
    mapping(address => uint256) public verifiedUsers;
    
    event CreditVerified(address indexed user, uint256 timestamp, uint256 scoreThreshold);

    constructor(address _verifierAddress) {
        verifier = IVerifier(_verifierAddress);
    }

    /**
     * @notice Verifies the ZK Proof and binds it to the sender.
     * @param a Proof Point A
     * @param b Proof Point B
     * @param c Proof Point C
     * @param input Public Signals [Threshold, UserAddressDecimal]
     */
    function verifyCreditScore(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[2] memory input
    ) public {
        // --- 1. Policy Check (The "Business Logic") ---
        // Ensure the proof was generated for a threshold of at least 700.
        // Without this, a user could generate a valid proof for "Score > 10".
        require(input[0] >= 700, "Minimum score threshold not met (must be >= 700)");

        // --- 2. Identity Binding (The "Security Logic") ---
        // The circuit took 'userAddress' as a public input.
        // We verify that the proof provided matches the msg.sender.
        // This prevents "Front Running" (stealing someone else's proof).
        uint256 senderInt = uint256(uint160(msg.sender));
        require(input[1] == senderInt, "Proof invalid: Wallet address mismatch!");

        // --- 3. Cryptographic Verification (The "ZK Magic") ---
        // Calls the auto-generated Verifier contract
        bool isValid = verifier.verifyProof(a, b, c, input);
        require(isValid, "Invalid ZK Proof detected");

        // --- 4. State Update ---
        verifiedUsers[msg.sender] = block.timestamp;
        
        emit CreditVerified(msg.sender, block.timestamp, input[0]);
    }

    // Helper for Frontend
    function isVerified(address _user) external view returns (bool) {
        return verifiedUsers[_user] > 0;
    }
}