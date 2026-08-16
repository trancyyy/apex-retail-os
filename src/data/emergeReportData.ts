// Exact structured dataset derived from Emerge Report from data.pdf

export interface TransferPlanItem {
  id: string;
  sku: string;
  subGroup: string;
  fromStore: string;
  toStore: string;
  qty: number;
  value: number;
  why: string;
  executed?: boolean;
}

export interface DeadStockItem {
  sku: string;
  subGroup: string;
  category: string;
  stock: number;
  deadValue: number;
  stores: string;
}

export interface BestSellerItem {
  sku: string;
  subGroup: string;
  unitsSold: number;
  revenue: number;
  sellThrough: string;
}

export interface CategoryMetric {
  category: string;
  available: number;
  sold: number;
  closing: number;
  closingValue: number;
  sellThrough: string;
}

export const HERO_METRICS = {
  moveNowValue: 771000,
  moveNowItems: 35,
  moveNowUnits: 164,
  deadStockValue: 9190000,
  deadStockCodes: 672,
  deadStockPercent: '28.4%',
  sellThroughRate: '23.6%',
  stockCoverMonths: '8.4 Months',
  closingInventoryValue: 32300000,
  closingInventoryUnits: 12508,
  period: '1 Mar – 30 Apr 2026',
  stores: ['McLeodganj', 'Dalhousie', 'Mussoorie']
};

export const TRANSFER_FLOW_SUMMARY = [
  { flow: 'Dalhousie ➔ Mussoorie', items: 5, value: 225000 },
  { flow: 'Mussoorie ➔ McLeodganj', items: 10, value: 225000 },
  { flow: 'Dalhousie ➔ McLeodganj', items: 5, value: 196000 },
  { flow: 'Mussoorie ➔ Dalhousie', items: 7, value: 63000 },
  { flow: 'McLeodganj ➔ Dalhousie', items: 6, value: 49000 },
  { flow: 'McLeodganj ➔ Mussoorie', items: 2, value: 14000 }
];

