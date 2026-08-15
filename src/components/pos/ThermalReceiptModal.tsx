import React from 'react';
import { SaleInvoice, Store } from '../../types';
import { Printer, MessageSquare, X, CheckCircle, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Props {
  invoice: SaleInvoice;
  store: Store;
  onClose: () => void;
}

export const ThermalReceiptModal: React.FC<Props> = ({ invoice, store, onClose }) => {
  const { showToast } = useApp();

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const phone = invoice.customer?.phone || '9876543210';
    const text = encodeURIComponent(
      `Hello ${invoice.customer?.name || 'Valued Customer'}, thank you for shopping at ${store.name}!\n\n` +
      `📄 Tax Invoice: ${invoice.invoiceNo}\n` +
      `💰 Amount: ₹${invoice.netPayable.toLocaleString('en-IN')}\n` +
      `🛍️ Items: ${invoice.items.map(i => i.name).join(', ')}\n\n` +
      `View your digital e-Bill & loyalty points anytime. Have a wonderful day!`
    );
    window.open(`https://wa.me/91${phone}?text=${text}`, '_blank');
    showToast('WhatsApp Sent', `Invoice sent to +91 ${phone}`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="text-sm font-bold text-white">Sale Completed Successfully</div>
              <div className="text-[11px] text-slate-400 font-mono">Invoice #{invoice.invoiceNo}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Receipt (80mm)
            </button>
            <button
              onClick={handleWhatsApp}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-emerald-600/20 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              WhatsApp e-Bill
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 80mm ESC/POS Thermal Paper Preview Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950 flex justify-center">
          <div 
            id="thermal-receipt-print-area"
            className="w-[80mm] min-h-[140mm] bg-white text-black p-4 font-mono text-[11px] leading-tight shadow-2xl rounded-sm border border-slate-200 select-all"
          >
            {/* Header */}
            <div className="text-center pb-2 border-b border-dashed border-gray-400">
              <div className="font-extrabold text-[15px] tracking-wider uppercase">{store.name}</div>
              <div className="text-[10px] text-gray-700 mt-0.5">{store.address}</div>
              <div className="text-[10px] text-gray-700">{store.city}, {store.state} · Ph: {store.phone}</div>
              <div className="font-bold text-[11px] mt-1">GSTIN: {store.gstin}</div>
              <div className="font-bold text-[12px] uppercase mt-1 border-t border-b border-black py-0.5 my-1">
                ** TAX INVOICE **
              </div>
            </div>

            {/* Bill Meta */}
            <div className="py-2 border-b border-dashed border-gray-400 text-[10px] space-y-0.5">
              <div className="flex justify-between">
                <span>INVOICE: <strong>{invoice.invoiceNo}</strong></span>
                <span>DATE: {invoice.date}</span>
              </div>
              <div className="flex justify-between">
                <span>TIME: {invoice.time}</span>
                <span>CASHIER: {invoice.cashierName.split(' ')[0]}</span>
              </div>
              {invoice.customer && (
                <div className="mt-1 pt-1 border-t border-dotted border-gray-300">
                  <div>CUSTOMER: <strong>{invoice.customer.name}</strong></div>
                  <div>PHONE: {invoice.customer.phone} · TIER: {invoice.customer.tier}</div>
                </div>
              )}
            </div>

            {/* Items Table */}
            <div className="py-2 border-b border-dashed border-gray-400">
              <div className="grid grid-cols-12 font-bold text-[10px] pb-1 border-b border-black">
                <span className="col-span-6">ITEM / SKU</span>
                <span className="col-span-2 text-right">QTY</span>
                <span className="col-span-2 text-right">RATE</span>
                <span className="col-span-2 text-right">AMT</span>
              </div>
              <div className="divide-y divide-dotted divide-gray-200 mt-1">
                {invoice.items.map((item, idx) => (
                  <div key={idx} className="py-1">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-[9px] text-gray-600 flex justify-between">
                      <span>{item.size} · HSN: 6203</span>
                      {item.discount > 0 && <span className="text-red-700">Disc: -₹{item.discount}</span>}
                    </div>
                    <div className="grid grid-cols-12 text-[10px] mt-0.5">
                      <span className="col-span-6 text-gray-500 font-mono text-[9px]">{item.sku}</span>
                      <span className="col-span-2 text-right">{item.qty}</span>
                      <span className="col-span-2 text-right">₹{item.price}</span>
                      <span className="col-span-2 text-right font-bold">₹{item.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals Breakdown */}
            <div className="py-2 border-b border-dashed border-gray-400 text-[10px] space-y-1">
              <div className="flex justify-between">
                <span>GROSS AMOUNT:</span>
                <span>₹{invoice.grossAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              {invoice.itemDiscountTotal > 0 && (
                <div className="flex justify-between text-red-700">
                  <span>ITEM DISCOUNTS:</span>
                  <span>-₹{invoice.itemDiscountTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              {invoice.billDiscountAmount > 0 && (
                <div className="flex justify-between text-red-700">
                  <span>BILL SCHEME DISCOUNT:</span>
                  <span>-₹{invoice.billDiscountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600 pt-0.5">
                <span>TAXABLE VALUE:</span>
                <span>₹{invoice.taxableTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>CGST:</span>
                <span>₹{invoice.cgstTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>SGST:</span>
                <span>₹{invoice.sgstTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between font-extrabold text-[13px] border-t-2 border-b-2 border-black py-1 my-1">
                <span>NET PAYABLE:</span>
                <span>₹{invoice.netPayable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Tender Breakdown */}
            <div className="py-2 border-b border-dashed border-gray-400 text-[10px] space-y-0.5">
              <div className="font-bold">PAYMENT BREAKDOWN:</div>
              {invoice.tenders.cash > 0 && <div className="flex justify-between"><span>CASH:</span><span>₹{invoice.tenders.cash}</span></div>}
              {invoice.tenders.upi > 0 && <div className="flex justify-between"><span>UPI / QR CODE:</span><span>₹{invoice.tenders.upi}</span></div>}
              {invoice.tenders.creditCard > 0 && <div className="flex justify-between"><span>CREDIT / DEBIT CARD:</span><span>₹{invoice.tenders.creditCard}</span></div>}
              {invoice.tenders.loyaltyRedemption > 0 && <div className="flex justify-between"><span>LOYALTY POINTS REDEEMED:</span><span>₹{invoice.tenders.loyaltyRedemption}</span></div>}
              {invoice.tenders.creditNote > 0 && <div className="flex justify-between"><span>CREDIT NOTE / GIFT CARD:</span><span>₹{invoice.tenders.creditNote}</span></div>}
            </div>

            {/* Barcode & Footer */}
            <div className="pt-3 text-center space-y-2">
              <div className="font-mono text-[9px] tracking-widest bg-gray-100 p-1.5 border border-gray-300">
                |||| | ||||| |||||| |||| | |||||||| ||||
                <div className="mt-0.5 font-bold">{invoice.invoiceNo}</div>
              </div>
              <div className="text-[9px] text-gray-600 leading-tight">
                Exchange within 7 days with original bill & tags intact.<br />
                Thank you for choosing Emerge Retail!
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900 flex justify-between items-center text-xs text-slate-400">
          <span>Thermal ESC/POS 80mm format</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
          >
            Done (ESC)
          </button>
        </div>
      </div>
    </div>
  );
};
