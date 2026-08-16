import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';
import { 
  Users, MessageSquare, Award, Gift, Search, 
  Send, Sparkles, Phone, Mail, Calendar, CheckCircle, Zap, Crown 
} from 'lucide-react';
import { WhatsAppCampaignsModal } from './WhatsAppCampaignsModal';
import { ClientelingModal } from './ClientelingModal';
import { sounds } from '../../utils/audio';

export const CrmHub: React.FC = () => {
  const { customers, showToast } = useApp();

  const [search, setSearch] = useState('');
  const [campaignsModalOpen, setCampaignsModalOpen] = useState(false);
  const [clientelingModalOpen, setClientelingModalOpen] = useState(false);
  const [selectedCust, setSelectedCust] = useState<Customer | null>(customers[0] || null);
  const [campaignType, setCampaignType] = useState<'birthday' | 'anniversary' | 'festive' | 'loyalty'>('birthday');
  const [customMsg, setCustomMsg] = useState(
    "Happy Birthday from Emerge Retail! 🎉 Enjoy an exclusive 20% privilege discount on your next visit to our Zirakpur Flagship or Dalhousie store. Valid for 7 days."
  );

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.phone.includes(search) || 
    c.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleSendWhatsAppCampaign = () => {
    if (!selectedCust) return;
    const phone = selectedCust.phone;
    const text = encodeURIComponent(customMsg);
    window.open(`https://wa.me/91${phone}?text=${text}`, '_blank');
    showToast('WhatsApp Campaign Dispatched', `Message sent to ${selectedCust.name}`, 'success');
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#f3f3f3] dark:bg-slate-950 text-[#1c1c1c] dark:text-white p-6 space-y-5 transition-colors duration-150">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Customer Relationship & Loyalty</div>
          <h1 className="text-2xl font-extrabold">Customer 360 & VIP Clienteling Hub</h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setClientelingModalOpen(true);
              sounds.playTapClick();
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-pink-600 hover:from-amber-400 hover:to-pink-500 text-white rounded-xl text-xs font-bold shadow transition-all tactile-btn"
          >
            <Crown className="w-4 h-4" /> 👑 VIP Clienteling & Styling
          </button>
          <button
            onClick={() => {
              setCampaignsModalOpen(true);
              sounds.playTapClick();
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl text-xs font-bold shadow transition-all tactile-btn"
          >
            <Sparkles className="w-4 h-4" /> 🚀 Automated WhatsApp Campaigns
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        {/* Left Customer List */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-[#e0e0e0] dark:border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[#e0e0e0] dark:border-slate-800 bg-[#f9f9f9] dark:bg-slate-900/50">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by name, phone or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-[#e0e0e0] dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-[#1c1c1c] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#0078d4]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#e5e5e5] dark:divide-slate-800/50 p-2 space-y-1">
            {filteredCustomers.map(c => {
              const isSelected = selectedCust?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCust(c)}
                  className={`p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-blue-50 dark:bg-slate-800/80 border border-[#0078d4] dark:border-rose-500/50 shadow-sm' 
                      : 'hover:bg-black/5 dark:hover:bg-slate-800/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-bold">{c.name}</div>
                      <div className="text-[10px] text-[#5c5c5c] dark:text-slate-400 font-mono mt-0.5">+91 {c.phone}</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                      {c.tier || 'Silver'}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[10px] text-[#5c5c5c] dark:text-slate-400">
                    <span>{c.city || 'Punjab'}</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{c.loyaltyPoints} Pts</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detail Pane */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-[#e0e0e0] dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between overflow-y-auto shadow-sm">
          {selectedCust ? (
            <>
              <div className="space-y-6">
                <div className="flex items-start justify-between pb-4 border-b border-[#e0e0e0] dark:border-slate-800">
                  <div>
                    <div className="text-xl font-black">{selectedCust.name}</div>
                    <div className="text-xs text-[#5c5c5c] dark:text-slate-400 mt-1 flex items-center gap-3">
                      <span>📞 +91 {selectedCust.phone}</span>
                      <span>📍 {selectedCust.city || 'Chandigarh'}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-[#5c5c5c] dark:text-slate-400 uppercase font-semibold">Available Reward Balance</div>
                    <div className="text-2xl font-black text-[#0078d4] dark:text-rose-400 font-mono">{selectedCust.loyaltyPoints} Pts</div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">Worth ₹{selectedCust.loyaltyPoints} in Store</div>
                  </div>
                </div>

                {/* Campaign message composer */}
                <div className="space-y-2">
                  <div className="text-xs font-bold">Quick WhatsApp Campaign Dispatch</div>
                  <div className="flex gap-2">
                    {[
                      { id: 'birthday', label: '🎂 Birthday Perk' },
                      { id: 'anniversary', label: '💍 Anniversary' },
                      { id: 'festive', label: '🪔 Festive Collection' }
                    ].map(camp => (
                      <button
                        key={camp.id}
                        onClick={() => {
                          setCampaignType(camp.id as any);
                          if (camp.id === 'birthday') setCustomMsg(`Happy Birthday from Emerge Retail! 🎉 Exclusive 20% privilege discount on your next visit.`);
                          if (camp.id === 'anniversary') setCustomMsg(`Happy Anniversary from Emerge Retail! 💍 Enjoy an exclusive styling appointment & gift on us.`);
                          if (camp.id === 'festive') setCustomMsg(`New Festive Royal Velvet & Silk Collection now live at Emerge Retail! Visit us this weekend.`);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          campaignType === camp.id
                            ? 'bg-[#0078d4] text-white border-[#0078d4]'
                            : 'border-[#e0e0e0] dark:border-slate-800 bg-[#f9f9f9] dark:bg-slate-800/40 text-[#5c5c5c] dark:text-slate-300'
                        }`}
                      >
                        {camp.label}
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={3}
                    value={customMsg}
                    onChange={(e) => setCustomMsg(e.target.value)}
                    className="w-full bg-[#f9f9f9] dark:bg-slate-950 border border-[#e0e0e0] dark:border-slate-800 rounded-xl p-3 text-xs leading-relaxed focus:outline-none focus:border-[#0078d4]"
                  />

                  <button
                    onClick={handleSendWhatsAppCampaign}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow transition-all tactile-btn"
                  >
                    <Send className="w-4 h-4" /> Send WhatsApp Message to {selectedCust.name}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs">
              Select a customer to view complete CRM 360 profile.
            </div>
          )}
        </div>
      </div>

      {campaignsModalOpen && (
        <WhatsAppCampaignsModal onClose={() => setCampaignsModalOpen(false)} />
      )}

      {clientelingModalOpen && (
        <ClientelingModal onClose={() => setClientelingModalOpen(false)} />
      )}
    </div>
  );
};
