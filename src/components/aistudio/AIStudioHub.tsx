import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VendorBillAI, AnomalyAlert, CopilotMessage } from '../../types';
import { 
  Sparkles, FileText, Bot, Camera, ShieldAlert, CheckCircle2, 
  ArrowRight, Upload, Check, AlertTriangle, Send, RefreshCw, Layers
} from 'lucide-react';

export const AIStudioHub: React.FC = () => {
  const { 
    aiBills, addAiBill, approveAiBill, 
    anomalies, resolveAnomaly, 
    products, invoices, currentStore, showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ocr' | 'copilot' | 'vision' | 'sentinel'>('ocr');
  const [selectedBill, setSelectedBill] = useState<VendorBillAI | null>(aiBills[0] || null);
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);

  // Copilot State
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: "Hello! I am your EmergesOS AI Copilot. I'm connected to your real-time sales, inventory matrices, and vendor inward ledgers across Zirakpur and Dalhousie stores. What would you like to analyze?",
      timestamp: 'Just now',
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');

  // Vision Cataloger State
  const [visionImage, setVisionImage] = useState<string>('https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80');
  const [isVisionAnalyzing, setIsVisionAnalyzing] = useState(false);
  const [visionResults, setVisionResults] = useState<{
    detectedStyle: string;
    detectedColors: string[];
    suggestedFabric: string;
    suggestedHsn: string;
    estimatedCost: number;
    recommendedMrp: number;
    generatedTitle: string;
    seoKeywords: string[];
  } | null>({
    detectedStyle: 'Bandhgala Embroidered Royal Suit',
    detectedColors: ['Midnight Blue', 'Metallic Gold Zari'],
    suggestedFabric: 'Pure Raw Silk with Jacquard Weft',
    suggestedHsn: '6203',
    estimatedCost: 6200,
    recommendedMrp: 14999,
    generatedTitle: 'Midnight Blue Hand-Embroidered Raw Silk Bandhgala Sherwani',
    seoKeywords: ['mens-ethnic', 'royal-sherwani', 'midnight-blue', 'wedding-collection-2026']
  });

  const handleSimulateNewBillUpload = () => {
    setIsOcrProcessing(true);
    setTimeout(() => {
      const newBill: VendorBillAI = {
        id: 'ai-bill-' + Date.now(),
        vendorName: 'Amritsar Shawl & Woolen Emporium',
        vendorGstin: '03AABCA4419P1ZL',
        invoiceNo: `ASW/2026/${Math.floor(100 + Math.random() * 900)}`,
        invoiceDate: new Date().toISOString().split('T')[0],
        items: [
          {
            description: 'Handwoven Pashmina Stole (Embroidered Border)',
            hsn: '6214',
            fabric: 'Cashmere Wool',
            size: '2.5 Meters',
            quantity: 25,
            rate: 2200,
            taxableValue: 55000,
            gstRate: 5,
            total: 57750
          },
          {
            description: 'Pure Tweed Fabric Roll (Charcoal Grey)',
            hsn: '5112',
            fabric: 'Wool Rich 80/20',
            size: '50 Meters Roll',
            quantity: 50,
            rate: 850,
            taxableValue: 42500,
            gstRate: 5,
            total: 44625
          }
        ],
        subTotal: 97500,
        cgst: 2437.5,
        sgst: 2437.5,
        igst: 0,
        grandTotal: 102375,
        confidenceScore: 0.99,
        status: 'Pending Review',
        originalFileName: 'Amritsar_Woolen_Bill_Scanned.pdf'
      };

      addAiBill(newBill);
      setSelectedBill(newBill);
      setIsOcrProcessing(false);
    }, 1500);
  };

  const handleSendCopilotMessage = (promptText?: string) => {
    const text = promptText || inputPrompt;
    if (!text.trim()) return;

    const userMsg: CopilotMessage = {
      id: 'm-' + Date.now(),
      sender: 'user',
      text,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    if (!promptText) setInputPrompt('');

    setTimeout(() => {
      let aiReply = "I have analyzed your request across all branches.";
      const lower = text.toLowerCase();

      if (lower.includes('dalhousie') || lower.includes('compare')) {
        aiReply = `📊 **Store Performance Comparison (Today):**\n\n• **Zirakpur Flagship:** ₹13,198 (2 bills) · Top Category: Men's Ethnic\n• **Dalhousie Outlet:** ₹5,999 (1 bill) · Top Category: Mens Tweed Jacket\n\n💡 *Insight:* Dalhousie winter outerwear demand is trending +34% higher due to seasonal tourist traffic.`;
      } else if (lower.includes('dead stock') || lower.includes('slow')) {
        aiReply = `⚠️ **Dead Stock Alert (>45 days):**\n\n1. **EM-SAREE-KANI-PASH (Dalhousie)**: 8 units in stock with 0 scans in 14 days.\n2. **EM-ACC-SILK-POCKET-SQ (Godown)**: 90 units idle.\n\n💡 *Action:* Recommend initiating an STN transfer of 5 Sarees to Zirakpur HQ or activating the 'FESTIVE_500' promo slab.`;
      } else if (lower.includes('margin') || lower.includes('profit')) {
        aiReply = `💎 **Gross Margin Report:**\n\n• Average Catalog Markup: **58.4%**\n• Highest Margin SKU: **Royal Heritage Silk Sherwani** (61.2% GM)\n• Lowest Margin SKU: **Giza Cotton Fabric** (45.6% GM)\n\nNet profit realized today after scheme deductions: **₹10,890**.`;
      } else {
        aiReply = `I have executed your query: "${text}". All inventory levels and GST ledger balances are in healthy compliance.`;
      }

      const aiMsg: CopilotMessage = {
        id: 'm-' + (Date.now() + 1),
        sender: 'ai',
        text: aiReply,
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 600);
  };

  const handleSimulateVisionTagging = () => {
    setIsVisionAnalyzing(true);
    setTimeout(() => {
      setIsVisionAnalyzing(false);
      setVisionResults({
        detectedStyle: 'Embroidered Kashmiri Silk Pashmina Weave',
        detectedColors: ['Ivory Cream', 'Mustard Yellow', 'Forest Green'],
        suggestedFabric: 'Mulberry Silk & Pashmina Wool Weft',
        suggestedHsn: '5007',
        estimatedCost: 8900,
        recommendedMrp: 18500,
        generatedTitle: 'Handcrafted Kashmiri Floral Kani Silk Saree with Blouse Piece',
        seoKeywords: ['kani-saree', 'pashmina-silk', 'handwoven', 'wedding-luxury-2026']
      });
      showToast('Vision Tags Generated', 'Product attributes extracted from image.', 'success');
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-950 p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" /> Emerges AI Intelligence Suite
          </div>
          <h1 className="text-2xl font-extrabold text-white">AI Digitization & Operational Sentinel</h1>
        </div>

        {/* AI Studio Tabs */}
        <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
          <button
            onClick={() => setActiveTab('ocr')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'ocr' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Inward Bill OCR
          </button>
          <button
            onClick={() => setActiveTab('copilot')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'copilot' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5" /> MIS Copilot
          </button>
          <button
            onClick={() => setActiveTab('vision')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'vision' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" /> Visual Style Tagger
          </button>
          <button
            onClick={() => setActiveTab('sentinel')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'sentinel' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" /> Loss Sentinel
          </button>
        </div>
      </div>

      {/* TAB 1: INWARD BILL OCR DIGITIZER */}
      {activeTab === 'ocr' && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
          {/* Bill Ingestion List & Upload Panel */}
          <div className="lg:col-span-4 flex flex-col gap-4 overflow-hidden">
            {/* Upload Dropzone */}
            <div 
              onClick={handleSimulateNewBillUpload}
              className="p-6 rounded-2xl border-2 border-dashed border-purple-500/30 hover:border-purple-500 bg-purple-950/20 hover:bg-purple-950/40 cursor-pointer transition-all flex flex-col items-center justify-center text-center space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-white">
                {isOcrProcessing ? '🤖 Gemini OCR Parsing Invoice...' : 'Upload Supplier Bill (PDF / Scan / Photo)'}
              </div>
              <div className="text-[10px] text-slate-400">
                Click to ingest sample vendor invoice into structured draft GRN
              </div>
            </div>

            {/* List of Ingested Bills */}
            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-3 overflow-y-auto space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                Ingested Vendor Bills ({aiBills.length})
              </div>
              {aiBills.map(b => (
                <div
                  key={b.id}
                  onClick={() => setSelectedBill(b)}
                  className={`p-3 rounded-xl cursor-pointer text-xs transition-all border ${
                    selectedBill?.id === b.id
                      ? 'bg-purple-600/15 border-purple-500/40 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-white">{b.vendorName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Inv #{b.invoiceNo} · {b.invoiceDate}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      b.status === 'Approved'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {b.status}
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-800/80 flex justify-between items-center text-[11px]">
                    <span className="text-purple-300 font-mono">{(b.confidenceScore * 100).toFixed(0)}% OCR Confidence</span>
                    <span className="font-bold text-white font-mono">₹{b.grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bill Extraction Details & 1-Click Approval */}
          <div className="lg:col-span-8 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {selectedBill ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header info */}
                <div className="p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-white">{selectedBill.vendorName}</h2>
                      <span className="px-2 py-0.5 bg-purple-950 text-purple-300 rounded font-mono text-[10px] border border-purple-800">
                        GSTIN: {selectedBill.vendorGstin}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Invoice No: <strong className="text-slate-200 font-mono">{selectedBill.invoiceNo}</strong> · Date: {selectedBill.invoiceDate}
                    </div>
                  </div>

                  {selectedBill.status === 'Pending Review' ? (
                    <button
                      onClick={() => approveAiBill(selectedBill.id)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
                    >
                      <Check className="w-4 h-4" /> 1-Click Approve & Convert to GRN
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950 border border-emerald-800 rounded-xl text-xs font-semibold text-emerald-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Booked in Purchase Ledger
                    </div>
                  )}
                </div>

                {/* Extracted Line Items */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  <div className="text-xs font-semibold text-slate-300">Extracted Line Items (Multimodal AI Verified):</div>
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                      <tr>
                        <th className="p-2.5">Item Description</th>
                        <th className="p-2.5">HSN</th>
                        <th className="p-2.5">Fabric / Roll</th>
                        <th className="p-2.5 text-right">Qty</th>
                        <th className="p-2.5 text-right">Rate (₹)</th>
                        <th className="p-2.5 text-right">Taxable</th>
                        <th className="p-2.5 text-right">GST %</th>
                        <th className="p-2.5 text-right">Total (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-200">
                      {selectedBill.items.map((i, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40">
                          <td className="p-2.5 font-medium text-white">{i.description}</td>
                          <td className="p-2.5 font-mono text-slate-400">{i.hsn}</td>
                          <td className="p-2.5 text-slate-300">{i.fabric} ({i.size})</td>
                          <td className="p-2.5 text-right font-mono font-bold">{i.quantity}</td>
                          <td className="p-2.5 text-right font-mono">₹{i.rate}</td>
                          <td className="p-2.5 text-right font-mono">₹{i.taxableValue.toLocaleString('en-IN')}</td>
                          <td className="p-2.5 text-right font-mono">{i.gstRate}%</td>
                          <td className="p-2.5 text-right font-mono font-bold text-emerald-400">
                            ₹{i.total.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Summary calculations */}
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block">Subtotal:</span>
                      <span className="text-sm font-bold font-mono text-white">₹{selectedBill.subTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">CGST:</span>
                      <span className="text-sm font-bold font-mono text-slate-300">₹{selectedBill.cgst.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">SGST:</span>
                      <span className="text-sm font-bold font-mono text-slate-300">₹{selectedBill.sgst.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Grand Total:</span>
                      <span className="text-base font-extrabold font-mono text-emerald-400">₹{selectedBill.grandTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
                Select a vendor bill to preview extracted fields.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CONVERSATIONAL MIS COPILOT */}
      {activeTab === 'copilot' && (
        <div className="flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          {/* Preset Prompts Bar */}
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider shrink-0">Quick Prompts:</span>
            <button
              onClick={() => handleSendCopilotMessage("Compare Dalhousie vs Zirakpur sales today")}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-purple-300 border border-purple-500/20 whitespace-nowrap"
            >
              📊 Compare Store Sales
            </button>
            <button
              onClick={() => handleSendCopilotMessage("Show dead stock in Men's Casuals older than 45 days")}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/20 whitespace-nowrap"
            >
              ⚠️ Dead Stock Radar
            </button>
            <button
              onClick={() => handleSendCopilotMessage("What is our gross profit margin after schemes this week?")}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/20 whitespace-nowrap"
            >
              💰 Margin Leakage Check
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map(m => (
              <div
                key={m.id}
                className={`flex gap-3 max-w-2xl ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  m.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'
                }`}>
                  {m.sender === 'user' ? 'U' : <Bot className="w-4 h-4" />}
                </div>

                <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-line'
                }`}>
                  {m.text}
                  <div className={`text-[10px] mt-1.5 opacity-60 ${m.sender === 'user' ? 'text-right text-blue-200' : 'text-slate-400'}`}>
                    {m.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendCopilotMessage(); }}
            className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask Emerges Copilot anything (e.g. 'Which fabrics have highest sales turnover?')..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              className="p-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-lg shadow-purple-600/30 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: VISUAL STYLE TAGGER */}
      {activeTab === 'vision' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden">
          <div className="lg:col-span-5 p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-between space-y-4">
            <div className="w-full">
              <div className="text-xs font-bold text-white mb-2">Upload or Select Garment / Product Photo</div>
              <div className="w-full h-64 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 flex items-center justify-center relative">
                <img src={visionImage} alt="Product" className="w-full h-full object-cover" />
              </div>
            </div>

            <button
              onClick={handleSimulateVisionTagging}
              disabled={isVisionAnalyzing}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20"
            >
              <Sparkles className="w-4 h-4" /> {isVisionAnalyzing ? 'Analyzing Garment with Gemini Vision...' : 'Auto-Extract Attributes with AI Vision'}
            </button>
          </div>

          <div className="lg:col-span-7 p-6 bg-slate-900 border border-slate-800 rounded-2xl overflow-y-auto space-y-4">
            <div className="text-sm font-bold text-white">AI Vision Extracted Product Matrix</div>
            
            {visionResults && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Generated Catalog Title</div>
                  <div className="font-bold text-white text-sm mt-0.5">{visionResults.generatedTitle}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Detected Garment Style</div>
                    <div className="font-semibold text-slate-200">{visionResults.detectedStyle}</div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Recommended Fabric Blend</div>
                    <div className="font-semibold text-slate-200">{visionResults.suggestedFabric}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Suggested HSN</div>
                    <div className="font-bold font-mono text-slate-200">{visionResults.suggestedHsn}</div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Estimated Cost</div>
                    <div className="font-bold font-mono text-slate-400">₹{visionResults.estimatedCost}</div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Target Retail MRP</div>
                    <div className="font-bold font-mono text-emerald-400">₹{visionResults.recommendedMrp}</div>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-[10px] mb-1.5">Auto-generated Tag Descriptors</div>
                  <div className="flex flex-wrap gap-1.5">
                    {visionResults.seoKeywords.map((k, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-800 text-purple-300 rounded font-mono text-[10px]">
                        #{k}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: LOSS & ANOMALY SENTINEL */}
      {activeTab === 'sentinel' && (
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-white">Live Store Telemetry & Loss Prevention Sentinel</div>
              <div className="text-xs text-slate-400">Autonomous watchdog monitoring cash overrides, cashier discounts, and stock variances.</div>
            </div>
            <span className="px-3 py-1 bg-emerald-950 text-emerald-300 rounded-lg text-xs font-mono font-bold border border-emerald-800">
              🟢 Sentinel Stream Live
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {anomalies.map(a => (
              <div
                key={a.id}
                className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                  a.resolved
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                    : a.severity === 'high'
                      ? 'bg-rose-950/30 border-rose-800 text-rose-100'
                      : a.severity === 'medium'
                        ? 'bg-amber-950/30 border-amber-800 text-amber-100'
                        : 'bg-blue-950/30 border-blue-800 text-blue-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${
                    a.severity === 'high' ? 'text-rose-400' : a.severity === 'medium' ? 'text-amber-400' : 'text-blue-400'
                  }`} />
                  <div>
                    <div className="font-bold text-white text-xs flex items-center gap-2">
                      {a.title}
                      <span className="text-[10px] font-mono opacity-60">· {a.timestamp}</span>
                    </div>
                    <div className="text-xs text-slate-300 mt-1">{a.description}</div>
                    <div className="text-[11px] text-slate-400 mt-2 font-mono">
                      Action: <strong className="text-slate-200">{a.actionRequired}</strong>
                    </div>
                  </div>
                </div>

                {!a.resolved && (
                  <button
                    onClick={() => resolveAnomaly(a.id)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold shrink-0"
                  >
                    Resolve Alert
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
