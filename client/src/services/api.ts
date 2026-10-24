const API_BASE_URL = 'http://localhost:5000/api';

export interface ProtocolInfoResponse {
  success: boolean;
  protocol: {
    name: string;
    domain: string;
    network: string;
    baseCurrency: string;
    entryPackage: string;
    distributionModel: string;
    splits: Record<string, string>;
    rules: Record<string, string>;
  };
}

export interface DistributionBreakdownResponse {
  success: boolean;
  breakdown: {
    packageAmount: number;
    directIncome: number;
    matrixReentry: number;
    matrixWithdrawal: number;
    levelIncomeTotal: number;
    levelPerUpline: number;
    capitalGainPool: number;
    rankRewardsPool: number;
  };
  depositDetails: {
    packageAmount: number;
    depositFee: number;
    totalRequired: number;
  };
}

export const apiService = {
  /**
   * Health check
   */
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch('http://localhost:5000/health');
      const data = await res.json();
      return data.status === 'OK';
    } catch (e) {
      console.warn('Backend server not reachable on localhost:5000', e);
      return false;
    }
  },

  /**
   * Fetch protocol info & system parameters
   */
  async getProtocolInfo(): Promise<ProtocolInfoResponse | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/system/protocol-info`);
      return await res.json();
    } catch (e) {
      console.warn('Failed to fetch protocol info', e);
      return null;
    }
  },

  /**
   * Fetch live 100% distribution + 5% deposit fee breakdown
   */
  async getDistributionBreakdown(packageAmount: number): Promise<DistributionBreakdownResponse | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/distribution/calculate/${packageAmount}`);
      return await res.json();
    } catch (e) {
      console.warn('Failed to calculate breakdown', e);
      return null;
    }
  },

  /**
   * Submit withdrawal to backend (10% system deduction)
   */
  async submitWithdrawal(amount: number, walletAddress: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, walletAddress }),
      });
      return await res.json();
    } catch (e) {
      console.warn('Withdrawal API request failed', e);
      return { success: false, error: 'Network error connecting to backend' };
    }
  },

  /**
   * Submit P2P transfer (5% system deduction)
   */
  async submitP2PTransfer(amount: number, recipient: string, senderWallet: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/p2p-transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, recipient, senderWallet }),
      });
      return await res.json();
    } catch (e) {
      console.warn('P2P API request failed', e);
      return { success: false, error: 'Network error connecting to backend' };
    }
  },

  /**
   * Fetch or sync user profile
   */
  async getUserProfile(walletAddress: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/user/${walletAddress}`);
      return await res.json();
    } catch (e) {
      console.warn('User API request failed', e);
      return null;
    }
  },
};
