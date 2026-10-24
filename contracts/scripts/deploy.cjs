const hre = require("hardhat");

async function main() {
  console.log("=================================================");
  console.log("🚀 Deploying tenDOLLAR 100% Decentralized Contract");
  console.log("=================================================");

  // BSC Testnet Mock USDT or BSC Mainnet USDT address:
  // BSC Mainnet USDT: 0x55d398326f99059fF775485246999027B3197955
  // BSC Testnet USDT: 0x337610d27c682E347C9cD60BD4b3b107C9d34dDd
  const networkName = hre.network.name;
  let usdtAddress = "0x55d398326f99059fF775485246999027B3197955";

  if (networkName === "bscTestnet") {
    usdtAddress = "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd";
  }

  console.log(`Network: ${networkName}`);
  console.log(`Using USDT Address: ${usdtAddress}`);

  const TenDollar = await hre.ethers.getContractFactory("TenDollarCore");
  const tenDollar = await TenDollar.deploy(usdtAddress);

  await tenDollar.waitForDeployment();
  const deployedAddress = await tenDollar.getAddress();

  console.log(`\n✅ TenDollarCore successfully deployed to: ${deployedAddress}`);
  console.log(`🔗 Verify on BscScan: https://${networkName === "bscTestnet" ? "testnet." : ""}bscscan.com/address/${deployedAddress}`);
  console.log("=================================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
