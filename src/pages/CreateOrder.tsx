import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { createOrder } from '../store/ordersSlice';
import { nanoid } from '@reduxjs/toolkit';
import { useNavigate } from 'react-router-dom';
import type { OrderItem } from '../types';

export default function CreateOrder() {
  const products = useAppSelector(state => state.products.items.filter(p => p.status === 'Active' && p.stock > 0));
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [cart, setCart] = useState<OrderItem[]>([]);
  const [customer, setCustomer] = useState('Guest Customer');

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => item.productId === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { productId: product.id, name: product.name, price: product.price, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.productId !== id));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    await dispatch(createOrder({
      id: nanoid(),
      customerName: customer,
      date: new Date().toISOString(),
      status: 'Pending',
      items: cart,
      total
    }));
    navigate('/orders');
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-100px)] gap-6">
      {/* Product Grid */}
      <div className="flex-1 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Select Products</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <div key={product.id} 
              onClick={() => addToCart(product)}
              className="bg-white p-4 rounded shadow cursor-pointer hover:ring-2 ring-blue-500 transition-all"
            >
              <div className="font-bold truncate">{product.name}</div>
              <div className="text-gray-500 text-sm">{product.category}</div>
              <div className="mt-2 text-blue-600 font-bold">${product.price}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-full md:w-96 bg-white rounded shadow-lg flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg mb-2">Current Order</h2>
          <input 
            value={customer} 
            onChange={(e) => setCustomer(e.target.value)}
            className="w-full border p-2 rounded text-sm"
            placeholder="Customer Name"
          />
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.map(item => (
            <div key={item.productId} className="flex justify-between items-center text-sm">
              <div>
                <div>{item.name}</div>
                <div className="text-gray-500">${item.price} x {item.qty}</div>
              </div>
              <button onClick={() => removeFromCart(item.productId)} className="text-red-500 px-2">×</button>
            </div>
          ))}
          {cart.length === 0 && <p className="text-gray-400 text-center mt-10">Cart is empty</p>}
        </div>

        <div className="p-4 border-t bg-gray-50">
          <div className="flex justify-between text-xl font-bold mb-4">
            <span>Total</span>
            <span>${total}</span>
          </div>
          <button 
            onClick={handlePlaceOrder}
            disabled={cart.length === 0}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold disabled:opacity-50"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}