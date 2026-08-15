import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';
import { 
  Users, MessageSquare, Award, Gift, Search, 
  Send, Sparkles, Phone, Mail, Calendar, CheckCircle 
} from 'lucide-react';

export const CrmHub: React.FC = () => {
  const { customers, showToast } = useApp();

  const [search, setSearch] = useState('');
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
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-950 p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Customer Relationship & Loyalty</div>
          <h1 className="text-2xl font-extrabold text-white">Customer 360 & WhatsApp Commerce Hub</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast('Sync Complete', 'Customer loyalty balances updated from Cloud.', 'info')}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-medium"
          >
            Sync Loyalty Points
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        {/* Customer List */}
        <div className="lg:col-span-5 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-3.5 border-b border-slate-800 bg-slate-900/90">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by customer name, phone or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800 text-xs">
            {filteredCustomers.map(c => (
              <div
                key={c.id}
                onClick={() => setSelectedCust(c)}
                className={`p-3.5 cursor-pointer transition-all flex items-center justify-between ${
                  selectedCust?.id === c.id
                    ? 'bg-rose-600/15 border-l-4 border-rose-500 text-white'
                    : 'hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-rose-500/20 text-rose-300 font-bold flex items-center justify-center text-sm">
                    {c.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{c.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{c.phone} · {c.city}</div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-amber-300 font-mono">
                    {c.tier} ({c.loyaltyPoints} pts)
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1">₹{c.totalPurchases.toLocaleString('en-IN')} Lifetime</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer 360 View & WhatsApp Marketing */}
        <div className="lg:col-span-7 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-y-auto p-6 space-y-5 shadow-xl">
          {selectedCust ? (
            <>
              {/* Profile Card */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">{selectedCust.name}</h2>
                    <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 text-[10px] font-bold border border-rose-800">
                      {selectedCust.tier}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono flex items-center gap-3">
                    <span>📞 {selectedCust.phone}</span>
                    <span>📍 {selectedCust.city}</span>
                  </div>
                  {selectedCust.email && <div className="text-xs text-slate-400">✉️ {selectedCust.email}</div>}
                </div>

                <div className="text-right p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">Loyalty Cash Card</div>
                  <div className="text-xl font-extrabold font-mono text-amber-300">{selectedCust.loyaltyPoints} Pts</div>
                  <div className="text-[10px] text-slate-500">₹{selectedCust.loyaltyPoints} Redeemable</div>
                </div>
              </div>

              {/* Lifecycle Milestones */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">Birthday</div>
                  <div className="font-semibold text-slate-200 mt-0.5">{selectedCust.birthDate || 'Not set'}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">Wedding Anniversary</div>
                  <div className="font-semibold text-slate-200 mt-0.5">{selectedCust.anniversaryDate || 'Not set'}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">Credit Limit</div>
                  <div className="font-semibold font-mono text-emerald-400 mt-0.5">₹{selectedCust.creditLimit.toLocaleString('en-IN')}</div>
                </div>
              </div>

              {/* WhatsApp Campaign Studio */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white text-xs flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-emerald-400" /> WhatsApp Campaign Trigger
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">1-Click Direct Chat</span>
                </div>

                <div className="flex gap-2">
                  {[
                    { id: 'birthday', label: '🎂 Birthday Offer' },
                    { id: 'anniversary', label: '💍 Anniversary Wish' },
                    { id: 'festive', label: '✨ Festive VIP Drop' },
                    { id: 'loyalty', label: '🎁 Points Expiry Reminder' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setCampaignType(tab.id as any)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        campaignType === tab.id
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={3}
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-emerald-500"
                />

                <button
                  onClick={handleSendWhatsAppCampaign}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
                >
                  <Send className="w-4 h-4" /> Send WhatsApp Message to {selectedCust.name}
                </button>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs">
              Select a customer to view complete CRM 360 profile.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
