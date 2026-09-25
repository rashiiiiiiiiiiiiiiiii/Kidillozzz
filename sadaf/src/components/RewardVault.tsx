import React from 'react';
import { useHabitly } from '../context/HabitlyContext';

export const RewardVault: React.FC = () => {
  const { rewards, user, claimReward, setIsAddRewardOpen } = useHabitly();

  return (
    <section id="rewards" className="dashboard-section section-reward-vault">
      <div className="section-header-row">
        <div>
          <div className="section-eyebrow">GAMIFICATION & INCENTIVES</div>
          <h2 className="section-main-title">Point & Reward Vault</h2>
          <p className="section-subtitle">
            Convert your hard-earned Spark Points (⚡) into meaningful psychological rewards. Celebrate your consistency guilt-free.
          </p>
        </div>
        <div className="vault-balance-card">
          <div className="vault-balance-left">
            <span className="balance-label">SPARK BALANCE</span>
            <div className="balance-amount">
              <span className="balance-icon">⚡</span>
              <span className="balance-digits">{user.sparkPoints.toLocaleString()}</span>
            </div>
          </div>
          <button className="btn-secondary-cyber" onClick={() => setIsAddRewardOpen(true)}>
            <span>+ Custom Reward</span>
          </button>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="rewards-grid">
        {rewards.map((reward) => {
          const isAffordable = user.sparkPoints >= reward.cost;
          const isUnlocked = user.level >= reward.unlockedLevel;

          return (
            <div
              key={reward.id}
              className={`glass-card reward-card ${!isUnlocked ? 'is-locked' : ''} ${isAffordable && isUnlocked ? 'is-claimable' : ''}`}
            >
              <div className="reward-card-top">
                <div className="reward-icon-box">
                  <span>{reward.icon}</span>
                </div>
                <div className="reward-cost-badge">
                  <span>⚡ {reward.cost} PTS</span>
                </div>
              </div>

              <div className="reward-card-body">
                <h3 className="reward-title">{reward.title}</h3>
                <p className="reward-desc">{reward.description}</p>
                <div className="reward-meta-row">
                  <span className="reward-cat-tag">📁 {reward.category}</span>
                  <span className="reward-claimed-tag">Claimed: {reward.claimedCount}x</span>
                </div>
              </div>

              <div className="reward-card-footer">
                {!isUnlocked ? (
                  <button className="btn-locked-reward" disabled>
                    <span>🔒 Unlocks at Level {reward.unlockedLevel}</span>
                  </button>
                ) : (
                  <button
                    className={`btn-claim-reward ${isAffordable ? 'active-claim' : 'disabled-claim'}`}
                    onClick={() => claimReward(reward.id)}
                    disabled={!isAffordable}
                  >
                    <span>{isAffordable ? '🎁 Claim Reward' : `Need ${reward.cost - user.sparkPoints} Pts`}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