export const INITIAL_35_TRANSFERS: TransferPlanItem[] = [
  { id: 'tr-1', sku: 'CHIJKT1711258G', subGroup: 'Jacket', fromStore: 'Dalhousie', toStore: 'Mussoorie', qty: 7, value: 62993, why: '0/1 sold, 7 left ➔ 100% ST' },
  { id: 'tr-2', sku: 'CHIJKT1711258G', subGroup: 'Jacket', fromStore: 'Dalhousie', toStore: 'McLeodganj', qty: 7, value: 62993, why: '0/1 sold, 7 left ➔ 100% ST' },
  { id: 'tr-3', sku: 'CHIJKT1509256Q', subGroup: 'Jacket', fromStore: 'Dalhousie', toStore: 'Mussoorie', qty: 9, value: 62991, why: '0 sold, 9 left ➔ 100% ST' },
  { id: 'tr-4', sku: 'CHIJKT20112512H', subGroup: 'Jacket', fromStore: 'Dalhousie', toStore: 'McLeodganj', qty: 5, value: 49995, why: '0 sold, 7 left ➔ 100% ST' },
  { id: 'tr-5', sku: 'CHIJKT20112512H', subGroup: 'Jacket', fromStore: 'Dalhousie', toStore: 'Mussoorie', qty: 5, value: 49995, why: '0 sold, 7 left ➔ 100% ST' },
  { id: 'tr-6', sku: 'CHIJKT1509256Q', subGroup: 'Jacket', fromStore: 'Dalhousie', toStore: 'McLeodganj', qty: 7, value: 48993, why: '0 sold, 9 left ➔ 100% ST' },
  { id: 'tr-7', sku: 'CHIDRS0910259K', subGroup: 'Dress', fromStore: 'Mussoorie', toStore: 'McLeodganj', qty: 11, value: 43989, why: '0 sold, 15 left ➔ 100% ST' },
  { id: 'tr-8', sku: 'CHIJKT2709256H', subGroup: 'Jacket', fromStore: 'Dalhousie', toStore: 'Mussoorie', qty: 5, value: 34995, why: '1/12 sold ➔ 100% ST' },
  { id: 'tr-9', sku: 'CHICDST21022610U', subGroup: 'Cord Set', fromStore: 'Mussoorie', toStore: 'McLeodganj', qty: 5, value: 27995, why: '0/9 sold ➔ 78% ST' },
  { id: 'tr-10', sku: 'CHIPNT0611257B', subGroup: 'Pants', fromStore: 'Mussoorie', toStore: 'McLeodganj', qty: 10, value: 25990, why: '0/10 sold ➔ 100% ST' },
  { id: 'tr-11', sku: 'CHIPNT0611258B', subGroup: 'Pants', fromStore: 'Mussoorie', toStore: 'McLeodganj', qty: 9, value: 23391, why: '0/9 sold ➔ 100% ST' },
  { id: 'tr-12', sku: 'CHISRT3006256O', subGroup: 'Shirt', fromStore: 'Mussoorie', toStore: 'McLeodganj', qty: 5, value: 21495, why: '0/21 sold ➔ 73% ST' },
  { id: 'tr-13', sku: 'CHICDST2903252W', subGroup: 'Cord Set', fromStore: 'Dalhousie', toStore: 'McLeodganj', qty: 4, value: 19996, why: '1/14 sold ➔ 75% ST' },
  { id: 'tr-14', sku: 'CHISWST2609256F', subGroup: 'Sweatshirt', fromStore: 'Mussoorie', toStore: 'McLeodganj', qty: 4, value: 19996, why: '0/9 sold ➔ 83% ST' },
  { id: 'tr-15', sku: 'CHIPOLO0907256Q', subGroup: 'Polo', fromStore: 'Mussoorie', toStore: 'Dalhousie', qty: 8, value: 19992, why: '1/15 sold ➔ 83% ST' },
  { id: 'tr-16', sku: 'CHISWST1209256N', subGroup: 'Sweatshirt', fromStore: 'Mussoorie', toStore: 'McLeodganj', qty: 5, value: 18995, why: '0/11 sold ➔ 100% ST' },
  { id: 'tr-17', sku: 'CHIJNS1802252B', subGroup: 'Jeans', fromStore: 'Mussoorie', toStore: 'McLeodganj', qty: 3, value: 17997, why: '1/8 sold ➔ 71% ST' },
  { id: 'tr-18', sku: 'CHISRT3006255O', subGroup: 'Shirt', fromStore: 'Mussoorie', toStore: 'McLeodganj', qty: 5, value: 17495, why: '1/9 sold ➔ 86% ST' },
  { id: 'tr-19', sku: 'CHITS1406254D', subGroup: 'Tees', fromStore: 'McLeodganj', toStore: 'Dalhousie', qty: 6, value: 16194, why: '1/8 sold ➔ 88% ST' },
  { id: 'tr-20', sku: 'CHIJKT1509257Q', subGroup: 'Jacket', fromStore: 'Dalhousie', toStore: 'McLeodganj', qty: 2, value: 13998, why: '1/2 sold ➔ 100% ST' },
  { id: 'tr-21', sku: 'CHIJKT1509257Q', subGroup: 'Jacket', fromStore: 'Dalhousie', toStore: 'Mussoorie', qty: 2, value: 13998, why: '1/2 sold ➔ 100% ST' },
  { id: 'tr-22', sku: 'CHITP1110256M', subGroup: 'Top', fromStore: 'Mussoorie', toStore: 'Dalhousie', qty: 3, value: 11997, why: '1/3 sold ➔ 71% ST' },
  { id: 'tr-23', sku: 'CHIJKT18092510W', subGroup: 'Jacket', fromStore: 'Mussoorie', toStore: 'Dalhousie', qty: 3, value: 11097, why: '1/6 sold ➔ 67% ST' },
  { id: 'tr-24', sku: 'CHISRT3006255O', subGroup: 'Shirt', fromStore: 'Mussoorie', toStore: 'Dalhousie', qty: 3, value: 10497, why: '1/9 sold ➔ 71% ST' },
  { id: 'tr-25', sku: 'CHIPNT11102510N', subGroup: 'Pants', fromStore: 'McLeodganj', toStore: 'Mussoorie', qty: 3, value: 9897, why: '1/6 sold ➔ 71% ST' },
  { id: 'tr-26', sku: 'CHIPOLO2306255K', subGroup: 'Polo', fromStore: 'McLeodganj', toStore: 'Dalhousie', qty: 3, value: 8397, why: '0/20 sold ➔ 71% ST' },
  { id: 'tr-27', sku: 'CHITUMB0411257Z', subGroup: 'Utility', fromStore: 'Mussoorie', toStore: 'McLeodganj', qty: 3, value: 7497, why: '0/7 sold ➔ 63% ST' },
  { id: 'tr-28', sku: 'CHIPNT28072511V', subGroup: 'Pants', fromStore: 'McLeodganj', toStore: 'Dalhousie', qty: 2, value: 6998, why: '0/2 sold ➔ 100% ST' },
  { id: 'tr-29', sku: 'CHITGT1710242M', subGroup: 'Tights', fromStore: 'McLeodganj', toStore: 'Dalhousie', qty: 3, value: 6897, why: '0/3 sold ➔ 100% ST' },
  { id: 'tr-30', sku: 'CHITS0706254R', subGroup: 'Tees', fromStore: 'McLeodganj', toStore: 'Dalhousie', qty: 2, value: 5398, why: '0/2 sold ➔ 86% ST' },
  { id: 'tr-31', sku: 'CHISWPC27082510K', subGroup: 'Showpiece', fromStore: 'McLeodganj', toStore: 'Dalhousie', qty: 3, value: 4797, why: '1/3 sold ➔ 86% ST' },
  { id: 'tr-32', sku: 'CHILWR1410242J', subGroup: 'Lower', fromStore: 'Mussoorie', toStore: 'Dalhousie', qty: 2, value: 4398, why: '1/2 sold ➔ 75% ST' },
  { id: 'tr-33', sku: 'CHISDSP12122510M', subGroup: 'Moving Sandscape', fromStore: 'Mussoorie', toStore: 'Dalhousie', qty: 4, value: 3996, why: '0/4 sold ➔ 80% ST' },
  { id: 'tr-34', sku: 'CHIINR1910241N', subGroup: 'Inner', fromStore: 'McLeodganj', toStore: 'Mussoorie', qty: 3, value: 3897, why: '1/3 sold ➔ 93% ST' },
  { id: 'tr-35', sku: 'CHIGLS652314', subGroup: 'Short Glass', fromStore: 'Mussoorie', toStore: 'Dalhousie', qty: 3, value: 1197, why: '0/3 sold ➔ 100% ST' }
];

