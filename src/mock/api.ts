import productsData from './products.json';
import ordersData from './orders.json';
import type { Product, Order } from '../types.ts';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // Products
  fetchProducts: async (): Promise<Product[]> => {
    await delay();
    return productsData as Product[];
  },
  addProduct: async (product: Product): Promise<Product> => {
    await delay();
    return product;
  },
  updateProduct: async (product: Product): Promise<Product> => {
    await delay();
    return product;
  },
  deleteProduct: async (id: string): Promise<string> => {
    await delay();
    return id;
  },

  // Orders
  fetchOrders: async (): Promise<Order[]> => {
    await delay();
    return ordersData as Order[];
  },
  createOrder: async (order: Order): Promise<Order> => {
    await delay();
    return order;
  },
  updateOrderStatus: async (id: string, status: Order['status']): Promise<{id: string, status: Order['status']}> => {
    await delay();
    return { id, status };
  }
};