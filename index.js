
const readline = require('readline');
const open = require('open');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(q) {
  return new Promise((resolve) => rl.question(q, resolve));
}

(async () => {
  console.clear();
  console.log("=== UNION BRIDGE OPENER ===");

  const direction = await ask("Pilih arah (1 = SEI → XION, 2 = XION → SEI): ");
  const receiver = await ask("Alamat tujuan: ");
  const amount = await ask("Jumlah SEI: ");

  let url = '';

  if (direction === '1') {
    url = `https://app.union.build/transfer?source=1328&destination=xion-testnet-2&asset=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee&receiver=${receiver}&amount=${amount}`;
  } else if (direction === '2') {
    url = `https://app.union.build/transfer?source=xion-testnet-2&destination=1328&asset=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee&receiver=${receiver}&amount=${amount}`;
  } else {
    console.log("❌ Pilihan tidak valid (1 atau 2 saja).");
    rl.close();
    return;
  }

  console.log(`🌐 Membuka browser ke: ${url}`);
  await open(url);
  rl.close();
})();
