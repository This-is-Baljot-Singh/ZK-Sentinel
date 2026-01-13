"use client";

import { useEffect, useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import ZKAnimation from "../components/ZKAnimation";
import SentinelABI from "../lib/contracts/SentinelABI.json";

// --- CONFIG ---
const SENTINEL_ADDRESS = process.env.NEXT_PUBLIC_SENTINEL_ADDRESS || "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; 

export default function DashboardPage() {
  // ... (Keep all your existing hooks and state logic exactly as it is) ...
  const [analysis, setAnalysis] = useState(null);
  const [proofData, setProofData] = useState(null);
  const { address } = useAccount();

  const { data: hash, isPending: isWritePending, writeContract } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const { data: isAlreadyVerified } = useReadContract({
    address: SENTINEL_ADDRESS,
    abi: SentinelABI,
    functionName: "isVerified",
    args: [address],
    query: {
        enabled: !!address,
    }
  });

  useEffect(() => {
    const storedAnalysis = localStorage.getItem("zk_analysis");
    const storedProof = localStorage.getItem("zk_proof");
    
    if (storedAnalysis) setAnalysis(JSON.parse(storedAnalysis));
    if (storedProof) setProofData(JSON.parse(storedProof));
  }, []);

  const handleVerify = () => {
    if (!proofData) return;
    try {
      const { proof, public_signals } = proofData;
      const pA = [proof.pi_a[0], proof.pi_a[1]];
      const pB = [
        [proof.pi_b[0][1], proof.pi_b[0][0]], 
        [proof.pi_b[1][1], proof.pi_b[1][0]]
      ];
      const pC = [proof.pi_c[0], proof.pi_c[1]];
      const pubSignals = public_signals;

      writeContract({
        address: SENTINEL_ADDRESS,
        abi: SentinelABI,
        functionName: "verifyCreditScore",
        args: [pA, pB, pC, pubSignals],
      });
    } catch (e) {
      console.error("Formatting Error:", e);
      alert("Error preparing proof data.");
    }
  };

  const isProcessing = isWritePending || isConfirming;
  const isSuccess = isConfirmed || isAlreadyVerified;

  return (
    // <Web3Provider>  <-- REMOVE THIS WRAPPER (It's now in layout.js)
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-sm text-gray-500 mb-6">Financial Identity Management</p>

          <div className="mb-6 flex justify-center scale-90 sm:scale-100">
            <ConnectButton />
          </div>

          {/* Analysis Section */}
          {analysis && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Private Analysis</p>
              <div className="flex justify-between items-center mt-2">
                 <span>Credit Score:</span>
                 <span className="font-bold">{analysis.score}</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                 <span>Risk Level:</span>
                 <span className={`font-bold ${analysis.risk_level === 'Low' ? 'text-green-600' : 'text-yellow-600'}`}>
                   {analysis.risk_level}
                 </span>
              </div>
            </div>
          )}

          <ZKAnimation active={isProcessing} />

          {isSuccess ? (
            <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-xl border border-green-200">
               <p className="text-2xl mb-1">✅</p>
               <p className="font-bold">Identity Verified</p>
               <p className="text-xs mt-1">Your creditworthiness is on-chain.</p>
            </div>
          ) : (
            <button
              onClick={handleVerify}
              disabled={isProcessing || !proofData}
              className={`w-full px-6 py-3 rounded-xl text-white transition mt-4 ${
                isProcessing || !proofData
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-900"
              }`}
            >
              {isProcessing ? "Verifying on Blockchain..." : "Verify Identity On-Chain"}
            </button>
          )}

          {hash && <div className="mt-4 text-xs text-blue-500 break-all">Tx: {hash}</div>}
          
        </div>
      </div>
  );
}