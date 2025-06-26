require('dotenv').config();
const readline = require('readline');
const open = require('open');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
};

(async () => {
  console.log('=== UNION TRANSFER SCRIPT ===');

  const directionInput = await ask('Pilih arah (1 = SEI → XION, 2 = XION → SEI): ');
  const direction = directionInput === '1' ? 'sei-to-xion' : 'xion-to-sei';

  const receiver = await ask('Alamat tujuan: ');
  const amount = await ask('Jumlah SEI: ');

  const base = 'https://app.union.build/transfer';

  let sourceId = process.env.SOURCE_ID;
  let destinationId = process.env.DESTINATION_ID;

  if (direction === 'xion-to-sei') {
    sourceId = 'xion-testnet-2';
    destinationId = '1328';
  }

  const asset = process.env.SEI_NATIVE;
  const url = `${base}?source=${sourceId}&destination=${destinationId}&asset=${asset}&receiver=${receiver}&amount=${amount}`;

  console.log(`\ud83c\udf10 Membuka browser ke: ${url}`);

  try {
    await open(url);
  } catch (err) {
    console.error('Gagal membuka browser:', err.message);
  } finally {
    rl.close();
  }
})();
