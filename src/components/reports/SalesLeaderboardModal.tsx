import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Trophy, Flame, TrendingUp, Award, DollarSign, 
  Target, Users, Star, X, Sparkles, CheckCircle2
} from 'lucide-react';
import { sounds } from '../../utils/audio';

export const SalesLeaderboardModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { currentStore } = useApp();

  const salesReps = [
    { rank: 1, name: 'Aman K.', salesToday: 142800, target: 120000, billsCount: 18, commission: 4284, badge: '👑 Top Star', tier: 'Diamond Tier (3%)' },
    { rank: 2, name: 'Simran D.', salesToday: 98500, target: 90000, billsCount: 12, commission: 2955, badge: '🔥 Hot Streak', tier: 'Gold Tier (3%)' },
    { rank: 3, name: 'Rohit V.', salesToday: 74200, target: 80000, billsCount: 9, commission: 1855, badge: '⚡ On Pace', tier: 'Silver Tier (2.5%)' },
    { rank: 4, name: 'Kavita M.', salesToday: 51000, target: 75000, billsCount: 7, commission: 1275, badge: '🌱 Rising', tier: 'Bronze Tier (2.5%)' }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white dark:bg-[#242424] text-[#1c1c1c] dark:text-white border border-[#e0e0e0] dark:border-white/[0.1] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 bg-[#f9f9f9] dark:bg-[#1f1f1f] border-b border-[#e5e5e5] dark:border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-sm">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold flex items-center gap-2">
                <span>Staff Gamification & Daily Incentive Leaderboard</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold">
                  LIVE RUN-RATE
                </span>
              </div>
              <div className="text-[11px] text-[#5c5c5c] dark:text-white/60">
                Real-time target quotas, sales commission tracker, and motivation leaderboard for {currentStore.name}.
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-[#5c5c5c] dark:text-white/70 hover:text-[#1c1c1c] dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Store Quota Progress Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-indigo-500/10 border border-amber-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400">
                Today's Store Target vs Actual
              </div>
              <div className="text-xl font-extrabold font-mono mt-0.5">
                ₹3,66,500 <span className="text-xs font-normal text-[#5c5c5c] dark:text-white/60">/ ₹3,50,000 Target</span>
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                104.7% of Daily Target Achieved!
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-[#5c5c5c] dark:text-white/40">
                Total Staff Commission Earned Today
              </div>
              <div className="text-lg font-bold font-mono text-[#0078d4] dark:text-[#60cdff]">
                ₹10,369
              </div>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="border border-[#e0e0e0] dark:border-white/[0.08] rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#f3f3f3] dark:bg-[#1f1f1f] text-[10px] uppercase font-bold text-[#5c5c5c] dark:text-white/50 border-b border-[#e0e0e0] dark:border-white/[0.08]">
                <tr>
                  <th className="p-3">Rank</th>
                  <th className="p-3">Sales Associate</th>
                  <th className="p-3">Today's Sales</th>
                  <th className="p-3">Target Quota</th>
                  <th className="p-3">Bills Count</th>
                  <th className="p-3">Incentive Tier</th>
                  <th className="p-3 text-right">Commission Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e5e5] dark:divide-white/[0.04]">
                {salesReps.map((rep) => (
                  <tr key={rep.rank} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                    <td className="p-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        rep.rank === 1 
                          ? 'bg-amber-500 text-white shadow'
                          : (rep.rank === 2 ? 'bg-slate-300 dark:bg-slate-700 text-black dark:text-white' : 'bg-black/5 dark:bg-white/5')
                      }`}>
                        {rep.rank}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="font-bold flex items-center gap-1.5">
                        {rep.name}
                        <span className="text-[10px] font-normal text-amber-600 dark:text-amber-400">
                          {rep.badge}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{rep.salesToday.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 font-mono text-[#5c5c5c] dark:text-white/60">
                      ₹{rep.target.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 font-mono">
                      {rep.billsCount} bills
                    </td>
                    <td className="p-3 text-[#0078d4] dark:text-[#60cdff] font-medium">
                      {rep.tier}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-[#0078d4] dark:text-[#60cdff]">
                      ₹{rep.commission.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f9f9f9] dark:bg-[#1f1f1f] border-t border-[#e5e5e5] dark:border-white/[0.08] flex items-center justify-between">
          <div className="text-xs text-[#5c5c5c] dark:text-white/60">
            Monthly Store Bonus Pool: <strong className="text-amber-600 dark:text-amber-400 font-mono">₹50,000 Unlocked on 100% Target Met</strong>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#0078d4] hover:bg-[#1a86d9] text-white text-xs font-bold transition-all tactile-btn"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
