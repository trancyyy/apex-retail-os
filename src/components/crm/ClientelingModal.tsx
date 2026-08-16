import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';
import { 
  Sparkles, Crown, MessageSquare, Phone, Calendar, 
  Ruler, Heart, Scissors, CheckCircle2, X, Send, Award, Shirt
} from 'lucide-react';
import { sounds } from '../../utils/audio';

export const ClientelingModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { customers, products, showToast } = useApp();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>(customers[0]);
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'measurements' | 'lookbook'>('profile');
  const [messageSent, setMessageSent] = useState(false);

  // Measurements mock
  const [measurements, setMeasurements] = useState({
    chest: '40 in',
    waist: '34 in',
    shoulder: '18 in',
    sleeve: '25.5 in',
    inseam: '31 in',
    neck: '16 in',
    notes: 'Prefers slightly tapered fit at ankle, soft shoulder pads for bandhgalas.'
  });

  const vipCustomers = customers.filter(c => (c.loyaltyPoints || 0) > 300);

  const handleSendWhatsAppLookbook = () => {
    sounds.playTapClick();
    setMessageSent(true);
    showToast(
      'Curated Lookbook Sent', 
      `Personalized wedding season lookbook sent to ${selectedCustomer.name} on WhatsApp (+91 ${selectedCustomer.phone}).`,
      'success'
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white dark:bg-[#242424] text-[#1c1c1c] dark:text-white border border-[#e0e0e0] dark:border-white/[0.1] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 bg-[#f9f9f9] dark:bg-[#1f1f1f] border-b border-[#e5e5e5] dark:border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-pink-600 text-white flex items-center justify-center shadow-sm">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold flex items-center gap-2">
                <span>VIP Clienteling & Personal Stylist Suite</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold">
                  WHITE-GLOVE RETAIL
                </span>
              </div>
              <div className="text-[11px] text-[#5c5c5c] dark:text-white/60">
                1:1 Luxury personal shopper profiles, bespoke measurements & WhatsApp lookbooks
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

        {/* Content Layout */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#e5e5e5] dark:divide-white/[0.08]">
          {/* Left VIP Client Directory (4 Cols) */}
          <div className="md:col-span-4 p-3 flex flex-col overflow-hidden space-y-2 bg-[#f9f9f9] dark:bg-[#1f1f1f]">
            <div className="text-[10px] uppercase font-bold text-[#5c5c5c] dark:text-white/40 px-1">
              Top VIP Client Roster
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {customers.map((c) => {
                const isSelected = selectedCustomer.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedCustomer(c);
                      setMessageSent(false);
                      sounds.playTapClick();
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-amber-500 ring-2 ring-amber-500/20 bg-white dark:bg-[#2b2b2b]'
                        : 'border-[#e0e0e0] dark:border-white/[0.08] hover:border-amber-500/40 bg-white dark:bg-[#242424]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs">{c.name}</div>
                      <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        {c.tier || 'Platinum'}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#5c5c5c] dark:text-white/60 mt-0.5 flex items-center justify-between">
                      <span>+91 {c.phone}</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {c.loyaltyPoints * 120} LTV
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Client 360 Workspace (8 Cols) */}
          <div className="md:col-span-8 p-4 flex flex-col overflow-y-auto space-y-4">
            {/* Client Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-pink-500/10 to-indigo-500/10 border border-amber-500/20 flex items-center justify-between">
              <div>
                <div className="text-base font-bold flex items-center gap-2">
                  <span>{selectedCustomer.name}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                    VIP ELITE
                  </span>
                </div>
                <div className="text-xs text-[#5c5c5c] dark:text-white/70 mt-1 flex items-center gap-3">
                  <span>📞 +91 {selectedCustomer.phone}</span>
                  <span>📍 {selectedCustomer.city || 'Chandigarh'}</span>
                  <span>⭐ {selectedCustomer.loyaltyPoints} Points</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-[#5c5c5c] dark:text-white/40">
                  Stylist Attribution
                </div>
                <div className="text-xs font-bold text-[#0078d4] dark:text-[#60cdff]">
                  Aman K. (3% Commission)
                </div>
              </div>
            </div>

            {/* Sub-tabs */}
            <div className="flex border-b border-[#e5e5e5] dark:border-white/[0.08] gap-2">
              {[
                { id: 'profile', label: 'Style & Preferences', icon: <Heart className="w-3.5 h-3.5" /> },
                { id: 'measurements', label: 'Bespoke Tailoring Specs', icon: <Ruler className="w-3.5 h-3.5" /> },
                { id: 'lookbook', label: 'Curated WhatsApp Lookbook', icon: <Shirt className="w-3.5 h-3.5" /> },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveSubTab(tab.id as any);
                    sounds.playTapClick();
                  }}
                  className={`flex items-center gap-1.5 pb-2 text-xs font-semibold border-b-2 transition-colors ${
                    activeSubTab === tab.id
                      ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                      : 'border-transparent text-[#5c5c5c] dark:text-white/60 hover:text-[#1c1c1c] dark:hover:text-white'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Sub-Tab 1: Profile & Preferences */}
            {activeSubTab === 'profile' && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl border border-[#e0e0e0] dark:border-white/[0.08] bg-[#f9f9f9] dark:bg-[#2b2b2b]">
                    <div className="font-bold mb-1">Preferred Fabrics & Cuts</div>
                    <div className="text-[#5c5c5c] dark:text-white/70 space-y-0.5">
                      <div>• Pure Raw Silk & Italian Wool</div>
                      <div>• Slim Mandarin Collar & Bandhgala</div>
                      <div>• Handcrafted Zari Threadwork</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-[#e0e0e0] dark:border-white/[0.08] bg-[#f9f9f9] dark:bg-[#2b2b2b]">
                    <div className="font-bold mb-1">Upcoming VIP Calendar</div>
                    <div className="text-[#5c5c5c] dark:text-white/70 space-y-0.5">
                      <div>• 🎂 Birthday: 18th Oct (Privilege Gift)</div>
                      <div>• 💍 Anniversary: 24th Nov</div>
                      <div>• 🏛️ Family Wedding Season: Dec 2026</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Tab 2: Bespoke Measurements */}
            {activeSubTab === 'measurements' && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-3 gap-2.5">
                  {Object.entries(measurements).filter(([k]) => k !== 'notes').map(([key, val]) => (
                    <div key={key} className="p-2.5 rounded-lg border border-[#e0e0e0] dark:border-white/[0.08] bg-[#f9f9f9] dark:bg-[#2b2b2b]">
                      <div className="text-[10px] uppercase font-bold text-[#5c5c5c] dark:text-white/40">{key}</div>
                      <div className="font-bold font-mono text-sm mt-0.5 text-[#0078d4] dark:text-[#60cdff]">{val}</div>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl border border-[#e0e0e0] dark:border-white/[0.08] bg-[#f9f9f9] dark:bg-[#2b2b2b]">
                  <div className="font-bold mb-1 text-[11px]">Master Tailor Fitting Notes:</div>
                  <div className="text-[#5c5c5c] dark:text-white/70">{measurements.notes}</div>
                </div>
              </div>
            )}

            {/* Sub-Tab 3: WhatsApp Lookbook Outreach */}
            {activeSubTab === 'lookbook' && (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200">
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    AI Curated Outfit Proposal for {selectedCustomer.name}
                  </div>
                  <div className="text-[11px] leading-relaxed">
                    "Royal Emerald Velvet Sherwani (Size 40) paired with Banarasi Silk Stole & Italian Leather Mojaris. Tailored to client's exact 40 in chest & 34 in waist profile."
                  </div>
                </div>

                {messageSent ? (
                  <div className="p-3.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-400 text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp Lookbook & Private Fitting Invite Delivered!</span>
                  </div>
                ) : (
                  <button
                    onClick={handleSendWhatsAppLookbook}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2 shadow transition-all tactile-btn"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Lookbook & Private Salon Booking Invite via WhatsApp</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
