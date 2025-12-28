import productsData from './products.json';
import ordersData from './orders.json';
import type { Product, Order } from '../types.ts';

// Simulate network delay (300-800ms) [cite: 54]
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  fetchProducts: async (): Promise<Product[]> => {
    await delay();
    return productsData as Product[]; 
  },
  
  fetchOrders: async (): Promise<Order[]> => {
    await delay();
    return ordersData as Order[];
  },

  // Example mutation simulation
  createProduct: async (product: Product): Promise<Product> => {
    await delay();
    return product;
  }
};