"use client";

import { useEffect, useState } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { sepolia, hardhat } from "wagmi/chains"; // Import hardhat
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Define the chains based on environment
const chains = [
  hardhat, // Development
  sepolia  // Production
];

const config = getDefaultConfig({
  appName: "ZK-Sentinel",
  projectId: "zk-sentinel-demo", // Get a real one from WalletConnect for production
  chains: chains,
  ssr: true, // Server-side rendering support
});

const queryClient = new QueryClient();

export default function Web3Provider({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}