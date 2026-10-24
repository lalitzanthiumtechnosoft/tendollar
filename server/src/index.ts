import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { apiRouter } from './routes/apiRoutes.js';
import { IndexerService } from './services/indexerService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const BSC_RPC = process.env.BSC_RPC_URL || 'https://bsc-dataseed.binance.org/';
const CONTRACT_ADDR = process.env.TENDOLLAR_CONTRACT_ADDRESS || '0x10bEC7aF9606d20f78235777F9217D8e1c668B39';

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRouter);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    server: 'tenDOLLAR Backend & Indexer',
    timestamp: new Date().toISOString(),
    network: 'BNB Smart Chain (BEP-20)',
    version: '1.0.0',
  });
});

// Automated 10-Day Capital Gain Dividend Scheduler
// Cron expression for every 10 days at midnight: '0 0 */10 * *'
cron.schedule('0 0 */10 * *', () => {
  console.log('[Cron] Executing automated 10-day Capital Gain $4 dividend distribution...');
  // Logic to credit $4 to all active $150 subscriptions up to $300 target
});

// Initialize BSC Blockchain Indexer
const indexer = new IndexerService(BSC_RPC, CONTRACT_ADDR);
indexer.startIndexer();

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 tenDOLLAR Backend Server is running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/health`);
  console.log(`📚 Protocol Info: http://localhost:${PORT}/api/system/protocol-info`);
  console.log(`=======================================================`);
});
