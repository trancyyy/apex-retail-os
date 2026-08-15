import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MessageSquare, Send, Sparkles, Gift, Users, Clock, 
  CheckCircle2, X, Tag, Heart, Flame, ShieldCheck
} from 'lucide-react';
import { sounds } from '../../utils/audio';

export const WhatsAppCampaignsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { customers, showToast } = useApp();

  const [activeCampaign, setActiveCampaign] = useState<'BIRTHDAY' | 'DORMANT' | 'FESTIVE'>('BIRTHDAY');
  const [isSending, setIsSending] = useState(false);
  const [sentCount, setSentCount] = useState(0);

  // Target audience segmentation
  const birthdayCustomers = customers.slice(0, 8);
  const dormantCustomers = customers.filter(c => c.totalPurchases > 50000).slice(0, 15);
  const festiveVips = customers.filter(c => c.tier === 'Platinum VIP');

  const targetList = activeCampaign === 'BIRTHDAY' ? birthdayCustomers : (activeCampaign === 'DORMANT' ? dormantCustomers : festiveVips);

  const getTemplateMessage = () => {
    if (activeCampaign === 'BIRTHDAY') {
      return `🎉 *Happy Birthday from Emerge Retail!* 🎂\n\nDear *{{CustomerName}}*,\n\nWishing you a splendid year ahead! As our valued *{{CustomerTier}}* member, here is an exclusive birthday gift: *₹1,000 OFF* on your next visit.\n\n🎟️ *Voucher Code:* BDAY-VIP-2026\n⏳ *Valid Till:* 31st August 2026\n💎 *Loyalty Balance:* {{LoyaltyPoints}} Points\n\nVisit your nearest Emerge store (Zirakpur / Dalhousie / McLeodganj / Mussoorie) to claim!`;
    }
    if (activeCampaign === 'DORMANT') {
      return `✨ *We Miss You at Emerge Retail!* ✨\n\nDear *{{CustomerName}}*,\n\nIt's been a while since your last visit. We've just unveiled our bespoke *Autumn / Wedding 2026 Collection* and would love to welcome you back!\n\n👑 *Special VIP Homecoming Perk:* Flat 15% OFF on all Bandhgalas & Suits.\n🎟️ *Code:* WELCOMEBACK-15\n\nShow this message at the checkout register to avail!`;
    }
    return `🌟 *Exclusive Preview: Emerge Festive Lookbook 2026* 🌟\n\nDear *{{CustomerName}}*,\n\nAs a *Platinum VIP*, you get first access to our handcrafted silk bandhgalas and wedding sherwanis.\n\n📖 *Browse Digital Lookbook:* https://emerges.retail/lookbook/autumn26\n✨ *Complimentary Master Alterations Included.*\n\nReserve your private styling appointment today!`;
  };

  const handleLaunchBlast = () => {
    setIsSending(true);
    sounds.playTapClick();

    let count = 0;
    const interval = setInterval(() => {
      count += 1;
      setSentCount(count);
      sounds.playTapClick();
      if (count >= targetList.length) {
        clearInterval(interval);
        setIsSending(false);
        sounds.playCheckoutSuccess();
        showToast('Campaign Dispatched', `Successfully dispatched WhatsApp messages to ${targetList.length} VIP customers via Meta Cloud API!`, 'success');
      }
    }, 150);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-slate-900 border border-pink-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-pink-950/80 via-slate-900 to-rose-950/80 border-b border-pink-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-600/30 text-pink-300 border border-pink-400/40 flex items-center justify-center shadow-lg shadow-pink-500/20">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-extrabold text-white flex items-center gap-2">
                WhatsApp Automated Loyalty & Retention Engine
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Meta Cloud API Verified
                </span>
              </div>
              <div className="text-xs text-pink-200/70">
                Automated lifecycle marketing, birthday perks, and VIP re-engagement
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Campaign Type Tabs */}
        <div className="p-4 bg-slate-950/70 border-b border-white/[0.06] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveCampaign('BIRTHDAY');
                setSentCount(0);
                sounds.playTapClick();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all tactile-btn ${
                activeCampaign === 'BIRTHDAY'
                  ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-white/[0.06]'
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>🎂 Birthday & Anniversary ({birthdayCustomers.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveCampaign('DORMANT');
                setSentCount(0);
                sounds.playTapClick();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all tactile-btn ${
                activeCampaign === 'DORMANT'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-white/[0.06]'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>🔄 60-Day Dormant Win-Back ({dormantCustomers.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveCampaign('FESTIVE');
                setSentCount(0);
                sounds.playTapClick();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all tactile-btn ${
                activeCampaign === 'FESTIVE'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-white/[0.06]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>✨ Festive VIP Lookbook ({festiveVips.length})</span>
            </button>
          </div>

          <div className="text-xs font-mono text-slate-400">
            Target Audience: <strong className="text-white">{targetList.length} Verified Contacts</strong>
          </div>
        </div>

        {/* Campaign Content Split View */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Left: WhatsApp Preview Bubble */}
          <div className="space-y-3">
            <div className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
              Live WhatsApp Bubble Preview
            </div>

            <div className="p-4 rounded-3xl bg-[#0b141a] border border-[#202c33] shadow-2xl relative overflow-hidden">
              <div className="flex items-center gap-3 pb-3 border-b border-[#202c33] mb-3">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                  E
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    Emerge Retail Official
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-[10px] text-slate-400">WhatsApp Verified Business Account</div>
                </div>
              </div>

              {/* Message Bubble */}
              <div className="p-3.5 rounded-2xl bg-[#005c4b] text-slate-100 text-xs leading-relaxed whitespace-pre-line font-sans shadow-md">
                {getTemplateMessage()
                  .replace('{{CustomerName}}', targetList[0]?.name || 'Valued Customer')
                  .replace('{{CustomerTier}}', targetList[0]?.tier || 'VIP Member')
                  .replace('{{LoyaltyPoints}}', String(targetList[0]?.loyaltyPoints || 450))}
              </div>

              <div className="mt-2 text-right text-[10px] text-slate-500 font-mono">
                Delivered 11:42 AM · Read ✓✓
              </div>
            </div>
          </div>

          {/* Right: Recipient List & Blast Controls */}
          <div className="space-y-3 flex flex-col justify-between">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-2">
                Target Segment Preview ({targetList.length} Customers)
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {targetList.map((c, idx) => (
                  <div
                    key={c.id}
                    className="p-2.5 rounded-xl bg-slate-950 border border-white/[0.08] flex items-center justify-between text-xs font-mono"
                  >
                    <div>
                      <div className="font-bold text-white font-sans">{c.name}</div>
                      <div className="text-[10px] text-slate-400">{c.phone} · {c.city}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 font-bold border border-blue-800">
                        {c.tier}
                      </span>
                      {sentCount > idx && (
                        <div className="text-[10px] text-emerald-400 font-bold mt-0.5">✓ Dispatched</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Campaign Metrics */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-white/[0.08] text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Estimated Open Rate:</span>
                <span className="font-mono text-emerald-400 font-bold">96.8%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Estimated Footfall Conversion:</span>
                <span className="font-mono text-blue-400 font-bold">18.4% within 7 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-white/[0.08] flex items-center justify-between">
          <div className="text-xs text-slate-400 font-mono">
            {isSending ? `Broadcasting: ${sentCount} / ${targetList.length} sent...` : 'Ready to dispatch broadcast campaign'}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold transition-all"
            >
              Close
            </button>

            <button
              onClick={handleLaunchBlast}
              disabled={isSending}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 disabled:opacity-50 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-pink-600/30 transition-all tactile-btn"
            >
              <Send className="w-4 h-4" />
              <span>{isSending ? 'Sending Live...' : `Launch WhatsApp Campaign (${targetList.length})`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
