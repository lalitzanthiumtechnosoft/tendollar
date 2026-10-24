import type { PackageTier, DirectReferralItem, LevelIncomeItem, UserProfile } from '../types';

export const INITIAL_PACKAGES: PackageTier[] = [
  { id: 1, amount: 10, directIncome: 2, matrixReentry: 4, matrixWithdrawal: 4, status: 'active', description: 'Entry-level BEP-20 package' },
  { id: 2, amount: 20, directIncome: 4, matrixReentry: 8, matrixWithdrawal: 8, status: 'active', description: 'Tier 2 Fast-track accelerator' },
  { id: 3, amount: 40, directIncome: 8, matrixReentry: 16, matrixWithdrawal: 16, status: 'active', description: 'Tier 3 Matrix multiplier' },
  { id: 4, amount: 80, directIncome: 16, matrixReentry: 32, matrixWithdrawal: 32, status: 'active', description: 'Tier 4 High-yield package' },
  { id: 5, amount: 160, directIncome: 32, matrixReentry: 64, matrixWithdrawal: 64, status: 'upcoming', description: 'Upcoming Elite package' },
  { id: 6, amount: 320, directIncome: 64, matrixReentry: 128, matrixWithdrawal: 128, status: 'upcoming', description: 'Upcoming Pro package' },
  { id: 7, amount: 640, directIncome: 128, matrixReentry: 256, matrixWithdrawal: 256, status: 'upcoming', description: 'Upcoming Master package' },
  { id: 8, amount: 1280, directIncome: 256, matrixReentry: 512, matrixWithdrawal: 512, status: 'upcoming', description: 'Upcoming Whale package' },
];

export const INITIAL_USER: UserProfile = {
  id: '',
  walletAddress: '',
  sponsorAddress: '0x0000000000000000000000000000000000000000',
  sponsorId: '10001',
  activePackage: 0,
  unlockedTiers: [],
  balanceUSDT: 0.00,
  balanceBNB: 0.000,
  totalEarnings: 0.00,
  directEarnings: 0.00,
  matrixEarnings: 0.00,
  levelEarnings: 0.00,
  capitalGainEarnings: 0.00,
  rankRewardsEarnings: 0.00,
  magicalEarnings: 0.00,
  directReferralsCount: 0,
  totalTeamCount: 0,
  rank: 'NONE',
  capitalGainActive: false,
  capitalGainPaid: 0.00,
  capitalGainDaysLeft: 0,
  cappingCurrent: 0,
};

export const INITIAL_DIRECTS: DirectReferralItem[] = [];

export const INITIAL_LEVELS: LevelIncomeItem[] = Array.from({ length: 10 }, (_, i) => ({
  level: i + 1,
  percentage: 1,
  teamCount: 0,
  totalVolume: 0,
  earnedAmount: 0.0,
}));

