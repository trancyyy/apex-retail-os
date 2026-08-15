export type StoreId = 'zirakpur_hq' | 'dalhousie_store' | 'mcleodganj_store' | 'mussoorie_store' | 'zirakpur_godown';

export interface Store {
  id: StoreId;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  gstin: string;
  phone: string;
  isHQ?: boolean;
}

export type ApparelCategory = 'Mens Ethnic' | 'Mens Casual' | 'Womens Ethnic' | 'Womens Western' | 'Fabrics' | 'Accessories';

export interface Product {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  category: ApparelCategory;
  subCategory: string;
  brand: string;
  style: string;
  color: string;
  size: string;
  fabric: string;
  mrp: number;
  costPrice: number;
  salePrice: number;
  gstPercent: number;
  hsnCode: string;
  stockByStore: Record<StoreId, number>;
  boxNumber?: string;
  lotNumber?: string;
  imageUrl?: string;
  isMetered?: boolean;
  active: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  meterLength?: number;
  customDiscountPercent?: number;
  customDiscountAmount?: number;
  alterationRequired?: boolean;
  notes?: string;
}

export interface TenderSplit {
  cash: number;
  creditCard: number;
  upi: number;
  loyaltyRedemption: number;
  creditNote: number;
  advanceAdjustment: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  tier: 'Silver' | 'Gold' | 'Platinum VIP';
  loyaltyPoints: number;
  outstandingBalance: number;
  creditLimit: number;
  totalPurchases: number;
  anniversaryDate?: string;
  birthDate?: string;
  lastVisit?: string;
}

export interface SaleInvoice {
  id: string;
  invoiceNo: string;
  date: string;
  time: string;
  storeId: StoreId;
  cashierName: string;
  customer?: Customer;
  items: {
    sku: string;
    name: string;
    size: string;
    color: string;
    qty: number;
    meterLength?: number;
    mrp: number;
    price: number;
    discount: number;
    taxableAmt: number;
    cgst: number;
    sgst: number;
    total: number;
  }[];
  grossAmount: number;
  itemDiscountTotal: number;
  billDiscountAmount: number;
  taxableTotal: number;
  cgstTotal: number;
  sgstTotal: number;
  roundOff: number;
  netPayable: number;
  tenders: TenderSplit;
  alterationIds?: string[];
  advanceBookingId?: string;
  status: 'Completed' | 'Refunded' | 'Cancelled';
}

export interface AdvanceBooking {
  id: string;
  bookingNo: string;
  date: string;
  expectedDeliveryDate: string;
  trialDate?: string;
  customerName: string;
  customerPhone: string;
  storeId: StoreId;
  productName: string;
  measurementNotes: string;
  totalOrderValue: number;
  advanceDeposited: number;
  balanceRemaining: number;
  tenderType: 'Cash' | 'UPI' | 'Card';
  status: 'Booked' | 'In Production' | 'Trial Ready' | 'Settled & Delivered' | 'Cancelled';
}

export interface BundlePackage {
  id: string;
  code: string;
  title: string;
  category: 'Wedding Ensemble' | 'Institutional Uniform' | 'Festive Set';
  itemsIncluded: string[];
  packagePrice: number;
  individualTotal: number;
  savings: number;
  active: boolean;
}

export interface ApprovalVoucher {
  id: string;
  approvalNo: string;
  date: string;
  dueDate: string;
  customerName: string;
  customerPhone: string;
  storeId: StoreId;
  items: {
    productId: string;
    sku: string;
    name: string;
    size: string;
    color: string;
    mrp: number;
    issuedQty: number;
    returnedQty: number;
    keptQty: number;
  }[];
  totalValue: number;
  depositAmount: number;
  status: 'Issued' | 'Partial Return' | 'Converted to Sale' | 'Returned' | 'Overdue';
  notes?: string;
}

export interface PurchaseOrder {
  id: string;
  poNo: string;
  date: string;
  expectedDate: string;
  vendorName: string;
  vendorGstin: string;
  storeId: StoreId;
  items: {
    description: string;
    hsn: string;
    fabric: string;
    size: string;
    quantity: number;
    rate: number;
    total: number;
  }[];
  totalAmount: number;
  status: 'Draft' | 'Sent to Vendor' | 'Partially Received' | 'Completed' | 'Cancelled';
}

export interface AlterationSlip {
  id: string;
  slipNo: string;
  invoiceNo: string;
  customerName: string;
  customerPhone: string;
  productName: string;
  instructions: {
    lengthAdjustment?: string;
    waistAdjustment?: string;
    chestAdjustment?: string;
    sleeveAdjustment?: string;
    specialNotes?: string;
  };
  tailorName: string;
  trialDate: string;
  deliveryDate: string;
  status: 'Received' | 'In Progress' | 'Ready for Trial' | 'Delivered';
  charge: number;
}

export interface StockTransferNote {
  id: string;
  stnNo: string;
  date: string;
  fromStoreId: StoreId;
  toStoreId: StoreId;
  items: {
    productId: string;
    sku: string;
    name: string;
    size: string;
    color: string;
    qty: number;
    lotNo: string;
  }[];
  totalQty: number;
  vehicleNo: string;
  ewayBillNo?: string;
  status: 'Draft' | 'Dispatched' | 'In-Transit' | 'Received' | 'Discrepancy';
  dispatchedBy: string;
  receivedBy?: string;
  notes?: string;
}

export interface VendorBillAI {
  id: string;
  vendorName: string;
  vendorGstin: string;
  invoiceNo: string;
  invoiceDate: string;
  items: {
    description: string;
    hsn: string;
    fabric: string;
    size: string;
    quantity: number;
    rate: number;
    taxableValue: number;
    gstRate: number;
    total: number;
  }[];
  subTotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  grandTotal: number;
  confidenceScore: number;
  status: 'Pending Review' | 'Approved' | 'Rejected';
  originalFileName?: string;
}

export interface JournalVoucher {
  id: string;
  jvNo: string;
  date: string;
  type: 'Payment' | 'Receipt' | 'Journal' | 'Contra';
  debitAccount: string;
  creditAccount: string;
  amount: number;
  narration: string;
  storeId: StoreId;
  auditUser: string;
}

export interface AnomalyAlert {
  id: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  timestamp: string;
  storeId: StoreId;
  actionRequired: string;
  resolved: boolean;
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  chartData?: any;
  actionPrompt?: string;
}

export interface SchemeRule {
  id: string;
  code: string;
  name: string;
  type: 'SLAB' | 'BOGO' | 'FLAT_OFF' | 'BRAND_DISCOUNT';
  minBillValue?: number;
  minQty?: number;
  discountPercent?: number;
  discountAmount?: number;
  validCategory?: ApparelCategory;
  active: boolean;
  expiresOn: string;
}
