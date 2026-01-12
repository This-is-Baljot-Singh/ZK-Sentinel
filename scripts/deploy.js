const hre = require("hardhat");

async function main() {
  console.log("Deploying contracts...");

  // 1. Deploy the Auto-Generated Verifier first
  // CRITICAL: Check your contracts/Verifier.sol file. 
  // If the contract name inside is "Verifier" instead of "Groth16Verifier", change the line below!
  const Verifier = await hre.ethers.getContractFactory("Groth16Verifier"); 
  const verifier = await Verifier.deploy();
  await verifier.waitForDeployment();
  const verifierAddress = await verifier.getAddress();
  console.log(`Verifier deployed to: ${verifierAddress}`);

  // 2. Deploy the Sentinel
  const Sentinel = await hre.ethers.getContractFactory("ZKSentinel");
  const sentinel = await Sentinel.deploy(verifierAddress);
  await sentinel.waitForDeployment();
  const sentinelAddress = await sentinel.getAddress();

  console.log(`ZKSentinel deployed to: ${sentinelAddress}`);
  
  // 3. Output for Frontend
  console.log("\n--- COPY THESE FOR FRONTEND ---");
  console.log(`NEXT_PUBLIC_VERIFIER_ADDRESS="${verifierAddress}"`);
  console.log(`NEXT_PUBLIC_SENTINEL_ADDRESS="${sentinelAddress}"`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});