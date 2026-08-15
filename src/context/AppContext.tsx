import React, { createContext, useContext, useState, useEffect } from 'react';
import { StoreId, Store, Product, Customer, CartItem, SaleInvoice, StockTransferNote, VendorBillAI, JournalVoucher, AnomalyAlert, SchemeRule, AlterationSlip } from '../types';
import { 
  INITIAL_STORES, INITIAL_PRODUCTS, INITIAL_CUSTOMERS, INITIAL_INVOICES, 
  INITIAL_VENDOR_BILLS_AI, INITIAL_TRANSFERS, INITIAL_ALTERATIONS, 
  INITIAL_ANOMALIES, INITIAL_SCHEMES, INITIAL_JOURNAL_VOUCHERS 
} from '../data/mockData';

export type NavTab = 'pos' | 'inventory' | 'transfers' | 'purchases' | 'approvals' | 'aistudio' | 'reports' | 'accounts' | 'crm' | 'schemes' | 'settings';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface AppContextType {
  currentStoreId: StoreId;
  setCurrentStoreId: (id: StoreId) => void;
  currentStore: Store;
  stores: Store[];
  
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;

  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  updateProduct: (p: Product) => void;
  
  customers: Customer[];
  selectedCustomer: Customer | null;
  setSelectedCustomer: (c: Customer | null) => void;
  
  cartItems: CartItem[];
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, qty: number) => void;
  updateCartDiscount: (productId: string, percent?: number, amount?: number) => void;
  clearCart: () => void;
  appliedScheme: SchemeRule | null;
  setAppliedScheme: (s: SchemeRule | null) => void;

  invoices: SaleInvoice[];
  completeSale: (saleData: Omit<SaleInvoice, 'id'>) => SaleInvoice;
  
  transfers: StockTransferNote[];
  createTransfer: (transfer: Omit<StockTransferNote, 'id' | 'stnNo'>) => void;
  updateTransferStatus: (id: string, status: StockTransferNote['status']) => void;

  aiBills: VendorBillAI[];
  addAiBill: (bill: VendorBillAI) => void;
  approveAiBill: (billId: string) => void;

  alterations: AlterationSlip[];
  addAlteration: (alt: Omit<AlterationSlip, 'id' | 'slipNo'>) => void;
  updateAlterationStatus: (id: string, status: AlterationSlip['status']) => void;

  journalVouchers: JournalVoucher[];
  addJournalVoucher: (jv: Omit<JournalVoucher, 'id' | 'jvNo'>) => void;

  anomalies: AnomalyAlert[];
  resolveAnomaly: (id: string) => void;

  schemes: SchemeRule[];
  addScheme: (s: SchemeRule) => void;

  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;

  aiCopilotOpen: boolean;
  setAiCopilotOpen: (open: boolean) => void;

  toasts: ToastMessage[];
  showToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  cashInDrawer: number;
  setCashInDrawer: React.Dispatch<React.SetStateAction<number>>;
  cashierName: string;

  isStandalonePosMode: boolean;
  setIsStandalonePosMode: (enabled: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStoreId, setCurrentStoreId] = useState<StoreId>('zirakpur_hq');
  const [activeTab, setActiveTab] = useState<NavTab>('pos');
  const [isStandalonePosMode, setIsStandalonePosMode] = useState<boolean>(false);
  
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('emerges_v3_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('emerges_v3_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [appliedScheme, setAppliedScheme] = useState<SchemeRule | null>(null);

  const [invoices, setInvoices] = useState<SaleInvoice[]>(() => {
    const saved = localStorage.getItem('emerges_v3_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [transfers, setTransfers] = useState<StockTransferNote[]>(() => {
    const saved = localStorage.getItem('emerges_v3_transfers');
    return saved ? JSON.parse(saved) : INITIAL_TRANSFERS;
  });

  const [aiBills, setAiBills] = useState<VendorBillAI[]>(() => {
    const saved = localStorage.getItem('emerges_v3_ai_bills');
    return saved ? JSON.parse(saved) : INITIAL_VENDOR_BILLS_AI;
  });

  const [alterations, setAlterations] = useState<AlterationSlip[]>(() => {
    const saved = localStorage.getItem('emerges_v3_alterations');
    return saved ? JSON.parse(saved) : INITIAL_ALTERATIONS;
  });

  const [journalVouchers, setJournalVouchers] = useState<JournalVoucher[]>(() => {
    const saved = localStorage.getItem('emerges_v3_jvs');
    return saved ? JSON.parse(saved) : INITIAL_JOURNAL_VOUCHERS;
  });

  const [anomalies, setAnomalies] = useState<AnomalyAlert[]>(INITIAL_ANOMALIES);
  const [schemes, setSchemes] = useState<SchemeRule[]>(INITIAL_SCHEMES);

  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [aiCopilotOpen, setAiCopilotOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  const [cashInDrawer, setCashInDrawer] = useState(15420);
  const cashierName = 'Amanpreet K. (Senior Cashier)';

  // Persist key states
  useEffect(() => { localStorage.setItem('emerges_v3_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('emerges_v3_customers', JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem('emerges_v3_invoices', JSON.stringify(invoices)); }, [invoices]);
  useEffect(() => { localStorage.setItem('emerges_v3_transfers', JSON.stringify(transfers)); }, [transfers]);
  useEffect(() => { localStorage.setItem('emerges_v3_ai_bills', JSON.stringify(aiBills)); }, [aiBills]);
  useEffect(() => { localStorage.setItem('emerges_v3_alterations', JSON.stringify(alterations)); }, [alterations]);

  const currentStore = INITIAL_STORES.find(s => s.id === currentStoreId) || INITIAL_STORES[0];

  const showToast = (title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addToCart = (product: Product, qty: number = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
    showToast('Added to Cart', `${product.name} (${product.size})`, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item => (item.product.id === productId ? { ...item, quantity: qty } : item))
    );
  };

  const updateCartDiscount = (productId: string, percent?: number, amount?: number) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          return {
            ...item,
            customDiscountPercent: percent !== undefined ? percent : item.customDiscountPercent,
            customDiscountAmount: amount !== undefined ? amount : item.customDiscountAmount,
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setSelectedCustomer(null);
    setAppliedScheme(null);
  };

  const updateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    showToast('Product Updated', updated.name, 'success');
  };

  const completeSale = (saleData: Omit<SaleInvoice, 'id'>): SaleInvoice => {
    const newInvoice: SaleInvoice = {
      ...saleData,
      id: 'inv-' + Date.now()
    };

    setInvoices(prev => [newInvoice, ...prev]);

    // Deduct stock from current store
    setProducts(prev => prev.map(p => {
      const soldItem = saleData.items.find(i => i.sku === p.sku);
      if (soldItem) {
        const currentQty = p.stockByStore[saleData.storeId] || 0;
        return {
          ...p,
          stockByStore: {
            ...p.stockByStore,
            [saleData.storeId]: Math.max(0, currentQty - soldItem.qty)
          }
        };
      }
      return p;
    }));

    // Update cash in drawer if cash tender received
    if (saleData.tenders.cash > 0) {
      setCashInDrawer(prev => prev + saleData.tenders.cash);
    }

    // Award loyalty points to customer (1 point per ₹100 spend)
    if (saleData.customer) {
      const awardedPoints = Math.floor(saleData.netPayable / 100);
      setCustomers(prev => prev.map(c => {
        if (c.id === saleData.customer?.id) {
          return {
            ...c,
            loyaltyPoints: Math.max(0, c.loyaltyPoints - saleData.tenders.loyaltyRedemption + awardedPoints),
            totalPurchases: c.totalPurchases + saleData.netPayable,
            lastVisit: new Date().toISOString().split('T')[0]
          };
        }
        return c;
      }));
    }

    clearCart();
    return newInvoice;
  };

  const createTransfer = (transferData: Omit<StockTransferNote, 'id' | 'stnNo'>) => {
    const num = Math.floor(1000 + Math.random() * 9000);
    const newSTN: StockTransferNote = {
      ...transferData,
      id: 'stn-' + Date.now(),
      stnNo: `STN/26-27/${num}`
    };

    setTransfers(prev => [newSTN, ...prev]);

    // If dispatched, deduct from source store
    if (newSTN.status === 'Dispatched' || newSTN.status === 'In-Transit') {
      setProducts(prev => prev.map(p => {
        const trItem = newSTN.items.find(i => i.productId === p.id);
        if (trItem) {
          const srcQty = p.stockByStore[newSTN.fromStoreId] || 0;
          return {
            ...p,
            stockByStore: {
              ...p.stockByStore,
              [newSTN.fromStoreId]: Math.max(0, srcQty - trItem.qty)
            }
          };
        }
        return p;
      }));
    }

    showToast('STN Generated', `${newSTN.stnNo} dispatched to ${newSTN.toStoreId}`, 'success');
  };

  const updateTransferStatus = (id: string, status: StockTransferNote['status']) => {
    setTransfers(prev => prev.map(t => {
      if (t.id === id) {
        // If receiving, add stock to destination store
        if (status === 'Received' && t.status !== 'Received') {
          setProducts(currProducts => currProducts.map(p => {
            const trItem = t.items.find(i => i.productId === p.id);
            if (trItem) {
              const destQty = p.stockByStore[t.toStoreId] || 0;
              return {
                ...p,
                stockByStore: {
                  ...p.stockByStore,
                  [t.toStoreId]: destQty + trItem.qty
                }
              };
            }
            return p;
          }));
        }
        return { ...t, status };
      }
      return t;
    }));
    showToast('Transfer Status Updated', `Status changed to ${status}`, 'info');
  };

  const addAiBill = (bill: VendorBillAI) => {
    setAiBills(prev => [bill, ...prev]);
    showToast('Vendor Bill Ingested', `AI parsed invoice ${bill.invoiceNo}`, 'success');
  };

  const approveAiBill = (billId: string) => {
    const bill = aiBills.find(b => b.id === billId);
    if (!bill) return;

    setAiBills(prev => prev.map(b => b.id === billId ? { ...b, status: 'Approved' } : b));

    // Create a Journal Voucher for vendor credit
    const newJv: JournalVoucher = {
      id: 'jv-' + Date.now(),
      jvNo: `PUR/${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      type: 'Journal',
      debitAccount: 'Purchase Inward - Fabrics & Apparel A/c',
      creditAccount: `${bill.vendorName} (Vendor Ledger)`,
      amount: bill.grandTotal,
      narration: `Automated AI Inward bill booking for Invoice #${bill.invoiceNo}`,
      storeId: 'zirakpur_godown',
      auditUser: 'Emerges AI Inward Agent'
    };

    setJournalVouchers(prev => [newJv, ...prev]);
    showToast('Inward Approved & Booked', `₹${bill.grandTotal.toLocaleString('en-IN')} added to Purchase Inward`, 'success');
  };

  const addAlteration = (alt: Omit<AlterationSlip, 'id' | 'slipNo'>) => {
    const slipNo = `ALT/${currentStore.city.slice(0, 3).toUpperCase()}/2026/${Math.floor(100 + Math.random() * 900)}`;
    const newSlip: AlterationSlip = {
      ...alt,
      id: 'alt-' + Date.now(),
      slipNo
    };
    setAlterations(prev => [newSlip, ...prev]);
    showToast('Alteration Slip Created', slipNo, 'success');
  };

  const updateAlterationStatus = (id: string, status: AlterationSlip['status']) => {
    setAlterations(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    showToast('Alteration Updated', `Status: ${status}`, 'info');
  };

  const addJournalVoucher = (jv: Omit<JournalVoucher, 'id' | 'jvNo'>) => {
    const jvNo = `JV/26-27/${Math.floor(100 + Math.random() * 900)}`;
    const newJv: JournalVoucher = {
      ...jv,
      id: 'jv-' + Date.now(),
      jvNo
    };
    setJournalVouchers(prev => [newJv, ...prev]);
    showToast('Journal Voucher Posted', jvNo, 'success');
  };

  const resolveAnomaly = (id: string) => {
    setAnomalies(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
    showToast('Anomaly Resolved', 'Flagged issue closed by admin', 'info');
  };

  const addScheme = (s: SchemeRule) => {
    setSchemes(prev => [...prev, s]);
    showToast('Scheme Activated', s.name, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentStoreId,
        setCurrentStoreId,
        currentStore,
        stores: INITIAL_STORES,
        activeTab,
        setActiveTab,
        products,
        setProducts,
        updateProduct,
        customers,
        selectedCustomer,
        setSelectedCustomer,
        cartItems,
        addToCart,
        removeFromCart,
        updateCartQty,
        updateCartDiscount,
        clearCart,
        appliedScheme,
        setAppliedScheme,
        invoices,
        completeSale,
        transfers,
        createTransfer,
        updateTransferStatus,
        aiBills,
        addAiBill,
        approveAiBill,
        alterations,
        addAlteration,
        updateAlterationStatus,
        journalVouchers,
        addJournalVoucher,
        anomalies,
        resolveAnomaly,
        schemes,
        addScheme,
        commandPaletteOpen,
        setCommandPaletteOpen,
        aiCopilotOpen,
        setAiCopilotOpen,
        toasts,
        showToast,
        removeToast,
        cashInDrawer,
        setCashInDrawer,
        cashierName,
        isStandalonePosMode,
        setIsStandalonePosMode
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
