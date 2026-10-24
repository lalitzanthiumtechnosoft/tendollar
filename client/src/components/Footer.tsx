import React from 'react';
import { ShieldCheck, Mail, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer-container">
      <div className="footer-inner">
        <div className="footer-top-row">
          <div className="footer-brand">
            <div className="brand-logo mb-2">
              <div className="logo-icon-wrapper small">
                <span className="logo-dollar">$</span>
              </div>
              <div className="logo-title">
                TEN<span className="logo-highlight">DOLLAR</span>.WORLD
              </div>
            </div>
            <p className="footer-mission-text text-muted text-xs">
              A groundbreaking digital platform built to revolutionize financial empowerment through a global, decentralized income model starting with just $10.
            </p>
            <div className="audit-pill">
              <ShieldCheck size={14} className="text-emerald" />
              <span>100% Calculated & Verified On-Chain BEP-20 Contract</span>
            </div>
          </div>

          <div className="footer-links-group">
            <h4 className="footer-col-title">Ecosystem</h4>
            <ul className="footer-links-list">
              <li><a href="#packages-section">BEP-20 Packages</a></li>
              <li><a href="#distribution-section">Global Matrix (40%)</a></li>
              <li><a href="#distribution-section">Capital Gain ($150 → $300)</a></li>
              <li><a href="#distribution-section">Rank & Rewards (10%)</a></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h4 className="footer-col-title">Protocol & Terms</h4>
            <ul className="footer-links-list">
              <li><a href="#withdrawal-hub-section">Minimum Withdrawal ($10)</a></li>
              <li><a href="#withdrawal-hub-section">P2P Transfers ($5)</a></li>
              <li><a href="#packages-section">500% Package Capping</a></li>
              <li><a href="#withdrawal-hub-section">Zero Admin Fees</a></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h4 className="footer-col-title">Official Channels</h4>
            <div className="footer-contact-item">
              <Mail size={14} className="text-cyan" />
              <span className="text-xs font-mono">SUPPORT@TENDOLLAR.WORLD</span>
            </div>
            <div className="footer-contact-item">
              <Globe size={14} className="text-cyan" />
              <span className="text-xs font-mono">WWW.TENDOLLAR.WORLD</span>
            </div>
            <div className="social-pills-row">
              <span className="social-pill">Telegram</span>
              <span className="social-pill">WhatsApp</span>
              <span className="social-pill">YouTube</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom-row text-muted text-xs">
          <div>© {new Date().getFullYear()} TENDOLLAR.WORLD. 100% Peer-to-Peer Decentralized Distribution.</div>
          <div className="footer-disclaimer">
            Smart contract interactions carry standard blockchain gas fees on Binance Smart Chain (BEP-20).
          </div>
        </div>
      </div>
    </footer>
  );
};
