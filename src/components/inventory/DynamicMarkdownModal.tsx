import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Percent, TrendingDown, AlertCircle, ShieldAlert, 
  ArrowUpRight, CheckCircle2, X, Zap, Sparkles, DollarSign
} from 'lucide-react';
import { sounds } from '../../utils/audio';

export const DynamicMarkdownModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { products, showToast } = useApp();
  const [selectedTier, setSelectedTier] = useState<'tier1' | 'tier2' | 'tier3'>('tier1');
  const [pushedToPos, setPushedToPos] = useState(false);

  // Slow moving inventory mock analysis
  const agingItems = products.slice(0, 4).map((p, i) => ({
    ...p,
    daysInStock: 75 + i * 28,
    sellThroughRate: `${(18 - i * 3)}%`,
    currentMargin: '58%',
    recommendedMarkdown: i === 0 ? '15%' : (i === 1 ? '20%' : '30%'),
    projectedGmroi: '2.8x'
  }));

  const handleApplyMarkdowns = () => {
    sounds.playCheckoutSuccess();
    setPushedToPos(true);
    showToast(
      'Dynamic Markdowns Applied',
      'Pushed optimized pricing to all 5 retail registers & Electronic Shelf Labels (ESL).',
      'success'
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white dark:bg-[#242424] text-[#1c1c1c] dark:text-white border border-[#e0e0e0] dark:border-white/[0.1] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 bg-[#f9f9f9] dark:bg-[#1f1f1f] border-b border-[#e5e5e5] dark:border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-sm">
              <Percent className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold flex items-center gap-2">
                <span>AI Dynamic Markdown & Margin Guardian Optimizer</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold">
                  GMROI ENGINE
                </span>
              </div>
              <div className="text-[11px] text-[#5c5c5c] dark:text-white/60">
                Data-driven price adjustments to clear slow-moving inventory while protecting gross profit margins.
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* AI Markdown Strategy Selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                id: 'tier1',
                title: '⚡ Weekend Flash Markdown',
                discount: '15% Off',
                description: 'Triggers fast weekend impulse velocity for 60-90 day styles without eroding prestige.',
                marginImpact: '-3.2% Margin',
                velocity: '+42% Sell-through'
              },
              {
                id: 'tier2',
                title: '🏷️ Seasonal Transition Phase',
                discount: '25% Off',
                description: 'Ideal for transitioning Autumn/Winter styles into festive spring rotation.',
                marginImpact: '-6.5% Margin',
                velocity: '+78% Sell-through'
              },
              {
                id: 'tier3',
                title: '🔥 Clearance & Dead Stock Salvage',
                discount: '35% Off',
                description: 'Liquidates 180+ day inventory to release locked capital back into working cashflow.',
                marginImpact: '-11.0% Margin',
                velocity: '+140% Sell-through'
              },
            ].map((strategy) => (
              <button
                key={strategy.id}
                onClick={() => {
                  setSelectedTier(strategy.id as any);
                  sounds.playTapClick();
                }}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedTier === strategy.id
                    ? 'border-[#0078d4] ring-2 ring-[#0078d4]/20 bg-blue-50/40 dark:bg-blue-950/20'
                    : 'border-[#e0e0e0] dark:border-white/[0.08] bg-[#f9f9f9] dark:bg-[#2b2b2b]'
                }`}
              >
                <div className="font-bold text-xs">{strategy.title}</div>
                <div className="text-base font-extrabold text-[#0078d4] dark:text-[#60cdff] font-mono my-1">
                  {strategy.discount}
                </div>
                <p className="text-[11px] text-[#5c5c5c] dark:text-white/60 leading-relaxed">
                  {strategy.description}
                </p>
                <div className="mt-3 pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[10px] font-semibold">
                  <span className="text-amber-600 dark:text-amber-400">{strategy.marginImpact}</span>
                  <span className="text-emerald-600 dark:text-emerald-400">{strategy.velocity}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Targeted Styles Candidate Table */}
          <div className="border border-[#e0e0e0] dark:border-white/[0.08] rounded-xl overflow-hidden text-xs">
            <div className="p-3 bg-[#f9f9f9] dark:bg-[#1f1f1f] border-b border-[#e0e0e0] dark:border-white/[0.08] font-bold flex items-center justify-between">
              <span>Targeted Slow-Moving Stock Candidates</span>
              <span className="text-[10px] font-normal text-[#5c5c5c] dark:text-white/60">
                Ranked by Days-in-Stock & Aging Velocity
              </span>
            </div>

            <table className="w-full text-left">
              <thead className="bg-[#f3f3f3] dark:bg-[#242424] text-[10px] uppercase font-bold text-[#5c5c5c] dark:text-white/50 border-b border-[#e0e0e0] dark:border-white/[0.08]">
                <tr>
                  <th className="p-3">Style / SKU</th>
                  <th className="p-3">Current MRP</th>
                  <th className="p-3">Days in Boutique</th>
                  <th className="p-3">Sell-Through</th>
                  <th className="p-3">Optimal New Price</th>
                  <th className="p-3 text-right">Projected GMROI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e5e5] dark:divide-white/[0.04]">
                {agingItems.map((item) => {
                  const discountMultiplier = selectedTier === 'tier1' ? 0.85 : (selectedTier === 'tier2' ? 0.75 : 0.65);
                  const markdownPrice = Math.round(item.salePrice * discountMultiplier);

                  return (
                    <tr key={item.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                      <td className="p-3">
                        <div className="font-bold">{item.name}</div>
                        <div className="text-[10px] text-[#5c5c5c] dark:text-white/60 font-mono">SKU: {item.sku}</div>
                      </td>
                      <td className="p-3 font-mono font-semibold">
                        ₹{item.salePrice.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded font-mono font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                          {item.daysInStock} days
                        </span>
                      </td>
                      <td className="p-3 font-mono font-semibold text-rose-600 dark:text-rose-400">
                        {item.sellThroughRate}
                      </td>
                      <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        ₹{markdownPrice.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-[#0078d4] dark:text-[#60cdff]">
                        {item.projectedGmroi}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f9f9f9] dark:bg-[#1f1f1f] border-t border-[#e5e5e5] dark:border-white/[0.08] flex items-center justify-between">
          <div className="text-xs text-[#5c5c5c] dark:text-white/60">
            Total Inventory Value Impact: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">₹48,200 capital unlocked</strong>
          </div>

          {pushedToPos ? (
            <div className="px-4 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Markdowns Live on All POS & ESL Labels</span>
            </div>
          ) : (
            <button
              onClick={handleApplyMarkdowns}
              className="px-5 py-2.5 rounded-xl bg-[#0078d4] hover:bg-[#1a86d9] text-white text-xs font-bold flex items-center gap-2 shadow transition-all tactile-btn"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Apply & Push Dynamic Markdowns to Network</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