export const TOP_DEAD_STOCK: DeadStockItem[] = [
  { sku: 'CHIDRS0604269X', subGroup: 'Dress', category: 'Apparels', stock: 56, deadValue: 258000, stores: 'McLeodganj (29u), Mussoorie (27u)' },
  { sku: 'CHICDST20042612K', subGroup: 'Cord Set', category: 'Apparels', stock: 30, deadValue: 240000, stores: 'McLeodganj (14u), Mussoorie (16u)' },
  { sku: 'CHITS18042612H', subGroup: 'Tees', category: 'Apparels', stock: 42, deadValue: 210000, stores: 'Mussoorie (24u), Dalhousie (18u)' },
  { sku: 'CHITP0404268U', subGroup: 'Top', category: 'Apparels', stock: 61, deadValue: 201000, stores: 'McLeodganj (31u), Mussoorie (30u)' },
  { sku: 'CHIDRS03042610T', subGroup: 'Dress', category: 'Apparels', stock: 31, deadValue: 186000, stores: 'McLeodganj, Mussoorie' },
  { sku: 'CHIDRS0304269T', subGroup: 'Dress', category: 'Apparels', stock: 37, deadValue: 185000, stores: 'McLeodganj, Mussoorie' },
  { sku: 'CHIDRS0404269V', subGroup: 'Dress', category: 'Apparels', stock: 39, deadValue: 175000, stores: 'Network Wide' },
  { sku: 'CHIDRS0404268V', subGroup: 'Dress', category: 'Apparels', stock: 36, deadValue: 162000, stores: 'Network Wide' },
  { sku: 'CHICDST06042613W', subGroup: 'Cord Set', category: 'Apparels', stock: 16, deadValue: 160000, stores: 'Network Wide' },
  { sku: 'CHICDST06042614W', subGroup: 'Cord Set', category: 'Apparels', stock: 20, deadValue: 160000, stores: 'Network Wide' },
  { sku: 'CHIDRS0304268T', subGroup: 'Dress', category: 'Apparels', stock: 36, deadValue: 151000, stores: 'Network Wide' },
  { sku: 'CHITS18042611H', subGroup: 'Tees', category: 'Apparels', stock: 29, deadValue: 145000, stores: 'Network Wide' },
  { sku: 'CHITS16042612F', subGroup: 'Tees', category: 'Apparels', stock: 36, deadValue: 144000, stores: 'Network Wide' },
  { sku: 'CHITS16042610F', subGroup: 'Tees', category: 'Apparels', stock: 36, deadValue: 144000, stores: 'Network Wide' }
];

