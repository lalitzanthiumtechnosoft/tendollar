import React, { useState } from 'react';
import type { UserProfile } from '../types';
import { ArrowDownLeft, Send, ShieldAlert, CheckCircle, Calculator } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WithdrawalHubProps {
  user: UserProfile;
  onWithdraw: (amount: number, netAmount: number) => void;
  onP2PTransfer: (recipient: string, amount: number, netAmount: number) => void;
}

export const WithdrawalHub: React.FC<WithdrawalHubProps> = ({
  user,
  onWithdraw,
  onP2PTransfer,
}) => {
  // Withdrawal Form State
  const [withdrawAmount, setWithdrawAmount] = useState<number>(20);
  const [withdrawSuccess, setWithdrawSuccess] = useState<string | null>(null);

  // P2P Form State
  const [p2pRecipient, setP2pRecipient] = useState<string>('10825');
  const [p2pAmount, setP2pAmount] = useState<number>(10);
  const [p2pSuccess, setP2pSuccess] = useState<string | null>(null);

  // Calculations based on PDF terms:
  // 1. Min withdrawal 10$ (10% deduction)
  const withdrawDeduction = withdrawAmount * 0.10;
  const withdrawNet = Math.max(0, withdrawAmount - withdrawDeduction);

  // 2. Wallet to wallet transfer = 5$ min (deduction 5%)
  const p2pDeduction = p2pAmount * 0.05;
  const p2pNet = Math.max(0, p2pAmount - p2pDeduction);

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount < 10) return;
    if (withdrawAmount > user.totalEarnings) return;

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#10b981', '#00e5ff']
    });

    onWithdraw(withdrawAmount, withdrawNet);
    setWithdrawSuccess(`Success! ${withdrawNet.toFixed(2)} USDT pushed to your BEP-20 wallet.`);
    setTimeout(() => setWithdrawSuccess(null), 4000);
  };

  const handleP2PSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (p2pAmount < 5) return;
    if (p2pAmount > user.totalEarnings) return;

    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#00e5ff', '#fbbf24']
    });

    onP2PTransfer(p2pRecipient, p2pAmount, p2pNet);
    setP2pSuccess(`P2P Transferred ${p2pNet.toFixed(2)} USDT to Member #${p2pRecipient}!`);
    setTimeout(() => setP2pSuccess(null), 4000);
  };

  return (
    <section className="withdrawal-hub-section" id="withdrawal-hub-section">
      <div className="section-header">
        <div>
          <div className="section-badge badge badge-cyan">
            <Calculator size={13} />
            <span>TERMS & FINANCIAL HUB</span>
          </div>
          <h2 className="section-title">Withdrawal & P2P Transfer Portal</h2>
          <p className="section-desc">
            Instant decentralized withdrawals and peer-to-peer balance transfers with automated smart calculations.
          </p>
        </div>
      </div>

      <div className="hub-grid">
        {/* 1. On-Chain BEP-20 Withdrawal */}
        <div className="glass-panel hub-card" id="withdrawal-panel">
          <div className="card-top-icon">
            <ArrowDownLeft size={22} className="text-emerald" />
          </div>
          <h3 className="hub-card-title">Direct Wallet Withdrawal</h3>
          <p className="hub-card-desc">
            Withdraw available income directly to your connected Web3 address. Minimum $10.
          </p>

          <form onSubmit={handleWithdrawSubmit} className="hub-form">
            <div className="form-group">
              <label className="form-label">
                Withdraw Amount (USDT)
                <span className="balance-hint text-muted font-mono">
                  Avail: ${user.totalEarnings.toFixed(2)}
                </span>
              </label>
              <div className="input-wrapper">
                <input
                  type="number"
                  min="10"
                  max={user.totalEarnings}
                  step="1"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="form-input font-mono"
                  id="withdraw-amount-input"
                  required
                />
                <span className="input-suffix">USDT</span>
              </div>
            </div>

            {/* Transparent Calculation Breakdown */}
            <div className="calc-breakdown">
              <div className="calc-row">
                <span className="text-muted text-xs">Requested Amount:</span>
                <span className="font-mono text-xs">${withdrawAmount.toFixed(2)}</span>
              </div>
              <div className="calc-row">
                <span className="text-muted text-xs">Standard Deduction (10%):</span>
                <span className="font-mono text-xs text-danger">-${withdrawDeduction.toFixed(2)}</span>
              </div>
              <div className="calc-row divider">
                <span className="text-primary font-bold text-xs">Net Credited to Wallet:</span>
                <span className="font-mono text-sm font-bold text-emerald">${withdrawNet.toFixed(2)} USDT</span>
              </div>
            </div>

            {withdrawSuccess && (
              <div className="alert-box success">
                <CheckCircle size={16} />
                <span>{withdrawSuccess}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-cyan w-full"
              disabled={withdrawAmount < 10 || withdrawAmount > user.totalEarnings}
              id="submit-withdraw-btn"
            >
              <ArrowDownLeft size={16} />
              <span>Withdraw ${withdrawNet.toFixed(2)} USDT</span>
            </button>
            <span className="text-muted text-xs text-center block mt-2">
              Minimum withdrawal: $10 (10% deduction per system terms)
            </span>
          </form>
        </div>

        {/* 2. P2P Wallet to Wallet Transfer */}
        <div className="glass-panel hub-card" id="p2p-transfer-panel">
          <div className="card-top-icon">
            <Send size={22} className="text-cyan" />
          </div>
          <h3 className="hub-card-title">P2P Wallet to Wallet Transfer</h3>
          <p className="hub-card-desc">
            Instantly transfer funds to another member inside tenDOLLAR. Minimum $5.
          </p>

          <form onSubmit={handleP2PSubmit} className="hub-form">
            <div className="form-group">
              <label className="form-label">Recipient Member ID / Wallet</label>
              <input
                type="text"
                value={p2pRecipient}
                onChange={(e) => setP2pRecipient(e.target.value)}
                placeholder="e.g. 10825 or 0x..."
                className="form-input font-mono"
                id="p2p-recipient-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Transfer Amount (USDT)</label>
              <div className="input-wrapper">
                <input
                  type="number"
                  min="5"
                  max={user.totalEarnings}
                  step="1"
                  value={p2pAmount}
                  onChange={(e) => setP2pAmount(Number(e.target.value))}
                  className="form-input font-mono"
                  id="p2p-amount-input"
                  required
                />
                <span className="input-suffix">USDT</span>
              </div>
            </div>

            <div className="calc-breakdown">
              <div className="calc-row">
                <span className="text-muted text-xs">Transfer Amount:</span>
                <span className="font-mono text-xs">${p2pAmount.toFixed(2)}</span>
              </div>
              <div className="calc-row">
                <span className="text-muted text-xs">P2P Fee (5% deduction):</span>
                <span className="font-mono text-xs text-danger">-${p2pDeduction.toFixed(2)}</span>
              </div>
              <div className="calc-row divider">
                <span className="text-primary font-bold text-xs">Recipient Receives:</span>
                <span className="font-mono text-sm font-bold text-cyan">${p2pNet.toFixed(2)} USDT</span>
              </div>
            </div>

            {p2pSuccess && (
              <div className="alert-box success">
                <CheckCircle size={16} />
                <span>{p2pSuccess}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-secondary w-full"
              disabled={p2pAmount < 5 || p2pAmount > user.totalEarnings}
              id="submit-p2p-btn"
            >
              <Send size={16} />
              <span>Send ${p2pNet.toFixed(2)} USDT</span>
            </button>
            <span className="text-muted text-xs text-center block mt-2">
              Wallet to wallet transfer fund = $5 (deduction 5%)
            </span>
          </form>
        </div>

        {/* 3. Official Terms & Conditions Card */}
        <div className="glass-panel hub-card terms-card" id="official-terms-panel">
          <div className="card-top-icon">
            <ShieldAlert size={22} className="text-gold" />
          </div>
          <h3 className="hub-card-title">System Rules & Protocol Terms</h3>
          <p className="hub-card-desc">
            As outlined in the official tenDOLLAR specification:
          </p>

          <ul className="terms-list">
            <li className="term-item">
              <span className="term-check">✓</span>
              <div>
                <strong>Minimum Withdrawal:</strong> $10 with a standard 10% system deduction.
              </div>
            </li>
            <li className="term-item">
              <span className="term-check">✓</span>
              <div>
                <strong>Wallet to Wallet Transfer:</strong> Minimum $5 with a 5% system deduction.
              </div>
            </li>
            <li className="term-item">
              <span className="term-check">✓</span>
              <div>
                <strong>P2P Transfer Available:</strong> Instant peer transfers within the ecosystem.
              </div>
            </li>
            <li className="term-item">
              <span className="term-check">✓</span>
              <div>
                <strong>500% Package Capping:</strong> Each package has a maximum earning ceiling of 500% before re-activation is required.
              </div>
            </li>
            <li className="term-item">
              <span className="term-check">✓</span>
              <div>
                <strong>Zero Admin Fees:</strong> 100% Free Registration with 100% distribution across network peers.
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};
