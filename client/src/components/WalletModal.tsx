import React from 'react';
import { X, Check } from 'lucide-react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWallet: (walletName: string) => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  onSelectWallet,
}) => {
  if (!isOpen) return null;

  const WALLETS = [
    {
      name: 'MetaMask',
      desc: 'Connect to your MetaMask desktop extension or mobile app',
      icon: '🦊',
      popular: true,
    },
    {
      name: 'Trust Wallet',
      desc: 'Connect using mobile Trust Wallet via BEP-20',
      icon: '🛡️',
      popular: true,
    },
    {
      name: 'Binance Web3 Wallet',
      desc: 'Direct connection from Binance Official Web3 App',
      icon: '🟡',
      popular: false,
    },
    {
      name: 'WalletConnect',
      desc: 'Scan QR code with any supported decentralized Web3 wallet',
      icon: '🔗',
      popular: false,
    },
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Connect BEP-20 Wallet</h3>
            <p className="modal-desc text-muted text-xs">
              Select your preferred Web3 wallet to interact with tenDOLLAR
            </p>
          </div>
          <button className="btn-close" onClick={onClose} id="close-wallet-modal-btn">
            <X size={18} />
          </button>
        </div>

        <div className="wallet-options-list">
          {WALLETS.map((w) => (
            <div
              key={w.name}
              className="wallet-option-item glass-card-interactive"
              onClick={() => onSelectWallet(w.name)}
              id={`select-wallet-${w.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="wallet-option-left">
                <span className="wallet-icon-emoji">{w.icon}</span>
                <div className="wallet-info">
                  <div className="wallet-name-row">
                    <span className="wallet-title">{w.name}</span>
                    {w.popular && <span className="badge badge-cyan text-xs">POPULAR</span>}
                  </div>
                  <span className="wallet-desc text-muted text-xs">{w.desc}</span>
                </div>
              </div>
              <div className="wallet-arrow text-cyan">
                <Check size={18} />
              </div>
            </div>
          ))}
        </div>

        <div className="modal-footer text-muted text-xs">
          By connecting your wallet, you agree to the decentralized BEP-20 smart contract protocol rules.
        </div>
      </div>
    </div>
  );
};
