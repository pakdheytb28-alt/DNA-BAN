
export type TireType = 'Tubeless' | 'Tube Type';

export interface TireItem {
  id: string;
  brand: string;
  model: string;
  size: string;
  type: TireType;
  stock: number;
  minStock: number;
  price: number; // Harga Jual Akhir
  purchasePrice: number; // Harga Beli (Modal)
  het: number; // Harga Eceran Tertinggi
  discount: number; // Diskon Konsumen (%)
  shopDiscount?: number; // Diskon Toko (%)
  margin?: number; // Margin Keuntungan (%)
}

export interface Transaction {
  id: string;
  itemId: string;
  type: 'IN' | 'OUT';
  quantity: number;
  date: string;
  note?: string;
  priceAtTransaction?: number;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: 'Operasional' | 'Sewa' | 'Listrik' | 'Gaji' | 'Lainnya';
}

export type ViewState = 
  | 'DASHBOARD' 
  | 'INVENTORY' 
  | 'STOCK_IN' 
  | 'STOCK_OUT' 
  | 'HISTORY' 
  | 'SETTINGS' 
  | 'NEW_ITEM' 
  | 'EDIT_ITEM'
  | 'REPORTS' 
  | 'EXPENSES';
