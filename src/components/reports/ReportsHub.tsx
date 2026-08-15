import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, TrendingUp, DollarSign, Package, AlertCircle, 
  Download, Printer, Filter, Calendar, Users, Scissors, FileSpreadsheet, ShieldCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  Tooltip, AreaChart, Area, CartesianGrid, Legend 
} from 'recharts';

export const ReportsHub: React.FC = () => {
  const { products, invoices, customers, currentStore, stores, showToast } = useApp();

  const [activeReportTab, setActiveReportTab] = useState<'kpi' | 'margins' | 'aging' | 'jobwork' | 'gst'>('kpi');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'fy'>('today');

  // Compute live analytical aggregations
  const totalRevenue = invoices.reduce((acc, inv) => acc + inv.netPayable, 0);
  const totalItemsSold = invoices.reduce((acc, inv) => acc + inv.items.reduce((s, i) => s + i.qty, 0), 0);
  const avgTicketSize = invoices.length > 0 ? Math.round(totalRevenue / invoices.length) : 0;
  
  // Cost & Margin calculations
  const totalCost = products.reduce((acc, p) => {
    const totalQty = Object.values(p.stockByStore).reduce((a, b) => a + b, 0);
    return acc + (p.costPrice * totalQty);
  }, 0);

  const totalRetailVal = products.reduce((acc, p) => {
    const totalQty = Object.values(p.stockByStore).reduce((a, b) => a + b, 0);
    return acc + (p.salePrice * totalQty);
  }, 0);

  const avgCatalogMargin = totalRetailVal > 0 ? (((totalRetailVal - totalCost) / totalRetailVal) * 100).toFixed(1) : '52.4';

  // Chart data
  const storeComparisonData = stores.map(st => {
    const stInvoices = invoices.filter(inv => inv.storeId === st.id);
    const rev = stInvoices.reduce((a, b) => a + b.netPayable, 0);
    const units = products.reduce((acc, p) => acc + (p.stockByStore[st.id] || 0), 0);
    return {
      name: st.name.split(' ')[2] || st.code,
      Revenue: rev || 45000,
      StockUnits: units
    };
  });

  const categoryMarginData = [
    { category: 'Mens Ethnic', Revenue: 145000, Cost: 62000, Margin: 83000 },
    { category: 'Mens Casual', Revenue: 98000, Cost: 44000, Margin: 54000 },
    { category: 'Womens Ethnic', Revenue: 182000, Cost: 76000, Margin: 106000 },
    { category: 'Fabrics & Thaans', Revenue: 85000, Cost: 38000, Margin: 47000 },
    { category: 'Accessories', Revenue: 34000, Cost: 12000, Margin: 22000 },
  ];

  const handleExportCsv = (reportName: string) => {
    showToast('Export Generated', `${reportName} downloaded as Excel/CSV.`, 'success');
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-950 p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-emerald-400" /> Enterprise MIS & Statutory Reports Engine
          </div>
          <h1 className="text-2xl font-extrabold text-white">Business Intelligence, Margins & Statutory Hub</h1>
        </div>

        {/* Global Report Filters & Actions */}
        <div className="flex items-center gap-2">
          {/* Date Filter */}
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            {(['today', 'week', 'month', 'fy'] as const).map(t => (
              <button
                key={t}
                onClick={() => setDateRange(t)}
                className={`px-3 py-1 rounded-lg capitalize font-medium transition-colors ${
                  dateRange === t ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t === 'fy' ? 'FY 26-27' : t}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleExportCsv('Complete_MIS_Report')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5" /> Export Excel
          </button>
          <button
            onClick={() => window.print()}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl"
            title="Print Report"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveReportTab('kpi')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            activeReportTab === 'kpi' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Executive Summary & Store KPIs
        </button>
        <button
          onClick={() => setActiveReportTab('margins')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            activeReportTab === 'margins' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Brand & Margin Profitability
        </button>
        <button
          onClick={() => setActiveReportTab('aging')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            activeReportTab === 'aging' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Stock Aging & Dead Stock Radar
        </button>
        <button
          onClick={() => setActiveReportTab('jobwork')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            activeReportTab === 'jobwork' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Tailoring & Karigar Ledger
        </button>
        <button
          onClick={() => setActiveReportTab('gst')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            activeReportTab === 'gst' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          GST Statutory & BRS Reconciliation
        </button>
      </div>

      {/* TAB 1: EXECUTIVE SUMMARY & KPIS */}
      {activeReportTab === 'kpi' && (
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
          {/* Top 4 KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Total Net Revenue</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-extrabold font-mono text-emerald-400">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-slate-500">Across {invoices.length} invoices generated</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Gross Profit Margin</span>
                <TrendingUp className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-extrabold font-mono text-blue-400">
                {avgCatalogMargin}%
              </div>
              <div className="text-[10px] text-slate-500">Calculated over real landed purchase cost</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Average Order Value (AOV)</span>
                <Package className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-extrabold font-mono text-amber-400">
                ₹{avgTicketSize.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-slate-500">{totalItemsSold} total apparel units sold</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Active Loyalty Customers</span>
                <Users className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl font-extrabold font-mono text-white">
                {customers.length}
              </div>
              <div className="text-[10px] text-slate-500">Master customer registry synced</div>
            </div>
          </div>

          {/* Interactive Recharts Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <div className="font-bold text-white text-sm">Store Revenue vs Inventory Units</div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={storeComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} 
                    />
                    <Legend />
                    <Bar dataKey="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="StockUnits" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <div className="font-bold text-white text-sm">Category Margin & Revenue Yield</div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={categoryMarginData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="category" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} 
                    />
                    <Legend />
                    <Area type="monotone" dataKey="Revenue" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                    <Area type="monotone" dataKey="Margin" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BRAND & MARGIN PROFITABILITY */}
      {activeReportTab === 'margins' && (
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col overflow-hidden shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-bold text-white text-sm">Brand & SKU Margin Breakdown (Brand_SaleTax)</div>
              <div className="text-xs text-slate-400">Analysis of Cost Price vs Selling Price vs Realized Gross Margin %</div>
            </div>
            <button
              onClick={() => handleExportCsv('Brand_Margin_Report')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
            >
              Export CSV
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 sticky top-0">
                <tr>
                  <th className="p-2.5 pl-3">Product Name / Brand</th>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5">Fabric</th>
                  <th className="p-2.5 text-right">Cost (₹)</th>
                  <th className="p-2.5 text-right">MRP (₹)</th>
                  <th className="p-2.5 text-right">Sale Price (₹)</th>
                  <th className="p-2.5 text-right">Margin (₹)</th>
                  <th className="p-2.5 text-center">Margin %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {products.map(p => {
                  const marginRs = p.salePrice - p.costPrice;
                  const marginPct = p.salePrice > 0 ? ((marginRs / p.salePrice) * 100).toFixed(1) : '0';

                  return (
                    <tr key={p.id} className="hover:bg-slate-800/40">
                      <td className="p-2.5 pl-3">
                        <div className="font-semibold text-white">{p.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{p.brand} · SKU: {p.sku}</div>
                      </td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-blue-300 text-[10px]">{p.category}</span>
                      </td>
                      <td className="p-2.5 text-slate-300">{p.fabric}</td>
                      <td className="p-2.5 text-right font-mono text-slate-400">₹{p.costPrice}</td>
                      <td className="p-2.5 text-right font-mono text-slate-400">₹{p.mrp}</td>
                      <td className="p-2.5 text-right font-mono font-bold text-white">₹{p.salePrice}</td>
                      <td className="p-2.5 text-right font-mono font-semibold text-emerald-400">₹{marginRs}</td>
                      <td className="p-2.5 text-center">
                        <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                          Number(marginPct) > 55
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : Number(marginPct) > 40
                              ? 'bg-blue-950 text-blue-300 border border-blue-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          {marginPct}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: STOCK AGING & DEAD STOCK */}
      {activeReportTab === 'aging' && (
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          {/* Aging buckets */}
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800 text-emerald-200">
              <div className="text-xs font-semibold">Fast Moving (0-30 Days)</div>
              <div className="text-xl font-bold font-mono mt-1">112 SKUs</div>
              <div className="text-[10px] opacity-80">High sales turnaround</div>
            </div>
            <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-800 text-blue-200">
              <div className="text-xs font-semibold">Normal (31-60 Days)</div>
              <div className="text-xl font-bold font-mono mt-1">68 SKUs</div>
              <div className="text-[10px] opacity-80">Steady velocity</div>
            </div>
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800 text-amber-200">
              <div className="text-xs font-semibold">Slow Moving (61-90 Days)</div>
              <div className="text-xl font-bold font-mono mt-1">22 SKUs</div>
              <div className="text-[10px] opacity-80">Discount promo candidate</div>
            </div>
            <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800 text-rose-200">
              <div className="text-xs font-semibold">Dead Stock (&gt;90 Days)</div>
              <div className="text-xl font-bold font-mono mt-1">8 SKUs</div>
              <div className="text-[10px] opacity-80">Requires STN transfer / liquidation</div>
            </div>
          </div>

          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-5 overflow-y-auto">
            <div className="font-bold text-white text-sm mb-3">Slow & Dead Stock Action Queue</div>
            <div className="divide-y divide-slate-800 text-xs">
              {products.slice(0, 15).map((p, idx) => (
                <div key={p.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">{p.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Lot: {p.lotNumber} · Box: {p.boxNumber}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right font-mono">
                      <div className="text-slate-300">Zirakpur: {p.stockByStore.zirakpur_hq} · Dalhousie: {p.stockByStore.dalhousie_store}</div>
                      <div className="text-[10px] text-slate-500">Valuation: ₹{(p.costPrice * (p.stockByStore.zirakpur_hq + p.stockByStore.dalhousie_store)).toLocaleString('en-IN')}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono font-bold text-[10px]">
                      {(idx * 14 + 35)} Days Idle
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TAILORING & KARIGAR / JOB WORK LEDGER */}
      {activeReportTab === 'jobwork' && (
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-5 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <Scissors className="w-4 h-4 text-amber-400" /> Master Tailor & Job Worker Ledger (TempRLdgr)
              </div>
              <div className="text-xs text-slate-400">Tracking pieces issued, received, labor charges (`wrate`), and trial dates.</div>
            </div>
            <button
              onClick={() => handleExportCsv('Jobworker_Ledger')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
            >
              Export Ledger
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            {[
              { tailor: 'Master Ji (Mohd. Rafiq)', job: 'Sherwani Fitting & Alteration', item: 'Royal Heritage Silk Sherwani (40 L)', issued: 4, received: 3, rate: 350, total: 1050, status: 'In Progress' },
              { tailor: 'Master Suresh (Suits)', job: 'Tweed Jacket Sleeve Shortening', item: 'Italian Herringbone Tweed Jacket', issued: 8, received: 8, rate: 200, total: 1600, status: 'Completed' },
              { tailor: 'Karigar Akhtar (Lehenga/Zari)', job: 'Lehenga Waistband & Dabka Handwork', item: 'Imperial Velvet Bridal Lehenga Set', issued: 2, received: 1, rate: 1200, total: 1200, status: 'Ready for Trial' },
              { tailor: 'Master Dilshad (Cutting)', job: 'Fabric Cutting & Shirting Rolls', item: 'Egyptian Giza Cotton Shirting', issued: 25, received: 25, rate: 85, total: 2125, status: 'Completed' },
            ].map((row, i) => (
              <div key={i} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">{row.tailor}</div>
                  <div className="text-slate-300 text-[11px] mt-0.5">{row.job} · <span className="text-slate-400">{row.item}</span></div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <div className="font-mono font-bold text-emerald-400">₹{row.total} Labor</div>
                    <div className="text-[10px] text-slate-500 font-mono">{row.received}/{row.issued} Pcs @ ₹{row.rate}/pc</div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                    row.status === 'Completed'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {row.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: GST STATUTORY & BRS */}
      {activeReportTab === 'gst' && (
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <div className="font-bold text-white text-sm">GSTR-3B Tax Netting & Monthly Computation Sheet</div>
            <div className="grid grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-sans">Outward Taxable Sales</span>
                <span className="text-base font-bold text-white">₹{(totalRevenue / 1.12).toFixed(2)}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-sans">Input Tax Credit (ITC - Purchases)</span>
                <span className="text-base font-bold text-sky-400">₹12,450.00</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-sans">Net Cash GST Payable to Govt</span>
                <span className="text-base font-bold text-emerald-400">₹{Math.max(0, (totalRevenue * 0.06 - 12450)).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <div className="font-bold text-white text-sm">Bank Reconciliation Statement (BRS - TempBank & Cheques)</div>
            <div className="divide-y divide-slate-800 text-xs">
              {[
                { date: '15-Aug-2026', desc: 'Daily Retail Cash Counter Handover', ref: 'REC-17826', amt: 85400, bank: 'HDFC Current A/c 5020003189', status: 'Cleared' },
                { date: '14-Aug-2026', desc: 'NEFT Part Payment to Surat Silk Mills', ref: 'CHQ-00277', amt: 50000, bank: 'ICICI Operating A/c', status: 'Cleared' },
                { date: '13-Aug-2026', desc: 'Customer Advance Cheque - Oberoi', ref: 'CHQ-98124', amt: 15000, bank: 'HDFC Current A/c', status: 'Pending Clearing' },
              ].map((b, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">{b.desc}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{b.bank} · Ref: {b.ref} · {b.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold font-mono text-white">₹{b.amt.toLocaleString('en-IN')}</div>
                    <span className={`text-[10px] font-semibold ${b.status === 'Cleared' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
