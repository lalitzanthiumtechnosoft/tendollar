import React, { useState } from 'react';
import { Wallet, ShieldCheck, ExternalLink, Copy, Check, ChevronDown, RefreshCw } from 'lucide-react';
import type { UserProfile } from '../types';

interface NavbarProps {
  user: UserProfile;
  isConnected: boolean;
  onConnectToggle: () => void;
  onSimulateRefetch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  isConnected,
  onConnectToggle,
  onSimulateRefetch,
}) => {
  const [copiedContract, setCopiedContract] = useState(false);
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);

  const CONTRACT_ADDRESS = '0xa8A184Be78cAa345EeDC1c6A07cc0E7FB72E8D9f';

  const copyContract = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  const truncateAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <div className="brand-logo" id="brand-logo">
          <div className="logo-icon-wrapper">
            <span className="logo-dollar">$</span>
            <div className="logo-glow-ring"></div>
          </div>
          <div className="logo-text-group">
            <div className="logo-title">
              TEN<span className="logo-highlight">DOLLAR</span>
            </div>
            <div className="logo-subtitle">100% DECENTRALIZED BEP-20</div>
          </div>
        </div>

        {/* Middle Network & Contract Info */}
        <div className="navbar-middle-info">
          <div className="network-badge" title="Connected to BSC Testnet (Chain ID 97)">
            <span className="pulsing-green-dot"></span>
            <span className="network-name">BSC Testnet</span>
            <span className="bep-tag">Chain: 97</span>
          </div>

          <div className="contract-pill" onClick={copyContract} title="Click to copy BEP-20 Smart Contract Address">
            <ShieldCheck size={14} className="contract-icon" />
            <span className="contract-text font-mono">{truncateAddress(CONTRACT_ADDRESS)}</span>
            {copiedContract ? (
              <Check size={14} className="text-emerald" />
            ) : (
              <Copy size={13} className="copy-icon" />
            )}
            <a
              href={`https://testnet.bscscan.com/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bsc-link"
              title="View on BSCScan Testnet"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Right Action: Wallet & Controls */}
        <div className="navbar-actions">
          <button
            className="btn btn-secondary btn-sm sync-btn"
            onClick={onSimulateRefetch}
            title="Sync blockchain data"
            id="sync-blockchain-btn"
          >
            <RefreshCw size={14} />
            <span className="desktop-only">Sync</span>
          </button>

          {isConnected ? (
            <div className="wallet-connected-wrapper">
              <button
                className="btn btn-secondary wallet-btn"
                onClick={() => setShowWalletDropdown(!showWalletDropdown)}
                id="wallet-profile-dropdown-btn"
              >
                <div className="wallet-dot"></div>
                <span className="font-mono">{truncateAddress(user.walletAddress)}</span>
                <ChevronDown size={14} />
              </button>

              {showWalletDropdown && (
                <div className="wallet-dropdown glass-panel">
                  <div className="dropdown-header">
                    <span className="text-muted text-xs">Connected BEP-20 Wallet</span>
                    <div className="dropdown-address font-mono">{truncateAddress(user.walletAddress)}</div>
                  </div>
                  <div className="dropdown-balances">
                    <div className="balance-row">
                      <span className="balance-label">USDT Balance:</span>
                      <span className="balance-val font-mono">${user.balanceUSDT.toFixed(2)}</span>
                    </div>
                    <div className="balance-row">
                      <span className="balance-label">BNB (Gas):</span>
                      <span className="balance-val font-mono">{user.balanceBNB.toFixed(3)} BNB</span>
                    </div>
                  </div>
                  <div className="dropdown-footer">
                    <button
                      className="btn btn-secondary btn-sm w-full"
                      onClick={() => {
                        setShowWalletDropdown(false);
                        onConnectToggle();
                      }}
                      id="disconnect-wallet-btn"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              className="btn btn-cyan"
              onClick={onConnectToggle}
              id="connect-wallet-main-btn"
            >
              <Wallet size={16} />
              <span>Connect Wallet</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
