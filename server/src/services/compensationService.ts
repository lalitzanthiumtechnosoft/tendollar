/**
 * tenDOLLAR 100% Distribution Mathematical & Compensation Engine
 * Based on BEP-20 Smart Contract Protocol Specifications
 */

export interface DistributionBreakdown {
  packageAmount: number;
  directIncome: number;       // 20%
  matrixReentry: number;      // 20% (Slot 1)
  matrixWithdrawal: number;   // 20% (Slot 2)
  levelIncomeTotal: number;   // 10% (1% x 10 levels)
  levelPerUpline: number;     // 1%
  capitalGainPool: number;    // 20%
  rankRewardsPool: number;    // 10%
}

export class CompensationService {
  /**
   * Calculates the exact 100% distribution breakdown for any given package
   */
  public static calculateDistribution(packageAmount: number): DistributionBreakdown {
    return {
      packageAmount,
      directIncome: packageAmount * 0.20,          // 20% Direct
      matrixReentry: packageAmount * 0.20,         // 20% Matrix Slot 1 (Re-entry)
      matrixWithdrawal: packageAmount * 0.20,      // 20% Matrix Slot 2 (Instant Withdrawal)
      levelIncomeTotal: packageAmount * 0.10,      // 10% Level Income
      levelPerUpline: packageAmount * 0.01,        // 1% each for 10 Levels
      capitalGainPool: packageAmount * 0.20,       // 20% Capital Gain Pool
      rankRewardsPool: packageAmount * 0.10,       // 10% Rank & Rewards Pool
    };
  }

  /**
   * 500% Package Capping Verification
   * Every package can earn up to 500% of its value before requiring a re-upgrade/refresh
   */
  public static checkCappingLimit(currentPackage: number, currentEarned: number, incomingAmount: number): {
    allowedAmount: number;
    cappedOut: boolean;
    excessAmount: number;
  } {
    const maxCap = currentPackage * 5; // 500% capping
    const potentialTotal = currentEarned + incomingAmount;

    if (potentialTotal >= maxCap) {
      const allowedAmount = Math.max(0, maxCap - currentEarned);
      const excessAmount = incomingAmount - allowedAmount;
      return {
        allowedAmount,
        cappedOut: true,
        excessAmount,
      };
    }

    return {
      allowedAmount: incomingAmount,
      cappedOut: false,
      excessAmount: 0,
    };
  }

  /**
   * Rank & Royalty Pool Qualification Evaluator
   * 1-STAR: Self $150 ($10+$20+$40+$80) + 5 Directs with $70 ($10+$20+$40) + Team Size >= 25 -> 20% of 10% pool
   * 2-STAR: Self $160 + 2 Directs with 1-STAR + Team Size >= 150 -> 30% of 10% pool
   * 3-STAR: Self $320 + 2 Directs with 2-STAR + Team Size >= 500 -> 50% of 10% pool
   */
  public static evaluateRank(userData: {
    unlockedTiers: number[];
    directsRankCount: { oneStar: number; twoStar: number };
    directsQualifiedTiersCount: number; // directs with $10+$20+$40 ($70+)
    teamSize: number;
  }): 'NONE' | 'ONE_STAR' | 'TWO_STAR' | 'THREE_STAR' {
    const hasTier320 = userData.unlockedTiers.includes(320);
    const hasTier160 = userData.unlockedTiers.includes(160);
    const has150Upgrade = [10, 20, 40, 80].every((t) => userData.unlockedTiers.includes(t));

    // Check 3-STAR
    if (hasTier320 && userData.directsRankCount.twoStar >= 2 && userData.teamSize >= 500) {
      return 'THREE_STAR';
    }

    // Check 2-STAR
    if (hasTier160 && userData.directsRankCount.oneStar >= 2 && userData.teamSize >= 150) {
      return 'TWO_STAR';
    }

    // Check 1-STAR
    if (has150Upgrade && userData.directsQualifiedTiersCount >= 5 && userData.teamSize >= 25) {
      return 'ONE_STAR';
    }

    return 'NONE';
  }

  /**
   * Calculates 5% Deposit Fee charged upon package activation / deposit
   * Example: $10 package + $0.50 (5% fee) = $10.50 total deposit
   */
  public static calculateDepositFee(packageAmount: number): {
    packageAmount: number;
    depositFee: number;
    totalRequired: number;
  } {
    const depositFee = packageAmount * 0.05; // 5% deposit fee
    const totalRequired = packageAmount + depositFee;
    return {
      packageAmount,
      depositFee,
      totalRequired,
    };
  }

  /**
   * Calculates Withdrawal Deduction (Min $10, 10% deduction)
   */
  public static calculateWithdrawal(amount: number): {
    grossAmount: number;
    fee: number;
    netAmount: number;
    isValid: boolean;
    errorMessage?: string;
  } {
    if (amount < 10) {
      return {
        grossAmount: amount,
        fee: 0,
        netAmount: 0,
        isValid: false,
        errorMessage: 'Minimum withdrawal is $10 USDT',
      };
    }

    const fee = amount * 0.10; // 10% deduction
    const netAmount = amount - fee;

    return {
      grossAmount: amount,
      fee,
      netAmount,
      isValid: true,
    };
  }

  /**
   * Calculates Wallet-to-Wallet / P2P Transfer (Min $5, 5% deduction)
   */
  public static calculateP2PTransfer(amount: number): {
    grossAmount: number;
    fee: number;
    netRecipientAmount: number;
    isValid: boolean;
    errorMessage?: string;
  } {
    if (amount < 5) {
      return {
        grossAmount: amount,
        fee: 0,
        netRecipientAmount: 0,
        isValid: false,
        errorMessage: 'Minimum wallet-to-wallet transfer is $5 USDT',
      };
    }

    const fee = amount * 0.05; // 5% deduction
    const netRecipientAmount = amount - fee;

    return {
      grossAmount: amount,
      fee,
      netRecipientAmount,
      isValid: true,
    };
  }
}
