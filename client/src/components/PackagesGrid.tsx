import React from 'react';
import type { PackageTier, UserProfile } from '../types';
import { CheckCircle2, Lock, Zap, ArrowUpRight, TrendingUp } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PackagesGridProps {
  packages: PackageTier[];
  user: UserProfile;
  onUpgradePackage: (pkg: PackageTier) => void;
}

export const PackagesGrid: React.FC<PackagesGridProps> = ({
  packages,
  user,
  onUpgradePackage,
}) => {
  const handleUpgrade = (pkg: PackageTier) => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00e5ff', '#fbbf24', '#2563eb', '#ffffff']
    });
    onUpgradePackage(pkg);
  };

  const activePkgs = packages.filter((p) => p.status === 'active');
  const upcomingPkgs = packages.filter((p) => p.status === 'upcoming');

  return (
    <section className="packages-section" id="packages-section">
      <div className="section-header">
        <div>
          <div className="section-badge badge badge-cyan">
            <Zap size={13} />
            <span>BEP-20 ACTIVATION PACKAGES</span>
          </div>
          <h2 className="section-title">
            Smart Contract Packages <span className="text-cyan">(Start with just $10)</span>
          </h2>
          <p className="section-desc">
            100% On-Chain Auto Distribution: 20% Direct + 40% Matrix + 10% Level + 20% Capital Gain + 10% Rank.
          </p>
        </div>
        <div className="summary-banner glass-panel">
          <TrendingUp size={18} className="text-gold" />
          <div className="summary-text">
            <span className="summary-highlight text-gold font-mono">$510 Total Earn</span>
            <span className="text-xs text-muted">From every single Direct person across all packages</span>
          </div>
        </div>
      </div>

      {/* Active Packages Grid */}
      <h3 className="tier-group-title">
        <span className="tier-dot green-dot"></span> Active Packages (Instant On-Chain Activation)
      </h3>
      <div className="packages-grid">
        {activePkgs.map((pkg) => {
          const isUnlocked = user.unlockedTiers.includes(pkg.amount);
          const isNextToUnlock = !isUnlocked && (
            pkg.amount === 10 || 
            user.unlockedTiers.includes(pkg.amount / 2)
          );

          return (
            <div
              key={pkg.id}
              className={`package-card glass-panel ${isUnlocked ? 'card-active' : ''} ${
                isNextToUnlock ? 'card-next-glow' : ''
              }`}
              id={`package-card-${pkg.amount}`}
            >
              {isUnlocked && (
                <div className="active-tag">
                  <CheckCircle2 size={13} />
                  <span>ACTIVE</span>
                </div>
              )}
              {isNextToUnlock && (
                <div className="next-tag">
                  <Zap size={13} />
                  <span>NEXT TIER</span>
                </div>
              )}

              <div className="pkg-header">
                <span className="pkg-currency">USDT</span>
                <div className="pkg-price font-mono">${pkg.amount}</div>
                <div className="pkg-bep20 text-muted text-xs">BEP-20 Based</div>
              </div>

              <div className="pkg-rewards-list">
                <div className="reward-item">
                  <span className="reward-label">Direct Income (20%):</span>
                  <span className="reward-val text-cyan font-mono">+${pkg.directIncome}.00</span>
                </div>
                <div className="reward-item">
                  <span className="reward-label">Global Matrix (40%):</span>
                  <span className="reward-val text-primary font-mono">${pkg.matrixReentry + pkg.matrixWithdrawal}.00</span>
                </div>
                <div className="matrix-sub-item text-xs text-muted">
                  <span>Re-entry: ${pkg.matrixReentry}</span>
                  <span className="dot-sep">•</span>
                  <span>Withdrawal: ${pkg.matrixWithdrawal}</span>
                </div>
                <div className="reward-item">
                  <span className="reward-label">Level Share (10%):</span>
                  <span className="reward-val text-gold font-mono">${(pkg.amount * 0.1).toFixed(2)}</span>
                </div>
                <div className="reward-item">
                  <span className="reward-label">Deposit Fee (5%):</span>
                  <span className="reward-val text-muted font-mono">+${(pkg.amount * 0.05).toFixed(2)}</span>
                </div>
              </div>

              <div className="pkg-action">
                {isUnlocked ? (
                  <button className="btn btn-secondary btn-sm w-full btn-disabled" disabled>
                    <CheckCircle2 size={14} className="text-emerald" />
                    <span>Unlocked & Earning</span>
                  </button>
                ) : isNextToUnlock ? (
                  <button
                    className="btn btn-cyan w-full"
                    onClick={() => handleUpgrade(pkg)}
                    id={`upgrade-btn-${pkg.amount}`}
                  >
                    <ArrowUpRight size={16} />
                    <span>Upgrade (${pkg.amount} + ${(pkg.amount * 0.05).toFixed(2)} Fee)</span>
                  </button>
                ) : (
                  <button className="btn btn-secondary btn-sm w-full btn-disabled" disabled>
                    <Lock size={14} />
                    <span>Unlock Previous First</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming Packages Grid */}
      <div className="upcoming-section-header">
        <h3 className="tier-group-title">
          <span className="tier-dot blue-dot"></span> Upcoming Packages (Preview)
        </h3>
        <span className="text-muted text-xs">Unlocks sequentially in Phase 2</span>
      </div>

      <div className="packages-grid upcoming-grid">
        {upcomingPkgs.map((pkg) => (
          <div
            key={pkg.id}
            className="package-card glass-panel upcoming-card"
            id={`upcoming-card-${pkg.amount}`}
          >
            <div className="upcoming-tag">
              <Lock size={12} />
              <span>UPCOMING</span>
            </div>

            <div className="pkg-header">
              <span className="pkg-currency">USDT</span>
              <div className="pkg-price font-mono text-muted">${pkg.amount}</div>
              <div className="pkg-bep20 text-muted text-xs">Phase 2 BEP-20</div>
            </div>

            <div className="pkg-rewards-list">
              <div className="reward-item">
                <span className="reward-label">Direct Income (20%):</span>
                <span className="reward-val text-cyan font-mono">+${pkg.directIncome}.00</span>
              </div>
              <div className="reward-item">
                <span className="reward-label">Matrix (40%):</span>
                <span className="reward-val text-muted font-mono">${pkg.matrixReentry + pkg.matrixWithdrawal}.00</span>
              </div>
            </div>

            <div className="pkg-action">
              <button className="btn btn-secondary btn-sm w-full btn-disabled" disabled>
                <Lock size={14} />
                <span>Locked</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
