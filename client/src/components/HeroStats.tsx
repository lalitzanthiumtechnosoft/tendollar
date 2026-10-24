import React, { useState } from 'react';
import { Copy, Check, Users, DollarSign, Award, Gauge, Sparkles, Share2 } from 'lucide-react';
import type { UserProfile } from '../types';

interface HeroStatsProps {
  user: UserProfile;
}

export const HeroStats: React.FC<HeroStatsProps> = ({ user }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const refLink = user.id ? `https://tendollar.world/ref/${user.id}` : 'Connect wallet to generate referral link';

  const copyRefLink = () => {
    if (!user.id) return;
    navigator.clipboard.writeText(refLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const cappingLimit = user.activePackage * 5; // 500% capping
  const cappingPercent = cappingLimit > 0 ? Math.min(100, Math.round((user.cappingCurrent / cappingLimit) * 100)) : 0;

  return (
    <section className="hero-section">
      {/* 100% Free Registration Banner */}
      <div className="promo-strip">
        <div className="promo-pill">
          <Sparkles size={14} className="text-gold" />
          <span><strong>100% FREE REGISTRATION</strong> • No Admin Fees • No Hidden Charges • 100% Smart Contract Distribution</span>
        </div>
      </div>

      {/* User Identity & Referral Strip */}
      <div className="user-id-card glass-panel">
        <div className="user-info-left">
          <div className="avatar-shield">
            <span className="font-mono">{user.id ? `#${user.id}` : '#---'}</span>
          </div>
          <div className="id-details">
            <div className="id-row">
              <span className="id-label">MY ID:</span>
              <span className="id-value font-mono">{user.id ? `#${user.id}` : '#---'}</span>
              <span className={`badge ${user.walletAddress ? 'badge-cyan' : 'badge-gold'}`}>
                {user.walletAddress ? 'BEP-20 ACTIVE' : 'CONNECT WALLET'}
              </span>
              {user.rank !== 'NONE' && (
                <span className="badge badge-gold">
                  <Award size={12} /> {user.rank.replace('_', ' ')}
                </span>
              )}
            </div>
            <div className="sponsor-row text-muted text-xs">
              <span>Sponsor ID: <strong className="font-mono text-cyan">#{user.sponsorId}</strong></span>
              <span className="dot-sep">•</span>
              <span>Network: <strong className="text-primary">Binance Smart Chain</strong></span>
            </div>
          </div>
        </div>

        {/* Referral Link Box */}
        <div className="referral-box">
          <div className="ref-label-group">
            <Share2 size={13} className="text-cyan" />
            <span className="text-xs text-muted">My Referral Link</span>
          </div>
          <div className="ref-input-group">
            <input
              type="text"
              readOnly
              value={refLink}
              className="ref-input font-mono"
              id="referral-link-input"
            />
            <button
              className="btn btn-cyan btn-sm copy-ref-btn"
              onClick={copyRefLink}
              title="Copy referral link"
              id="copy-referral-link-btn"
              disabled={!user.id}
            >
              {copiedLink ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Essential KPI Cards */}
      <div className="kpi-grid">
        {/* Card 1: Total Earnings */}
        <div className="glass-panel kpi-card" id="kpi-total-earnings">
          <div className="kpi-header">
            <div className="kpi-icon-box cyan-glow">
              <DollarSign size={20} className="text-cyan" />
            </div>
            <span className="badge badge-green">100% Distributed</span>
          </div>
          <div className="kpi-body">
            <span className="kpi-label">Total Earnings</span>
            <div className="kpi-number font-mono text-cyan">
              ${user.totalEarnings.toFixed(2)} <span className="kpi-unit">USDT</span>
            </div>
          </div>
          <div className="kpi-footer text-xs text-muted">
            Direct: ${user.directEarnings} • Matrix: ${user.matrixEarnings} • Level: ${user.levelEarnings}
          </div>
        </div>

        {/* Card 2: Active Package */}
        <div className="glass-panel kpi-card" id="kpi-active-package">
          <div className="kpi-header">
            <div className="kpi-icon-box blue-glow">
              <Award size={20} className="text-blue" />
            </div>
            <span className="badge badge-cyan">{user.unlockedTiers.length > 0 ? `Tier ${user.unlockedTiers.length} Active` : 'No Active Tier'}</span>
          </div>
          <div className="kpi-body">
            <span className="kpi-label">Highest Active Package</span>
            <div className="kpi-number font-mono text-primary">
              {user.activePackage > 0 ? `$${user.activePackage}` : '$0'} <span className="kpi-unit">BEP-20</span>
            </div>
          </div>
          <div className="kpi-footer text-xs text-muted">
            {user.unlockedTiers.length > 0 ? `Unlocked: ${user.unlockedTiers.map(t => `$${t}`).join(', ')}` : 'Entry Tier: $10 Ready'}
          </div>
        </div>

        {/* Card 3: Directs & Team */}
        <div className="glass-panel kpi-card" id="kpi-team-stats">
          <div className="kpi-header">
            <div className="kpi-icon-box gold-glow">
              <Users size={20} className="text-gold" />
            </div>
            <span className="badge badge-gold">10 Levels Deep</span>
          </div>
          <div className="kpi-body">
            <span className="kpi-label">Direct / Total Team</span>
            <div className="kpi-number font-mono text-gold">
              {user.directReferralsCount} <span className="text-muted font-sans font-light">/</span> {user.totalTeamCount}
            </div>
          </div>
          <div className="kpi-footer text-xs text-muted">
            Active Community Network on BEP-20
          </div>
        </div>

        {/* Card 4: 500% Capping Meter */}
        <div className="glass-panel kpi-card" id="kpi-capping-meter">
          <div className="kpi-header">
            <div className="kpi-icon-box amber-glow">
              <Gauge size={20} className="text-emerald" />
            </div>
            <span className="badge badge-cyan">500% Package Cap</span>
          </div>
          <div className="kpi-body">
            <div className="capping-labels">
              <span className="kpi-label">Current Capping</span>
              <span className="font-mono text-xs font-bold text-cyan">{cappingPercent}%</span>
            </div>
            <div className="capping-bar-wrapper">
              <div
                className="capping-bar-fill"
                style={{ width: `${cappingPercent}%` }}
              ></div>
            </div>
            <div className="capping-detail font-mono text-xs text-muted">
              ${user.cappingCurrent.toFixed(2)} of ${cappingLimit.toFixed(2)} USDT max
            </div>
          </div>
          <div className="kpi-footer text-xs text-muted">
            Re-upgrade required at 500% limit
          </div>
        </div>
      </div>
    </section>
  );
};
