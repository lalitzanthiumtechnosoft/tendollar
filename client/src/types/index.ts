export interface UserProfile {
  id: string;
  walletAddress: string;
  sponsorAddress: string;
  sponsorId: string;
  activePackage: number; // e.g. 10, 20, 40, 80
  unlockedTiers: number[];
  balanceUSDT: number;
  balanceBNB: number;
  totalEarnings: number;
  directEarnings: number;
  matrixEarnings: number;
  levelEarnings: number;
  capitalGainEarnings: number;
  rankRewardsEarnings: number;
  magicalEarnings: number;
  directReferralsCount: number;
  totalTeamCount: number;
  rank: 'NONE' | '1_STAR' | '2_STAR' | '3_STAR';
  capitalGainActive: boolean;
  capitalGainPaid: number; // e.g. $56 out of $300
  capitalGainDaysLeft: number;
  cappingCurrent: number; // e.g. $400 out of $500 for $80 package
}

export interface PackageTier {
  id: number;
  amount: number;
  directIncome: number; // 20%
  matrixReentry: number; // 50% of 40% = 20%
  matrixWithdrawal: number; // 50% of 40% = 20%
  status: 'active' | 'upcoming';
  description: string;
}

export interface DirectReferralItem {
  id: string;
  walletAddress: string;
  packageAmount: number;
  earnedAmount: number; // 20%
  date: string;
  txHash: string;
}

export interface MatrixSlotState {
  packageAmount: number;
  cycleNumber: number;
  slot1Filled: boolean; // Re-entry
  slot1User?: string;
  slot2Filled: boolean; // Instant Withdrawal
  slot2User?: string;
  totalRecycles: number;
  totalMatrixEarned: number;
}

export interface LevelIncomeItem {
  level: number;
  percentage: number; // 1%
  teamCount: number;
  totalVolume: number;
  earnedAmount: number;
}