export const TOP_BEST_SELLERS: BestSellerItem[] = [
  { sku: 'CHIJKT1711257G', subGroup: 'Jacket', unitsSold: 25, revenue: 250000, sellThrough: '80.6%' },
  { sku: 'CHIJKT0111256W', subGroup: 'Jacket', unitsSold: 45, revenue: 211000, sellThrough: '69.2%' },
  { sku: 'CHIJKT20112513H', subGroup: 'Jacket', unitsSold: 22, revenue: 198000, sellThrough: '91.7%' },
  { sku: 'CHIJKT1711258G', subGroup: 'Jacket', unitsSold: 20, revenue: 180000, sellThrough: '74.1%' },
  { sku: 'CHIJKT2510256V', subGroup: 'Jacket', unitsSold: 69, revenue: 179000, sellThrough: '62.2%' },
  { sku: 'CHIJKT2210256T', subGroup: 'Jacket', unitsSold: 17, revenue: 136000, sellThrough: '100%' },
  { sku: 'CHITPS3010241S', subGroup: '2 Pcs Set', unitsSold: 62, revenue: 124000, sellThrough: '46.6%' },
  { sku: 'CHILUGG0705252U', subGroup: 'Luggage', unitsSold: 19, revenue: 114000, sellThrough: '36.5%' },
  { sku: 'CHIJKT1509256Q', subGroup: 'Jacket', unitsSold: 16, revenue: 112000, sellThrough: '64.0%' },
  { sku: 'CHIJKT2709259H', subGroup: 'Jacket', unitsSold: 20, revenue: 110000, sellThrough: '87.0%' },
  { sku: 'CHIJKT1211258D', subGroup: 'Jacket', unitsSold: 12, revenue: 108000, sellThrough: '100%' },
  { sku: 'CHIJKT2709257H', subGroup: 'Jacket', unitsSold: 15, revenue: 105000, sellThrough: '68.2%' },
  { sku: 'CHIJKT20112512H', subGroup: 'Jacket', unitsSold: 10, revenue: 100000, sellThrough: '58.8%' },
  { sku: 'CHIJKT0111257W', subGroup: 'Jacket', unitsSold: 22, revenue: 99000, sellThrough: '73.3%' },
  { sku: 'CHIJKT1509257Q', subGroup: 'Jacket', unitsSold: 13, revenue: 91000, sellThrough: '86.7%' }
];

export const WINNING_STYLES = [
  { style: 'Puffer Jacket', category: 'Apparels', available: 219, sellThrough: '73.5%', note: 'Highest volume winning style in the business' },
  { style: 'Fleece Set', category: 'Apparels', available: 24, sellThrough: '100%', note: '100% Sold out' },
  { style: 'Denim Lower', category: 'Apparels', available: 94, sellThrough: '88.3%', note: 'Consistent performer' },
  { style: 'Sweater', category: 'Apparels', available: 49, sellThrough: '85.7%', note: 'High velocity' },
  { style: 'Hoodie Zipper', category: 'Apparels', available: 55, sellThrough: '85.5%', note: 'Core repeat reorder' },
  { style: 'Down Shoulder', category: 'Apparels', available: 34, sellThrough: '73.5%', note: 'Trendy youth silhouette' },
  { style: 'Cardigan', category: 'Apparels', available: 22, sellThrough: '68.2%', note: 'Stable seller' }
];

