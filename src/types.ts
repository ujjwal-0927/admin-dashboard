// Type definitions for the admin dashboard application

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
  qty: number;
}

export interface Order {
  id: string;
  customerName: string;
  date: string;
  total: number;
  status: 'Pending' | 'Completed' | 'Cancelled';
  items: OrderItem[];
}