// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

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
    
    event CreditVerified(address indexed user, uint256 timestamp);
    mapping(address => bool) public hasVerified;

    constructor(address _verifierAddress) {
        verifier = IVerifier(_verifierAddress);
    }

    /**
     * @notice Verifies the ZK Proof with Identity Binding.
     * @param input Public signals from the circuit.
     * input[0] = Threshold (e.g. 700)
     * input[1] = User Address (Decimal format)
     */
    function verifyCreditScore(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[2] memory input 
    ) public {
        // 1. Check Threshold
        require(input[0] >= 700, "Score threshold not met");

        // 2. Check Identity Binding (Replay Protection)
        // We cast the msg.sender to uint256 to match the circuit's field element
        require(input[1] == uint256(uint160(msg.sender)), "Proof belongs to a different address!");

        // 3. Verify Proof
        bool isValid = verifier.verifyProof(a, b, c, input);
        require(isValid, "Invalid ZK Proof");

        // 4. Update state
        hasVerified[msg.sender] = true;
        emit CreditVerified(msg.sender, block.timestamp);
    }
    
    function isVerified(address _user) external view returns (bool) {
        return hasVerified[_user];
    }
}