export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'Active' | 'Inactive';
  rating: number;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  name: string; // Cached name in case product is deleted
  price: number; // Snapshot of price at purchase
  qty: number;
}

export interface Order {
  id: string;
  customerName: string;
  date: string; // ISO String
  total: number;
  status: 'Pending' | 'Completed' | 'Cancelled';
  items: OrderItem[];
}