export const PREDICTORS = {
  priceBands: [
    { band: '< Rs 500', sellThrough: '4.1%', status: 'Slowest mover' },
    { band: 'Rs 500 - 1k', sellThrough: '12.5%', status: 'Sluggish' },
    { band: 'Rs 1k - 2k', sellThrough: '24.4%', status: 'Moderate' },
    { band: 'Rs 2k - 4k', sellThrough: '27.5%', status: 'Healthy' },
    { band: 'Rs 4k - 8k', sellThrough: '27.1%', status: 'Healthy' },
    { band: 'Rs 8k+', sellThrough: '50.2%', status: 'Fastest mover (Luxury demand)' }
  ],
  colors: [
    { color: 'Blue', sellThrough: '34.5%' },
    { color: 'Black', sellThrough: '28.7%' },
    { color: 'Cream', sellThrough: '28.1%' },
    { color: 'Grey', sellThrough: '24.5%' },
    { color: 'White', sellThrough: '18.9%' },
    { color: 'Assorted', sellThrough: '11.8%' }
  ],
  sizes: [
    { size: 'M', sellThrough: '30.0%' },
    { size: 'L', sellThrough: '29.6%' },
    { size: 'XL', sellThrough: '25.9%' },
    { size: 'XXL', sellThrough: '24.8%' },
    { size: 'S', sellThrough: '20.8%' },
    { size: 'UNI', sellThrough: '18.7%' }
  ],
  seasonalMisses: [
    { product: 'Santa Globe', category: 'Home Decoration', units: 58, value: 58000 },
    { product: 'Halloween', category: 'Home Decoration', units: 45, value: 27000 },
    { product: 'Wine Glass', category: 'Glassware House Hold', units: 25, value: 57000 },
    { product: 'Squin Cap', category: 'Accessories', units: 96, value: 19000 },
    { product: 'Sky Lantren', category: 'Gadgets', units: 21, value: 11000 },
    { product: 'Wine Bottle Stopper', category: 'Utensils', units: 39, value: 4000 }
  ]
};

export const ALL_47_CATEGORIES: CategoryMetric[] = [
  { category: 'Apparels', available: 10288, sold: 2890, closing: 7398, closingValue: 25400000, sellThrough: '28.1%' },
  { category: 'Accessories', available: 2174, sold: 340, closing: 1834, closingValue: 2493000, sellThrough: '15.6%' },
  { category: 'Apparel Up', available: 696, sold: 264, closing: 432, closingValue: 956000, sellThrough: '37.9%' },
  { category: 'Home Decoration', available: 549, sold: 88, closing: 461, closingValue: 776000, sellThrough: '16.0%' },
  { category: 'Apparel BT', available: 243, sold: 84, closing: 159, closingValue: 496000, sellThrough: '34.6%' },
  { category: 'Resin', available: 308, sold: 60, closing: 248, closingValue: 377000, sellThrough: '19.5%' },
  { category: 'Steel & Iron', available: 279, sold: 8, closing: 271, closingValue: 233000, sellThrough: '2.9%' },
  { category: 'Gadgets', available: 110, sold: 14, closing: 96, closingValue: 213000, sellThrough: '12.7%' },
  { category: 'Glassware House Hold', available: 100, sold: 8, closing: 92, closingValue: 183000, sellThrough: '8.0%' },
  { category: 'Soft Toy', available: 447, sold: 1, closing: 446, closingValue: 174000, sellThrough: '0.2%' },
  { category: 'Utensils', available: 202, sold: 15, closing: 187, closingValue: 159000, sellThrough: '7.4%' },
  { category: 'Toy', available: 154, sold: 8, closing: 146, closingValue: 122000, sellThrough: '5.2%' },
  { category: 'Light and Lamp', available: 65, sold: 8, closing: 57, closingValue: 98000, sellThrough: '12.3%' },
  { category: 'Ceramic', available: 187, sold: 10, closing: 177, closingValue: 95000, sellThrough: '5.3%' },
  { category: 'Plastic', available: 132, sold: 42, closing: 90, closingValue: 83000, sellThrough: '31.8%' },
  { category: 'Pocket Tool', available: 38, sold: 0, closing: 38, closingValue: 55000, sellThrough: '0.0%' },
  { category: 'Vintage', available: 24, sold: 2, closing: 22, closingValue: 44000, sellThrough: '8.3%' },
  { category: 'Decoration', available: 43, sold: 1, closing: 42, closingValue: 44000, sellThrough: '2.3%' },
  { category: 'Textile', available: 22, sold: 3, closing: 19, closingValue: 42000, sellThrough: '13.6%' },
  { category: 'Imitation Jewellery', available: 64, sold: 0, closing: 64, closingValue: 38000, sellThrough: '0.0%' }
];
