import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JournalVoucher } from '../../types';
import { 
  BookOpen, Plus, FileSpreadsheet, ShieldCheck, 
  ArrowUpRight, ArrowDownLeft, FileText, CheckCircle2 
} from 'lucide-react';

export const AccountsHub: React.FC = () => {
  const { journalVouchers, addJournalVoucher, invoices, currentStore, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'daybook' | 'jv' | 'gst' | 'audit'>('daybook');
  const [newJvModal, setNewJvModal] = useState(false);

  const [jvType, setJvType] = useState<JournalVoucher['type']>('Payment');
  const [debitAc, setDebitAc] = useState('Rent & Electricity A/c');
  const [creditAc, setCreditAc] = useState('HDFC Bank Current A/c');
  const [jvAmount, setJvAmount] = useState<number>(12500);
  const [narration, setNarration] = useState('Store utility and generator diesel charges');

  const handlePostJv = (e: React.FormEvent) => {
    e.preventDefault();
    addJournalVoucher({
      date: new Date().toISOString().split('T')[0],
      type: jvType,
      debitAccount: debitAc,
      creditAccount: creditAc,
      amount: Number(jvAmount),
      narration,
      storeId: currentStore.id,
      auditUser: 'Accountant (Manoj G.)'
    });

    setNewJvModal(false);
  };

  // GST Calculations
  const totalTaxable = invoices.reduce((acc, inv) => acc + inv.taxableTotal, 0);
  const totalCgst = invoices.reduce((acc, inv) => acc + inv.cgstTotal, 0);
  const totalSgst = invoices.reduce((acc, inv) => acc + inv.sgstTotal, 0);
  const totalGst = totalCgst + totalSgst;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-950 p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider">Financial Accounting & Statutory</div>
          <h1 className="text-2xl font-extrabold text-white">General Ledger, GST & Double-Entry Audit</h1>
        </div>

        {/* Tab Controls & Post JV */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setActiveTab('daybook')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'daybook' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cash & Bank Daybook
            </button>
            <button
              onClick={() => setActiveTab('jv')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'jv' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Journal Vouchers (JVs)
            </button>
            <button
              onClick={() => setActiveTab('gst')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'gst' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              GST Tax Registers
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'audit' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Audit Trail Log
            </button>
          </div>

          <button
            onClick={() => setNewJvModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-600/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Post Journal Voucher
          </button>
        </div>
      </div>

      {/* DAYBOOK TAB */}
      {activeTab === 'daybook' && (
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-y-auto p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="font-bold text-white text-sm">Real-time Transaction Stream & Retail Daybook</div>
            <span className="text-xs text-slate-400 font-mono">Store: {currentStore.name}</span>
          </div>

          <div className="divide-y divide-slate-800 text-xs">
            {invoices.map(inv => (
              <div key={inv.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center border border-emerald-800/60">
                    <ArrowDownLeft className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white font-mono">{inv.invoiceNo}</div>
                    <div className="text-[10px] text-slate-400">
                      {inv.customer?.name || 'Retail Cash Customer'} · {inv.time} · Cashier: {inv.cashierName}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold font-mono text-emerald-400 text-sm">
                    +₹{inv.netPayable.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {inv.tenders.cash > 0 && `Cash ₹${inv.tenders.cash} `}
                    {inv.tenders.upi > 0 && `UPI ₹${inv.tenders.upi} `}
                    {inv.tenders.creditCard > 0 && `Card ₹${inv.tenders.creditCard}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* JOURNAL VOUCHERS TAB */}
      {activeTab === 'jv' && (
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-y-auto p-5 space-y-4 shadow-xl">
          <div className="font-bold text-white text-sm">Double-Entry Journal & Contra Vouchers</div>
          <div className="space-y-3">
            {journalVouchers.map(jv => (
              <div key={jv.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sky-400">{jv.jvNo}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold text-[10px]">
                      {jv.type}
                    </span>
                  </div>
                  <div className="text-sm font-extrabold font-mono text-white">
                    ₹{jv.amount.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="text-slate-300">
                    <span className="text-slate-500 font-mono">Dr:</span> {jv.debitAccount}
                  </div>
                  <div className="text-slate-300 text-right">
                    <span className="text-slate-500 font-mono">Cr:</span> {jv.creditAccount}
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-900">
                  Narration: {jv.narration} · Posted by: {jv.auditUser} ({jv.date})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GST REGISTERS TAB */}
      {activeTab === 'gst' && (
        <div className="flex-1 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Total Taxable Outward</div>
              <div className="text-xl font-bold font-mono text-white mt-1">₹{totalTaxable.toFixed(2)}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Output CGST (PB 2.5% / 6%)</div>
              <div className="text-xl font-bold font-mono text-sky-400 mt-1">₹{totalCgst.toFixed(2)}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Output SGST (PB 2.5% / 6%)</div>
              <div className="text-xl font-bold font-mono text-sky-400 mt-1">₹{totalSgst.toFixed(2)}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Total GST Liability</div>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-1">₹{totalGst.toFixed(2)}</div>
            </div>
          </div>

          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="font-bold text-white text-sm">GSTR-1 Outward Sales Summary (B2C & B2B)</div>
              <button
                onClick={() => showToast('GSTR-1 Exported', 'JSON payload generated for GST Portal.', 'success')}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
              >
                Export GSTR-1 JSON
              </button>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-2.5">Invoice No</th>
                  <th className="p-2.5">Date</th>
                  <th className="p-2.5">Customer & GSTIN</th>
                  <th className="p-2.5 text-right">Taxable (₹)</th>
                  <th className="p-2.5 text-right">CGST (₹)</th>
                  <th className="p-2.5 text-right">SGST (₹)</th>
                  <th className="p-2.5 text-right">Total Invoice (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200 font-mono">
                {invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-800/40">
                    <td className="p-2.5 font-bold text-white">{inv.invoiceNo}</td>
                    <td className="p-2.5 text-slate-400">{inv.date}</td>
                    <td className="p-2.5 font-sans">{inv.customer?.name || 'Walk-in Retail B2C'}</td>
                    <td className="p-2.5 text-right">₹{inv.taxableTotal.toFixed(2)}</td>
                    <td className="p-2.5 text-right text-sky-400">₹{inv.cgstTotal.toFixed(2)}</td>
                    <td className="p-2.5 text-right text-sky-400">₹{inv.sgstTotal.toFixed(2)}</td>
                    <td className="p-2.5 text-right font-bold text-emerald-400">₹{inv.netPayable.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AUDIT TRAIL TAB (Derived from Crescent AuditTrail_HdKREST) */}
      {activeTab === 'audit' && (
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-5 overflow-y-auto space-y-3">
          <div className="font-bold text-white text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Immutable System Audit Trail (AuditTrail_HdKREST)
          </div>
          <div className="text-xs text-slate-400">
            Every transaction edit, deletion, price override, and user login is recorded permanently.
          </div>

          <div className="space-y-2 text-xs">
            {[
              { type: 'SALE_CREATE', id: 'EM/ZIR/26-27/0412', user: 'Amanpreet K.', time: '11:42 AM Today', desc: 'New sale invoice created with split tender (Cash + Card)' },
              { type: 'STN_DISPATCH', id: 'STN/26-27/0088', user: 'Kuldeep Singh', time: 'Yesterday 04:30 PM', desc: '15 units dispatched from Godown to Dalhousie Store' },
              { type: 'AI_OCR_APPROVE', id: 'SSM-INV/2026/894', user: 'Emerges AI Inward', time: '12 Aug 2026', desc: 'Vendor bill ₹68,250 approved into Purchase Ledger' },
              { type: 'PRICE_REVISION', id: 'MRP-REV-2026-08', user: 'Administrator', time: '10 Aug 2026', desc: 'Batch MRP update applied to Mens Casual Tweed category' },
            ].map((log, i) => (
              <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-slate-800 text-blue-300 rounded font-mono text-[10px]">{log.type}</span>
                    <span className="font-mono">{log.id}</span>
                  </div>
                  <div className="text-slate-300 text-[11px] mt-0.5">{log.desc}</div>
                </div>
                <div className="text-right text-[10px] text-slate-400 font-mono">
                  <div>{log.user}</div>
                  <div>{log.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* POST JV MODAL */}
      {newJvModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <div className="text-base font-bold text-white">Post Double-Entry Journal Voucher</div>
            <form onSubmit={handlePostJv} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Voucher Type</label>
                <select
                  value={jvType}
                  onChange={(e) => setJvType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                >
                  <option value="Payment">Payment (Bank / Cash Out)</option>
                  <option value="Receipt">Receipt (Bank / Cash In)</option>
                  <option value="Journal">Journal (Adjustment / Expense)</option>
                  <option value="Contra">Contra (Bank to Cash Transfer)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Debit Account (Dr)</label>
                  <input
                    type="text"
                    value={debitAc}
                    onChange={(e) => setDebitAc(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Credit Account (Cr)</label>
                  <input
                    type="text"
                    value={creditAc}
                    onChange={(e) => setCreditAc(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Voucher Amount (₹)</label>
                <input
                  type="number"
                  value={jvAmount}
                  onChange={(e) => setJvAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Narration / Description</label>
                <textarea
                  rows={2}
                  value={narration}
                  onChange={(e) => setNarration(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setNewJvModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl"
                >
                  Post Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
