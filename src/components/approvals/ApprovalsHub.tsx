import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ApprovalVoucher } from '../../types';
import { 
  FileCheck, Plus, Clock, ArrowRight, MessageSquare, 
  CheckCircle2, ShoppingBag, X, Search, Calendar, User
} from 'lucide-react';

export const ApprovalsHub: React.FC = () => {
  const { products, customers, currentStore, addToCart, setActiveTab, setSelectedCustomer, showToast } = useApp();

  const [approvals, setApprovals] = useState<ApprovalVoucher[]>([
    {
      id: 'app-01',
      approvalNo: 'MEMO/ZIR/2026/041',
      date: '2026-08-12',
      dueDate: '2026-08-17',
      customerName: 'Harpreet Singh Sandhu',
      customerPhone: '9876543210',
      storeId: 'zirakpur_hq',
      items: [
        {
          productId: 'p-101',
          sku: 'EM-MPC100-001',
          name: 'Freelook Mpc100 Clean Front Tailored',
          size: '30',
          color: 'White',
          mrp: 995,
          issuedQty: 2,
          returnedQty: 0,
          keptQty: 0
        },
        {
          productId: 'p-102',
          sku: 'EM-MPC100-002',
          name: 'Royal Heritage Silk Sherwani Suit',
          size: '40 (L)',
          color: 'Midnight Blue',
          mrp: 14999,
          issuedQty: 1,
          returnedQty: 0,
          keptQty: 0
        }
      ],
      totalValue: 16989,
      depositAmount: 5000,
      status: 'Issued',
      notes: 'VIP client home trial for wedding selection'
    },
    {
      id: 'app-02',
      approvalNo: 'MEMO/DAL/2026/018',
      date: '2026-08-10',
      dueDate: '2026-08-15',
      customerName: 'Col. Rajesh Bakshi (Retd.)',
      customerPhone: '9816029384',
      storeId: 'dalhousie_store',
      items: [
        {
          productId: 'p-103',
          sku: 'EM-TWEED-03',
          name: 'Italian Herringbone Tweed Jacket',
          size: '42 (XL)',
          color: 'Charcoal Grey',
          mrp: 7999,
          issuedQty: 1,
          returnedQty: 0,
          keptQty: 1
        }
      ],
      totalValue: 7999,
      depositAmount: 2000,
      status: 'Partial Return',
      notes: 'Client keeping Tweed Jacket, returning extra shirts.'
    }
  ]);

  const [newApprovalModal, setNewApprovalModal] = useState(false);
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [selectedProdId, setSelectedProdId] = useState(products[0]?.id || '');
  const [issueQty, setIssueQty] = useState(1);
  const [deposit, setDeposit] = useState(2000);
  const [dueDate, setDueDate] = useState('2026-08-20');
  const [notes, setNotes] = useState('');

  const handleCreateApproval = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find(p => p.id === selectedProdId);
    if (!prod || !custName) return;

    const newApp: ApprovalVoucher = {
      id: 'app-' + Date.now(),
      approvalNo: `MEMO/${currentStore.code}/${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      dueDate,
      customerName: custName,
      customerPhone: custPhone || '9876543210',
      storeId: currentStore.id,
      items: [
        {
          productId: prod.id,
          sku: prod.sku,
          name: prod.name,
          size: prod.size,
          color: prod.color,
          mrp: prod.salePrice,
          issuedQty: Number(issueQty),
          returnedQty: 0,
          keptQty: 0
        }
      ],
      totalValue: prod.salePrice * Number(issueQty),
      depositAmount: Number(deposit),
      status: 'Issued',
      notes
    };

    setApprovals([newApp, ...approvals]);
    setNewApprovalModal(false);
    showToast('Jangad Approval Issued', `${newApp.approvalNo} for ${custName}`, 'success');
  };

  const handleConvertToSale = (app: ApprovalVoucher) => {
    // Attach customer if exists
    const matchedCust = customers.find(c => c.phone === app.customerPhone);
    if (matchedCust) setSelectedCustomer(matchedCust);

    // Add all kept/issued items to POS cart
    app.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        addToCart(prod, item.issuedQty - item.returnedQty);
      }
    });

    // Update approval status
    setApprovals(prev => prev.map(a => a.id === app.id ? { ...a, status: 'Converted to Sale' } : a));

    // Switch to POS tab
    setActiveTab('pos');
    showToast('Approval Converted to POS', `Items loaded with ₹${app.depositAmount} advance adjustment.`, 'success');
  };

  const handleWhatsAppReminder = (app: ApprovalVoucher) => {
    const text = encodeURIComponent(
      `Dear ${app.customerName}, gentle reminder from ${currentStore.name} regarding Approval Memo #${app.approvalNo}.\n\n` +
      `Items: ${app.items.map(i => i.name).join(', ')}\n` +
      `Due Date: ${app.dueDate}\n\n` +
      `Please let us know if you'd like our stylist to collect the selection or finalize your tax invoice. Thank you!`
    );
    window.open(`https://wa.me/91${app.customerPhone}?text=${text}`, '_blank');
    showToast('WhatsApp Reminder Sent', `Sent to ${app.customerName}`, 'success');
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-950 p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-rose-400" /> VIP Memo & Jangad Approvals Hub
          </div>
          <h1 className="text-2xl font-extrabold text-white">Client Approvals, Jangad Memos & Conversion</h1>
        </div>

        <button
          onClick={() => setNewApprovalModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-rose-600/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Issue Items on Approval
        </button>
      </div>

      {/* Approvals Pipeline Stream */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-y-auto p-5 space-y-4 shadow-xl">
        <div className="font-bold text-white text-sm">Active Jangad / Approval Vouchers (FrmAppTransfer)</div>

        <div className="space-y-3">
          {approvals.map(app => (
            <div key={app.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm font-mono">{app.approvalNo}</div>
                    <div className="text-[11px] text-slate-400">
                      Customer: <strong className="text-slate-200">{app.customerName}</strong> ({app.customerPhone}) · Issued: {app.date}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                    app.status === 'Converted to Sale'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : app.status === 'Issued'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800 animate-pulse'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {app.status}
                  </span>

                  {app.status !== 'Converted to Sale' && (
                    <>
                      <button
                        onClick={() => handleConvertToSale(app)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs shadow-md"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Convert to Sale Bill
                      </button>
                      <button
                        onClick={() => handleWhatsAppReminder(app)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg"
                        title="Send WhatsApp Return Reminder"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Items Table */}
              <div className="pt-2 border-t border-slate-900 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                {app.items.map((it, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-900/60 rounded-lg flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-white">{it.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{it.sku} · Size: {it.size} · Color: {it.color}</div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="font-bold text-white">₹{it.mrp.toLocaleString('en-IN')}</div>
                      <div className="text-[10px] text-slate-400">Qty: {it.issuedQty} pcs</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer info */}
              <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-900">
                <div>Due Date: <strong className="text-amber-300">{app.dueDate}</strong> · Security Deposit: <strong className="text-emerald-300 font-mono">₹{app.depositAmount}</strong></div>
                {app.notes && <div className="italic">Note: {app.notes}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE APPROVAL MODAL */}
      {newApprovalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <div className="text-base font-bold text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-rose-400" /> Issue Garment / Luxury Item on Approval
            </div>

            <form onSubmit={handleCreateApproval} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Customer Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="VIP Client Name"
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Mobile Number</label>
                  <input
                    type="text"
                    required
                    placeholder="10-digit phone"
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Select Product for Approval</label>
                <select
                  value={selectedProdId}
                  onChange={(e) => setSelectedProdId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.sku}) - ₹{p.salePrice}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Issued Qty</label>
                  <input
                    type="number"
                    min={1}
                    value={issueQty}
                    onChange={(e) => setIssueQty(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Security Deposit (₹)</label>
                  <input
                    type="number"
                    value={deposit}
                    onChange={(e) => setDeposit(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Return Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Approval Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Wedding trial, home delivery"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setNewApprovalModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-lg"
                >
                  Generate Approval Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
