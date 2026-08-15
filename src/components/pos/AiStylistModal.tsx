import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, Customer } from '../../types';
import { 
  Sparkles, X, Check, ArrowRight, Share2, Send, 
  ShoppingBag, Scissors, Tag, Star, Award, Heart
} from 'lucide-react';
import { sounds } from '../../utils/audio';

export const AiStylistModal: React.FC<{
  customer: Customer | null;
  onClose: () => void;
  onAddEnsembleToCart: (items: Product[]) => void;
}> = ({ customer, onClose, onAddEnsembleToCart }) => {
  const { products, showToast } = useApp();

  const [occasion, setOccasion] = useState<'Wedding' | 'Reception' | 'Sangeet' | 'Business'>('Wedding');
  const [selectedColorTheme, setSelectedColorTheme] = useState('Royal Navy & Gold');
  const [isGenerating, setIsGenerating] = useState(false);
  const [sentWhatsapp, setSentWhatsapp] = useState(false);

  // Curated matching products based on occasion
  const ensembleMain = products.find(p => p.category === 'Mens Ethnic' && p.mrp > 3000) || products[0];
  const ensembleShirt = products.find(p => p.category === 'Mens Casual' || p.name.includes('Shirt')) || products[1];
  const ensembleFabric = products.find(p => p.category === 'Fabrics') || products[2];

  const bundleItems = [ensembleMain, ensembleShirt, ensembleFabric].filter(Boolean);
  const bundleTotalMrp = bundleItems.reduce((acc, i) => acc + i.mrp, 0);
  const bundleDiscountedPrice = Math.round(bundleItems.reduce((acc, i) => acc + i.salePrice, 0) * 0.85); // 15% VIP Lookbook perk
  const savings = bundleTotalMrp - bundleDiscountedPrice;

  const handleApplyToCart = () => {
    onAddEnsembleToCart(bundleItems);
    sounds.playCheckoutSuccess();
    showToast('Lookbook Ensemble Added', `Added 3 coordinated pieces to cart with ₹${savings} bundle savings!`, 'success');
    onClose();
  };

  const handleSendWhatsapp = () => {
    setSentWhatsapp(true);
    sounds.playTapClick();
    showToast('Lookbook Dispatched', `Curated outfit memo and sizing notes sent to WhatsApp (${customer?.phone || 'Customer'})`, 'success');
    setTimeout(() => setSentWhatsapp(false), 3000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-slate-900 border border-purple-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border-b border-purple-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/30 text-purple-300 border border-purple-400/40 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="w-5 h-5 text-purple-300 animate-pulse" />
            </div>
            <div>
              <div className="text-base font-extrabold text-white flex items-center gap-2">
                AI Wardrobe Stylist & Ensemble Builder
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  GPT-4 Retail Vision
                </span>
              </div>
              <div className="text-xs text-purple-200/70">
                {customer ? `Styling for ${customer.name} · ${customer.tier}` : 'General Haute Couture Recommendation'}
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

        {/* Occasion & Mood Selector */}
        <div className="p-4 bg-slate-950/60 border-b border-white/[0.06] flex items-center justify-between gap-3 overflow-x-auto">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Occasion:</span>
            {(['Wedding', 'Reception', 'Sangeet', 'Business'] as const).map((occ) => (
              <button
                key={occ}
                onClick={() => {
                  setOccasion(occ);
                  sounds.playTapClick();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all tactile-btn ${
                  occasion === occ
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-white/[0.06]'
                }`}
              >
                {occ}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Palette:</span>
            <span className="text-xs font-mono text-purple-300 bg-purple-950/60 px-2.5 py-1 rounded-xl border border-purple-800/40 font-bold">
              {selectedColorTheme}
            </span>
          </div>
        </div>

        {/* Coordinated Ensemble Grid */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="text-xs font-extrabold text-slate-300 uppercase tracking-widest flex items-center justify-between">
            <span>AI Suggested 3-Piece Lookbook Ensemble</span>
            <span className="text-emerald-400 font-mono font-bold">15% VIP Combo Discount Active</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {bundleItems.map((item, idx) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-950/80 border border-white/[0.08] flex flex-col justify-between space-y-3 shadow-md group hover:border-purple-500/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                      {idx === 0 ? 'Primary Suit' : idx === 1 ? 'Inner / Trouser' : 'Silk Coordinate'}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">{item.size}</span>
                  </div>

                  <div className="font-bold text-white text-xs line-clamp-2">{item.name}</div>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">{item.color} · {item.fabric}</div>
                </div>

                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                  <div className="text-xs font-bold text-emerald-400 font-mono">
                    ₹{item.salePrice.toLocaleString('en-IN')}
                  </div>
                  <Check className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            ))}
          </div>

          {/* Stylist Notes Card */}
          <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-800/40 text-xs space-y-2">
            <div className="font-bold text-purple-200 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              Senior Stylist Art Direction Notes:
            </div>
            <p className="text-purple-300/80 leading-relaxed">
              "Pair this Royal Navy textured suit with the contrast Brocade Silk coordinate. 
              The tailored clean-front silhouette matches customer's body profile. Recommend 
              a 0.5-inch taper at the waist for an ultra-sharp bespoke drape."
            </p>
          </div>
        </div>

        {/* Modal Footer: Total & Actions */}
        <div className="p-4 bg-slate-950 border-t border-white/[0.08] flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Complete Look Total:</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-400 font-mono">
                ₹{bundleDiscountedPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-500 line-through font-mono">
                ₹{bundleTotalMrp.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] font-bold text-emerald-400 font-mono">
                (Save ₹{savings.toLocaleString('en-IN')})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleSendWhatsapp}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-white/[0.08] text-xs font-bold flex items-center gap-2 transition-all tactile-btn"
            >
              <Send className="w-3.5 h-3.5 text-emerald-400" />
              <span>{sentWhatsapp ? 'Sent to WhatsApp!' : 'Send WhatsApp Lookbook'}</span>
            </button>

            <button
              onClick={handleApplyToCart}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all tactile-btn"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add 3-Piece Look to Bill</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
