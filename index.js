// Import required modules
const { Connection, PublicKey, clusterApiUrl } = require('@solana/web3.js');
const axios = require('axios');

// Solana RPC Connection
const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = '8187838666:AAGJ_rAo3ewwy5A_qyKeiNrDzQwNzfwLzJk'; // Replace with your bot token
const TELEGRAM_CHAT_ID = '6209671336'; // Replace with your chat ID

// Solana Wallet to Monitor
const WALLET_PUBLIC_KEY = '7VBTpiiEjkwRbRGHJFUz6o5fWuhPFtAmy8JGhNqwHNnn'; // Replace with your wallet public key

// Function to send a Telegram message
const sendTelegramMessage = async (message) => {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  try {
    await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
    });
    console.log('Telegram notification sent:', message);
  } catch (error) {
    console.error('Error sending Telegram notification:', error.response?.data || error.message);
  }
};

// Function to process account changes
const processAccountChange = async (accountInfo) => {
  console.log('Account change detected:', accountInfo);
  const message = `Transaction detected for wallet ${WALLET_PUBLIC_KEY}\nBalance change or activity detected.`;
  await sendTelegramMessage(message);
};

// Monitor the wallet for changes
const monitorWallet = async () => {
  try {
    const publicKey = new PublicKey(WALLET_PUBLIC_KEY);
    console.log(`Monitoring wallet: ${WALLET_PUBLIC_KEY}`);
    connection.onAccountChange(publicKey, async (accountInfo) => {
      await processAccountChange(accountInfo);
    });
  } catch (error) {
    console.error('Error monitoring wallet:', error.message);
  }
};

// Start the monitoring process
(async () => {
  console.log('Starting Solana wallet monitor...');
  await monitorWallet();
})();
