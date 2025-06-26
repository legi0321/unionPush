require("dotenv").config();
const { ethers } = require("ethers");
const axios = require("axios");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const argv = yargs(hideBin(process.argv))
  .option("direction", {
    alias: "d",
    choices: ["sei-to-xion", "xion-to-sei"],
    demandOption: true,
  })
  .option("amount", {
    alias: "a",
    type: "string",
    default: "0.1",
  })
  .option("count", {
    alias: "c",
    type: "number",
    default: 1,
  })
  .argv;

const PRIVATE_KEYS = process.env.PRIVATE_KEYS?.split(",").map(k => k.trim());
const RECEIVER = process.env.RECEIVER;
const UNION_API = "https://app.union.build/api/transfer"; // endpoint baru

if (!PRIVATE_KEYS || !RECEIVER) {
  console.error("❌ PRIVATE_KEYS atau RECEIVER belum diatur.");
  process.exit(1);
}

const config = {
  "sei-to-xion": {
    sourceChain: "sei-evm-testnet",
    destinationChain: "xion-testnet-2",
    rpc: process.env.SEI_RPC,
  },
  "xion-to-sei": {
    sourceChain: "xion-testnet-2",
    destinationChain: "sei-evm-testnet",
    rpc: process.env.XION_RPC,
  },
}[argv.direction];

(async () => {
  const provider = new ethers.JsonRpcProvider(config.rpc);

  for (const [i, key] of PRIVATE_KEYS.entries()) {
    const wallet = new ethers.Wallet(key, provider);
    const sender = await wallet.getAddress();

    console.log(`\n[${i + 1}] 🔐 Wallet: ${sender}`);
    console.log(`➡️  Direction: ${argv.direction}`);
    console.log(`💸 Amount per TX: ${argv.amount}`);
    console.log(`🔁 Total Transfers: ${argv.count}`);

    for (let txNum = 1; txNum <= argv.count; txNum++) {
      try {
        const { data } = await axios.post(UNION_API, {
          source: config.sourceChain,
          destination: config.destinationChain,
          amount: argv.amount,
          asset: "native",
          sender,
          receiver: RECEIVER,
        });

        const tx = await wallet.sendTransaction(data.tx);
        console.log(`🚀 TX #${txNum}: Sent → ${tx.hash}`);
        await tx.wait();
        console.log(`✅ TX #${txNum} confirmed!`);
      } catch (err) {
        console.error(`❌ TX #${txNum} failed:`, err.response?.data || err.message);
      }
    }
  }
})();
