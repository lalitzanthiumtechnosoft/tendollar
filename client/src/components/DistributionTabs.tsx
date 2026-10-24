import React, { useState } from 'react';
import type { UserProfile, MatrixSlotState, DirectReferralItem, LevelIncomeItem } from '../types';
import { 
  GitFork, 
  Users, 
  Layers, 
  TrendingUp, 
  Award, 
  Sparkles, 
  RefreshCw, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface DistributionTabsProps {
  user: UserProfile;
  directs: DirectReferralItem[];
  levels: LevelIncomeItem[];
  matrixStates: Record<number, MatrixSlotState>;
}

export const DistributionTabs: React.FC<DistributionTabsProps> = ({
  user,
  directs,
  levels,
  matrixStates,
}) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'direct' | 'level' | 'capital' | 'rank' | 'magical'>('matrix');
  const [selectedMatrixTier, setSelectedMatrixTier] = useState<number>(10);

  const currentMatrix = matrixStates[selectedMatrixTier] || {
    packageAmount: selectedMatrixTier,
    cycleNumber: 1,
    slot1Filled: false,
    slot2Filled: false,
    totalRecycles: 0,
    totalMatrixEarned: 0,
  };

  const reEntryAmount = selectedMatrixTier * 0.2; // 20%
  const withdrawalAmount = selectedMatrixTier * 0.2; // 20% (Total 40%)

  return (
    <section className="distribution-section" id="distribution-section">
      <div className="section-header">
        <div>
          <div className="section-badge badge badge-gold">
            <Layers size={13} />
            <span>100% SMART CONTRACT DISTRIBUTION</span>
          </div>
          <h2 className="section-title">Income Streams & Matrix Visualizer</h2>
          <p className="section-desc">
            Explore how the 100% distribution model allocates funds transparently across all 6 streams.
          </p>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="tabs-nav-wrapper">
        <div className="tabs-nav">
          <button
            className={`tab-btn ${activeTab === 'matrix' ? 'active' : ''}`}
            onClick={() => setActiveTab('matrix')}
            id="tab-btn-matrix"
          >
            <GitFork size={16} />
            <span>40% Global Matrix</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'direct' ? 'active' : ''}`}
            onClick={() => setActiveTab('direct')}
            id="tab-btn-direct"
          >
            <Users size={16} />
            <span>20% Direct Income</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'level' ? 'active' : ''}`}
            onClick={() => setActiveTab('level')}
            id="tab-btn-level"
          >
            <Layers size={16} />
            <span>10% Level Income</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'capital' ? 'active' : ''}`}
            onClick={() => setActiveTab('capital')}
            id="tab-btn-capital"
          >
            <TrendingUp size={16} />
            <span>20% Capital Gain</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'rank' ? 'active' : ''}`}
            onClick={() => setActiveTab('rank')}
            id="tab-btn-rank"
          >
            <Award size={16} />
            <span>10% Rank & Rewards</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'magical' ? 'active' : ''}`}
            onClick={() => setActiveTab('magical')}
            id="tab-btn-magical"
          >
            <Sparkles size={16} />
            <span>Magical Income</span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT 1: 40% GLOBAL MATRIX */}
      {activeTab === 'matrix' && (
        <div className="tab-pane glass-panel">
          <div className="tab-pane-header">
            <div>
              <h3 className="tab-pane-title">
                40% Globally Matrix System <span className="badge badge-cyan">Cycle #{currentMatrix.cycleNumber}</span>
              </h3>
              <p className="tab-pane-desc">
                By Re-entry You Earn Infinity Level Continuous. 2 Slots per cycle: Slot 1 triggers automatic Re-entry, Slot 2 provides instant on-chain withdrawal.
              </p>
            </div>

            {/* Matrix Tier Switcher */}
            <div className="tier-pills">
              {[10, 20, 40, 80].map((amt) => (
                <button
                  key={amt}
                  className={`tier-pill-btn ${selectedMatrixTier === amt ? 'active' : ''}`}
                  onClick={() => setSelectedMatrixTier(amt)}
                  id={`matrix-tier-select-${amt}`}
                >
                  ${amt} Matrix
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Matrix Graphic Representation */}
          <div className="matrix-visualizer-box">
            <div className="matrix-meta-bar">
              <span className="text-muted text-xs">
                Package: <strong className="text-cyan">${selectedMatrixTier} BEP-20</strong>
              </span>
              <span className="dot-sep">•</span>
              <span className="text-muted text-xs">
                Total Recycles: <strong className="text-gold font-mono">{currentMatrix.totalRecycles} Times</strong>
              </span>
              <span className="dot-sep">•</span>
              <span className="text-muted text-xs">
                Total Matrix Earned: <strong className="text-emerald font-mono">${currentMatrix.totalMatrixEarned.toFixed(2)}</strong>
              </span>
            </div>

            <div className="matrix-tree-container">
              {/* Top Node (Self) */}
              <div className="matrix-node self-node">
                <div className="node-avatar self-avatar">
                  <span className="node-title">Self</span>
                  <span className="node-id font-mono">#{user.id}</span>
                </div>
                <div className="node-badge-pill">${selectedMatrixTier}</div>
              </div>

              {/* Connecting Tree Lines */}
              <div className="tree-connector-lines">
                <div className="connector-vertical-top"></div>
                <div className="connector-horizontal-bar"></div>
                <div className="connector-vertical-bottom-left"></div>
                <div className="connector-vertical-bottom-right"></div>
              </div>

              {/* Bottom 2 Slots */}
              <div className="matrix-children-row">
                {/* Slot 1: Re-entry */}
                <div className={`matrix-slot-card ${currentMatrix.slot1Filled ? 'slot-filled re-entry' : 'slot-empty'}`}>
                  <div className="slot-avatar">
                    {currentMatrix.slot1Filled ? (
                      <RefreshCw size={22} className="spin-slow text-gold" />
                    ) : (
                      <span className="slot-empty-num">1</span>
                    )}
                  </div>
                  <div className="slot-info">
                    <span className="slot-name">Slot 1: Re-entry</span>
                    <span className="slot-reward font-mono text-gold">+${reEntryAmount}.00</span>
                    <span className="slot-status-text">
                      {currentMatrix.slot1Filled ? `Filled by ${currentMatrix.slot1User}` : 'Awaiting Spillover'}
                    </span>
                  </div>
                </div>

                {/* Slot 2: Withdrawal */}
                <div className={`matrix-slot-card ${currentMatrix.slot2Filled ? 'slot-filled withdrawal' : 'slot-empty'}`}>
                  <div className="slot-avatar">
                    {currentMatrix.slot2Filled ? (
                      <CheckCircle2 size={22} className="text-emerald" />
                    ) : (
                      <span className="slot-empty-num">2</span>
                    )}
                  </div>
                  <div className="slot-info">
                    <span className="slot-name">Slot 2: Instant Withdrawal</span>
                    <span className="slot-reward font-mono text-emerald">+${withdrawalAmount}.00</span>
                    <span className="slot-status-text">
                      {currentMatrix.slot2Filled ? `Filled by ${currentMatrix.slot2User}` : 'Awaiting Spillover'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Matrix On-Chain Engine Status */}
            <div className="matrix-action-footer">
              <div className="badge badge-cyan" style={{ padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                <span className="pulsing-green-dot"></span>
                <span>Live BSC Matrix Engine Active • Slot 1: Re-entry (${reEntryAmount}) | Slot 2: Instant Withdrawal (${withdrawalAmount})</span>
              </div>
              <span className="text-muted text-xs">
                Smart contract executes automatic slot assignment and instant peer payout on BSC Testnet
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: 20% DIRECT INCOME */}
      {activeTab === 'direct' && (
        <div className="tab-pane glass-panel">
          <div className="tab-pane-header">
            <div>
              <h3 className="tab-pane-title">20% Direct Referral Income</h3>
              <p className="tab-pane-desc">
                Receive 20% on every package activated or upgraded by your direct partners. Total $510 earn per direct person!
              </p>
            </div>
            <div className="stat-pill-gold font-mono">
              Total Earned: ${user.directEarnings.toFixed(2)} USDT
            </div>
          </div>

          <div className="table-responsive">
            <table className="custom-table" id="direct-referrals-table">
              <thead>
                <tr>
                  <th>Member ID</th>
                  <th>BEP-20 Wallet</th>
                  <th>Activated Package</th>
                  <th>Direct Income (20%)</th>
                  <th>Date</th>
                  <th>On-Chain Hash</th>
                </tr>
              </thead>
              <tbody>
                {directs.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '36px 16px', color: '#94a3b8' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <Users size={28} style={{ opacity: 0.4 }} />
                        <span>No direct partners registered yet.</span>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>Connect your wallet & share your referral link to earn 20% instant direct income.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  directs.map((dir) => (
                    <tr key={dir.id}>
                      <td><span className="font-mono text-cyan">#{dir.id}</span></td>
                      <td><span className="font-mono">{dir.walletAddress}</span></td>
                      <td><span className="badge badge-cyan">${dir.packageAmount}</span></td>
                      <td><span className="font-mono text-emerald font-bold">+${dir.earnedAmount}.00 USDT</span></td>
                      <td className="text-muted text-xs">{dir.date}</td>
                      <td>
                        <a href="https://bscscan.com" target="_blank" rel="noreferrer" className="table-hash-link">
                          <span className="font-mono">{dir.txHash}</span>
                          <ExternalLink size={12} />
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: 10% LEVEL INCOME */}
      {activeTab === 'level' && (
        <div className="tab-pane glass-panel">
          <div className="tab-pane-header">
            <div>
              <h3 className="tab-pane-title">10% Level Income (1% Each x 10 Levels)</h3>
              <p className="tab-pane-desc">
                From Level 1 all the way down to Level 10, earn 1% on every activation across your entire organization.
              </p>
            </div>
            <div className="stat-pill-gold font-mono">
              Total Level Earned: ${user.levelEarnings.toFixed(2)} USDT
            </div>
          </div>

          <div className="table-responsive">
            <table className="custom-table" id="level-income-table">
              <thead>
                <tr>
                  <th>Level</th>
                  <th>Commission %</th>
                  <th>Active Team Members</th>
                  <th>Level Volume (BEP-20)</th>
                  <th>Your Payout (1%)</th>
                </tr>
              </thead>
              <tbody>
                {levels.map((lvl) => (
                  <tr key={lvl.level}>
                    <td><span className="font-mono text-cyan font-bold">Level {lvl.level}</span></td>
                    <td><span className="badge badge-cyan">{lvl.percentage}%</span></td>
                    <td><span className="font-mono">{lvl.teamCount} Members</span></td>
                    <td><span className="font-mono text-muted">${lvl.totalVolume}.00</span></td>
                    <td><span className="font-mono text-emerald font-bold">+${lvl.earnedAmount.toFixed(2)} USDT</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: 20% CAPITAL GAIN */}
      {activeTab === 'capital' && (
        <div className="tab-pane glass-panel">
          <div className="tab-pane-header">
            <div>
              <h3 className="tab-pane-title">20% Capital Gain Plan: Turn $150 into $300</h3>
              <p className="tab-pane-desc">
                Secure Passive Growth • Earn $4 every 10 days, paid automatically • Total return $300 over 25 months • No referrals required!
              </p>
            </div>
            <div className="badge badge-green">
              <CheckCircle2 size={13} /> Active Passive Plan
            </div>
          </div>

          <div className="capital-gain-container">
            <div className="capital-stats-grid">
              <div className="cap-card glass-panel">
                <span className="cap-label">Joined Amount</span>
                <span className="cap-val font-mono text-primary">$150.00</span>
                <span className="cap-sub text-muted text-xs">BEP-20 Capital Pool</span>
              </div>
              <div className="cap-card glass-panel">
                <span className="cap-label">Automatic Payout</span>
                <span className="cap-val font-mono text-emerald">$4.00</span>
                <span className="cap-sub text-muted text-xs">Every 10 Days</span>
              </div>
              <div className="cap-card glass-panel">
                <span className="cap-label">Total Target</span>
                <span className="cap-val font-mono text-gold">$300.00</span>
                <span className="cap-sub text-muted text-xs">75 Cycles (25 Months)</span>
              </div>
              <div className="cap-card glass-panel">
                <span className="cap-label">Next Payout In</span>
                <span className="cap-val font-mono text-cyan">{user.capitalGainDaysLeft} Days</span>
                <span className="cap-sub text-muted text-xs">Automated Smart Contract</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="capital-progress-box glass-panel">
              <div className="cap-progress-header">
                <span className="text-muted text-xs">Payout Progress</span>
                <span className="font-mono text-sm font-bold text-gold">
                  ${user.capitalGainPaid.toFixed(2)} / $300.00 (Cycle {Math.round(user.capitalGainPaid / 4)} of 75)
                </span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill-gold"
                  style={{ width: `${(user.capitalGainPaid / 300) * 100}%` }}
                ></div>
              </div>
              <div className="cap-action-row">
                <div className="badge badge-gold" style={{ padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={14} />
                  <span>Automated Smart Contract Distribution ($4.00 every 10 days)</span>
                </div>
                <span className="text-muted text-xs">
                  Remaining return: ${(300 - user.capitalGainPaid).toFixed(2)} USDT
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: 10% RANK & REWARDS */}
      {activeTab === 'rank' && (
        <div className="tab-pane glass-panel">
          <div className="tab-pane-header">
            <div>
              <h3 className="tab-pane-title">10% Rank & Rewards Royalty Pool</h3>
              <p className="tab-pane-desc">
                Climb the Ranks. Unlock Greater Rewards from the global 10% royalty pool.
              </p>
            </div>
            <span className="badge badge-gold">Current: {user.rank.replace('_', ' ')}</span>
          </div>

          <div className="ranks-grid">
            {/* 1 STAR */}
            <div className={`rank-card glass-panel ${user.rank === '1_STAR' || user.rank === '2_STAR' || user.rank === '3_STAR' ? 'rank-achieved' : ''}`}>
              <div className="rank-badge-box">
                <Award size={24} className="text-gold" />
                <span className="rank-name">1 STAR</span>
              </div>
              <div className="rank-bonus-highlight font-mono text-emerald">
                Earn 20% of 10% Pool
              </div>
              <div className="rank-requirements">
                <div className="req-item">
                  <CheckCircle2 size={14} className="text-emerald" />
                  <span>Self upgrade: $10 + $20 + $40 + $80 ($150)</span>
                </div>
                <div className="req-item">
                  <CheckCircle2 size={14} className="text-emerald" />
                  <span>5 Directs upgraded with $10 + $20 + $40</span>
                </div>
                <div className="req-item">
                  <CheckCircle2 size={14} className="text-emerald" />
                  <span>Team Size: 25+ (Current: {user.totalTeamCount})</span>
                </div>
              </div>
              <div className="rank-status-tag">ACHIEVED</div>
            </div>

            {/* 2 STAR */}
            <div className={`rank-card glass-panel ${user.rank === '2_STAR' || user.rank === '3_STAR' ? 'rank-achieved' : ''}`}>
              <div className="rank-badge-box">
                <Award size={24} className="text-cyan" />
                <span className="rank-name">2 STAR</span>
              </div>
              <div className="rank-bonus-highlight font-mono text-cyan">
                Earn 30% of 10% Pool
              </div>
              <div className="rank-requirements">
                <div className="req-item">
                  <span className="req-bullet">•</span>
                  <span>Self upgrade: $160 package</span>
                </div>
                <div className="req-item">
                  <span className="req-bullet">•</span>
                  <span>2 Directs with 1-STAR Rank</span>
                </div>
                <div className="req-item">
                  <span className="req-bullet">•</span>
                  <span>Team Size: 150 (Progress: {user.totalTeamCount}/150)</span>
                </div>
              </div>
              <div className="rank-status-tag text-muted">IN PROGRESS</div>
            </div>

            {/* 3 STAR */}
            <div className={`rank-card glass-panel ${user.rank === '3_STAR' ? 'rank-achieved' : ''}`}>
              <div className="rank-badge-box">
                <Award size={24} className="text-primary" />
                <span className="rank-name">3 STAR</span>
              </div>
              <div className="rank-bonus-highlight font-mono text-primary">
                Earn 50% of 10% Pool
              </div>
              <div className="rank-requirements">
                <div className="req-item">
                  <span className="req-bullet">•</span>
                  <span>Self upgrade: $320 package</span>
                </div>
                <div className="req-item">
                  <span className="req-bullet">•</span>
                  <span>2 Directs with 2-STAR Rank</span>
                </div>
                <div className="req-item">
                  <span className="req-bullet">•</span>
                  <span>Team Size: 500 (Progress: {user.totalTeamCount}/500)</span>
                </div>
              </div>
              <div className="rank-status-tag text-muted">LOCKED</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 6: MAGICAL INCOME */}
      {activeTab === 'magical' && (
        <div className="tab-pane glass-panel">
          <div className="tab-pane-header">
            <div>
              <h3 className="tab-pane-title">Magical Income: Turn Direct Income Into Double</h3>
              <p className="tab-pane-desc">
                With Zero Effort • Based on sequential growth of $5 steps • No extra tasks, no referrals needed • Powered by smart-cycle reward structure • Fully automated through the blockchain.
              </p>
            </div>
            <div className="stat-pill-gold font-mono">
              Magical Reward: ${user.magicalEarnings.toFixed(2)} USDT
            </div>
          </div>

          <div className="magical-cycle-box">
            <div className="magic-step">
              <span className="step-amount font-mono">$5</span>
              <span className="step-label">Base Step</span>
            </div>
            <ArrowRight size={24} className="text-cyan" />
            <div className="magic-step active">
              <span className="step-amount font-mono">$10</span>
              <span className="step-label">Double Reward</span>
            </div>
            <ArrowRight size={24} className="text-cyan" />
            <div className="magic-step">
              <span className="step-amount font-mono">$20</span>
              <span className="step-label">Smart Cycle</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
