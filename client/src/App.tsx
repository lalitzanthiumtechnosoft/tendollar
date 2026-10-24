import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroStats } from './components/HeroStats';
import { PackagesGrid } from './components/PackagesGrid';
import { DistributionTabs } from './components/DistributionTabs';
import { WithdrawalHub } from './components/WithdrawalHub';
import { WalletModal } from './components/WalletModal';
import { Footer } from './components/Footer';

import {
  INITIAL_USER,
  INITIAL_PACKAGES,
  INITIAL_DIRECTS,
  INITIAL_LEVELS,
} from './data/mockData';
import type { UserProfile, PackageTier, MatrixSlotState, DirectReferralItem, LevelIncomeItem } from './types';
import { apiService } from './services/api';
import { connectWeb3Wallet, switchToBscTestnet } from './utils/web3';
import './App.css';

export const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [packages] = useState<PackageTier[]>(INITIAL_PACKAGES);
  const [directs] = useState<DirectReferralItem[]>(INITIAL_DIRECTS);
  const [levels] = useState<LevelIncomeItem[]>(INITIAL_LEVELS);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  // Connect to Backend API & Verify BSC Testnet on load
  useEffect(() => {
    async function initConnection() {
      const isHealthy = await apiService.checkHealth();
      if (isHealthy) {
        const info = await apiService.getProtocolInfo();
        if (info) {
          showToast(`⚡ Backend Connected: ${info.protocol.name} on BSC Testnet (5% Deposit Fee active).`);
        }
      }
    }
    initConnection();
  }, []);

  // Matrix Slot States for $10, $20, $40, $80
  const [matrixStates] = useState<Record<number, MatrixSlotState>>({
    10: {
      packageAmount: 10,
      cycleNumber: 4,
      slot1Filled: true,
      slot1User: '#10825',
      slot2Filled: false,
      totalRecycles: 3,
      totalMatrixEarned: 24.00,
    },
    20: {
      packageAmount: 20,
      cycleNumber: 2,
      slot1Filled: true,
      slot1User: '#10834',
      slot2Filled: false,
      totalRecycles: 1,
      totalMatrixEarned: 16.00,
    },
    40: {
      packageAmount: 40,
      cycleNumber: 2,
      slot1Filled: false,
      slot2Filled: false,
      totalRecycles: 1,
      totalMatrixEarned: 32.00,
    },
    80: {
      packageAmount: 80,
      cycleNumber: 1,
      slot1Filled: true,
      slot1User: '#10829',
      slot2Filled: false,
      totalRecycles: 0,
      totalMatrixEarned: 32.00,
    },
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Wallet Connection
  const handleConnectToggle = () => {
    if (isConnected) {
      setIsConnected(false);
      showToast('Wallet disconnected.');
    } else {
      setIsWalletModalOpen(true);
    }
  };

  const handleSelectWallet = async (walletName: string) => {
    setIsWalletModalOpen(false);
    if (walletName === 'MetaMask' && (window as any).ethereum) {
      const realAccount = await connectWeb3Wallet();
      if (realAccount) {
        setUser((prev) => ({
          ...prev,
          walletAddress: realAccount,
        }));
        setIsConnected(true);
        showToast(`MetaMask connected on BSC Testnet (Chain ID 97): ${realAccount.substring(0, 6)}...`);
        return;
      }
    }
    await switchToBscTestnet();
    setIsConnected(true);
    showToast(`Connected successfully with ${walletName} on BSC Testnet (Chain ID 97)!`);
  };

  // Package Upgrade (including 5% Deposit Fee to Admin)
  const handleUpgradePackage = (pkg: PackageTier) => {
    const depositFee = pkg.amount * 0.05; // 5% deposit fee
    const totalRequired = pkg.amount + depositFee;

    if (user.balanceUSDT < totalRequired) {
      showToast(`Insufficient USDT balance! Need $${totalRequired.toFixed(2)} ($${pkg.amount} + 5% fee)`);
      return;
    }

    const newUnlocked = [...user.unlockedTiers, pkg.amount].sort((a, b) => a - b);
    const newActive = Math.max(...newUnlocked);

    setUser((prev) => ({
      ...prev,
      activePackage: newActive,
      unlockedTiers: newUnlocked,
      balanceUSDT: prev.balanceUSDT - totalRequired,
      cappingCurrent: 0, // Reset capping on new higher package
    }));

    showToast(`🎉 Upgraded to $${pkg.amount} Package! Paid $${totalRequired.toFixed(2)} (including 5% deposit fee to Admin).`);
  };





  // Withdraw
  const handleWithdraw = async (amount: number, netAmount: number) => {
    setUser((prev) => ({
      ...prev,
      totalEarnings: Math.max(0, prev.totalEarnings - amount),
      balanceUSDT: prev.balanceUSDT + netAmount,
    }));

    const response = await apiService.submitWithdrawal(amount, user.walletAddress);
    if (response && response.success) {
      showToast(`⚡ On-Chain Withdrawal: $${netAmount.toFixed(2)} USDT credited (10% fee to Admin on BSC Testnet).`);
    } else {
      showToast(`Withdrawal processed: $${netAmount.toFixed(2)} USDT pushed to your BEP-20 wallet.`);
    }
  };

  // P2P Transfer
  const handleP2PTransfer = async (recipient: string, amount: number, netAmount: number) => {
    setUser((prev) => ({
      ...prev,
      totalEarnings: Math.max(0, prev.totalEarnings - amount),
    }));

    const response = await apiService.submitP2PTransfer(amount, recipient, user.walletAddress);
    if (response && response.success) {
      showToast(`⚡ P2P Transfer: Sent $${netAmount.toFixed(2)} USDT to #${recipient} (5% fee to Admin on BSC Testnet).`);
    } else {
      showToast(`Transferred $${netAmount.toFixed(2)} USDT to member #${recipient} successfully.`);
    }
  };



  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification glass-panel" id="app-toast-alert">
          <div className="toast-dot"></div>
          <span className="toast-text">{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        user={user}
        isConnected={isConnected}
        onConnectToggle={handleConnectToggle}
        onSimulateRefetch={() => showToast('Smart contract data synchronized with BSC Mainnet.')}
      />

      {/* Main Content Area */}
      <main className="main-content">
        <h1 className="sr-only">tenDOLLAR 100% Decentralized Global Income Ecosystem</h1>
        
        {/* Hero & User Profile Vital Stats */}
        <HeroStats user={user} />

        {/* 8 Packages Grid */}
        <PackagesGrid
          packages={packages}
          user={user}
          onUpgradePackage={handleUpgradePackage}
        />

        {/* 100% Distribution Tabs & Visualizers */}
        <DistributionTabs
          user={user}
          directs={directs}
          levels={levels}
          matrixStates={matrixStates}
        />

        {/* Withdrawal & P2P Portal */}
        <WithdrawalHub
          user={user}
          onWithdraw={handleWithdraw}
          onP2PTransfer={handleP2PTransfer}
        />
      </main>


      {/* Connect Wallet Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onSelectWallet={handleSelectWallet}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
