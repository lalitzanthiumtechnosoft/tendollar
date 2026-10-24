import { Router, Request, Response } from 'express';
import { CompensationService } from '../services/compensationService.js';

export const apiRouter = Router();

// In-memory state for user cache
const inMemoryUsers: Record<string, any> = {};

/**
 * GET /api/user/:wallet
 * Fetches user dashboard, package status, and 500% capping information
 */
apiRouter.get('/user/:wallet', (req: Request, res: Response) => {
  const rawWallet = req.params.wallet;
  const wallet = (Array.isArray(rawWallet) ? rawWallet[0] : rawWallet || '').toLowerCase();
  const matchedKey = Object.keys(inMemoryUsers).find((k) => k.toLowerCase() === wallet);

  if (matchedKey) {
    return res.json({ success: true, user: inMemoryUsers[matchedKey] });
  }

  // Auto-provision new member if not exists (Free Registration per PDF)
  const newUser = {
    id: Math.floor(10850 + Math.random() * 500),
    walletAddress: wallet,
    sponsorId: 10001,
    currentPackage: 0,
    unlockedTiers: [],
    rank: 'NONE',
    cappingLimit: 0,
    cappingEarned: 0,
    totalEarned: 0,
    directEarned: 0,
    matrixEarned: 0,
    levelEarned: 0,
    capitalEarned: 0,
    rankEarned: 0,
    directsCount: 0,
    teamSize: 0,
  };
  inMemoryUsers[wallet] = newUser;

  return res.json({ success: true, user: newUser, isNew: true });
});

/**
 * GET /api/distribution/calculate/:packageAmount
 * Returns the exact 100% on-chain smart contract split
 */
apiRouter.get('/distribution/calculate/:packageAmount', (req: Request, res: Response) => {
  const pkgAmt = Number(req.params.packageAmount);
  if (isNaN(pkgAmt) || pkgAmt <= 0) {
    return res.status(400).json({ success: false, error: 'Invalid package amount' });
  }

  const breakdown = CompensationService.calculateDistribution(pkgAmt);
  const depositDetails = CompensationService.calculateDepositFee(pkgAmt);
  return res.json({ success: true, breakdown, depositDetails });
});

/**
 * POST /api/withdraw
 * Executes withdrawal calculation with 10% system deduction
 */
apiRouter.post('/withdraw', (req: Request, res: Response) => {
  const { amount, walletAddress } = req.body;
  const numAmt = Number(amount);

  const result = CompensationService.calculateWithdrawal(numAmt);
  if (!result.isValid) {
    return res.status(400).json({ success: false, error: result.errorMessage });
  }

  return res.json({
    success: true,
    message: `Withdrawal of $${result.netAmount.toFixed(2)} USDT processed on BEP-20.`,
    data: {
      requested: result.grossAmount,
      systemDeduction10Pct: result.fee,
      netCreditedToWallet: result.netAmount,
      walletAddress,
      txHash: `0x${Math.random().toString(16).substring(2, 18)}...`,
    },
  });
});

/**
 * POST /api/p2p-transfer
 * Executes P2P internal transfer with 5% deduction
 */
apiRouter.post('/p2p-transfer', (req: Request, res: Response) => {
  const { amount, recipient, senderWallet } = req.body;
  const numAmt = Number(amount);

  const result = CompensationService.calculateP2PTransfer(numAmt);
  if (!result.isValid) {
    return res.status(400).json({ success: false, error: result.errorMessage });
  }

  return res.json({
    success: true,
    message: `P2P transferred $${result.netRecipientAmount.toFixed(2)} USDT to ${recipient}.`,
    data: {
      transferAmount: result.grossAmount,
      systemDeduction5Pct: result.fee,
      recipientReceives: result.netRecipientAmount,
      recipient,
      senderWallet,
    },
  });
});

/**
 * GET /api/system/protocol-info
 * Returns system parameters and official rules
 */
apiRouter.get('/system/protocol-info', (_req: Request, res: Response) => {
  return res.json({
    success: true,
    protocol: {
      name: 'tenDOLLAR',
      domain: 'WWW.TENDOLLAR.WORLD',
      network: 'BNB Smart Chain (BEP-20)',
      baseCurrency: 'USDT (BEP-20)',
      entryPackage: '$10',
      distributionModel: '100% Peer-to-Peer Smart Contract',
      splits: {
        directIncome: '20%',
        globalMatrix: '40% (2-slot recycling)',
        levelIncome: '10% (1% across 10 levels)',
        capitalGainPlan: '20% ($150 to $300, $4 every 10 days)',
        rankRewards: '10% (1-Star, 2-Star, 3-Star pools)',
      },
      rules: {
        depositFeeCharge: '5% (Deducted upon package deposit)',
        minimumWithdrawal: '$10 (10% deduction)',
        walletTransferP2P: '$5 (5% deduction)',
        cappingLimit: '500% per package',
        adminFees: '0% Free Registration',
      },
    },
  });
});
