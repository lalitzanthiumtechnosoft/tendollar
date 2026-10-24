import React, { useState } from 'react';
import { Play, Sparkles, RefreshCw, UserPlus, Zap, ChevronUp, ChevronDown } from 'lucide-react';

interface SandboxBarProps {
  onAddDirectReferral: () => void;
  onTriggerMatrixCycle: () => void;
  onTriggerCapitalPayout: () => void;
  onResetData: () => void;
}

export const SandboxBar: React.FC<SandboxBarProps> = ({
  onAddDirectReferral,
  onTriggerMatrixCycle,
  onTriggerCapitalPayout,
  onResetData,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <aside className="sandbox-bar-container glass-panel" id="sandbox-simulator-bar">
      <div className="sandbox-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="sandbox-header-left">
          <div className="sandbox-badge">
            <Sparkles size={13} className="text-cyan" />
            <span>WEB3 SIMULATION SUITE</span>
          </div>
          <span className="sandbox-caption text-xs text-muted desktop-only">
            Interactive Testbed for tenDOLLAR Smart Contract Logic
          </span>
        </div>
        <button className="btn-toggle-sandbox" id="toggle-sandbox-btn">
          {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>

      {isExpanded && (
        <div className="sandbox-actions-row">
          <button
            className="btn btn-secondary btn-sm sandbox-btn"
            onClick={onAddDirectReferral}
            title="Simulate a new partner activating $80 package"
            id="sandbox-add-referral-btn"
          >
            <UserPlus size={14} className="text-cyan" />
            <span>+ New Direct Partner (+$16)</span>
          </button>

          <button
            className="btn btn-secondary btn-sm sandbox-btn"
            onClick={onTriggerMatrixCycle}
            title="Simulate matrix cycle with re-entry"
            id="sandbox-trigger-matrix-btn"
          >
            <Zap size={14} className="text-gold" />
            <span>Complete Matrix Cycle (+$4/$4)</span>
          </button>

          <button
            className="btn btn-secondary btn-sm sandbox-btn"
            onClick={onTriggerCapitalPayout}
            title="Trigger 10-day automated $4 payout"
            id="sandbox-trigger-capital-btn"
          >
            <Play size={14} className="text-emerald" />
            <span>10-Day Capital Payout (+$4)</span>
          </button>

          <button
            className="btn btn-secondary btn-sm sandbox-btn reset-btn"
            onClick={onResetData}
            title="Reset to default starting figures"
            id="sandbox-reset-btn"
          >
            <RefreshCw size={14} />
            <span>Reset Demo</span>
          </button>
        </div>
      )}
    </aside>
  );
};
