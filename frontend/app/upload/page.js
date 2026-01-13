"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { verifyIdentity } from "../lib/api";

export default function UploadPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { address, isConnected } = useAccount();
  const router = useRouter();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!isConnected || !address) {
      setError("Please connect your wallet first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Send to Backend
      const result = await verifyIdentity(file, address);
      
      // 2. Store results for the Dashboard
      // In production, use Context/Redux. For Hackathon, localStorage is fine.
      localStorage.setItem("zk_analysis", JSON.stringify(result.analysis));
      localStorage.setItem("zk_proof", JSON.stringify(result.proof_data));

      // 3. Redirect
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-2">Upload Financial Data</h1>
        <p className="text-sm text-gray-500 mb-6">
          Your data is analyzed locally. We generate a ZK Proof bound to your wallet.
        </p>

        {!isConnected ? (
          <div className="flex justify-center my-6">
            <ConnectButton />
          </div>
        ) : (
          <div className="mb-6">
            <div className="bg-green-50 text-green-700 p-2 rounded text-xs mb-4">
              Wallet Connected: {address.slice(0, 6)}...{address.slice(-4)}
            </div>
            
            <input
              type="file"
              accept=".csv,.json,.txt"
              className="w-full border rounded-lg p-3 text-sm cursor-pointer"
              onChange={handleFileUpload}
              disabled={loading}
            />
          </div>
        )}

        {loading && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 animate-pulse">
              🔐 Analyzing Data & Generating ZK Proof...
            </p>
            <p className="text-xs text-gray-400 mt-1">(This may take 10-20 seconds)</p>
          </div>
        )}

        {error && (
          <p className="mt-4 text-sm text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
}