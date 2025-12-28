import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addProduct, updateProduct } from '../store/productsSlice';
import type { Product } from '../types';
import { nanoid } from '@reduxjs/toolkit';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const products = useAppSelector(state => state.products.items);
  
  const isEdit = Boolean(id);
  const existingProduct = products.find(p => p.id === id);

  const [form, setForm] = useState<Partial<Product>>({
    name: '', category: '', price: 0, stock: 0, status: 'Active', rating: 5
  });

  useEffect(() => {
    if (isEdit && existingProduct) setForm(existingProduct);
  }, [isEdit, existingProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Basic Validation
    if (!form.name || form.name.length < 3) return alert('Name must be 3+ chars');
    if (!form.category) return alert('Category required');
    if ((form.price || 0) <= 0) return alert('Price must be > 0');

    const productData = {
      ...form,
      id: isEdit ? id! : nanoid(),
      updatedAt: new Date().toISOString()
    } as Product;

    if (isEdit) {
      await dispatch(updateProduct(productData));
    } else {
      await dispatch(addProduct(productData));
    }
    navigate('/products');
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-xl font-bold mb-6">{isEdit ? 'Edit Product' : 'New Product'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input 
            value={form.name} 
            onChange={e => setForm({...form, name: e.target.value})}
            className="w-full border p-2 rounded" 
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Price</label>
              <input type="number"
                value={form.price} 
                onChange={e => setForm({...form, price: Number(e.target.value)})}
                className="w-full border p-2 rounded" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Stock</label>
              <input type="number"
                value={form.stock} 
                onChange={e => setForm({...form, stock: Number(e.target.value)})}
                className="w-full border p-2 rounded" 
              />
            </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <input 
            value={form.category} 
            onChange={e => setForm({...form, category: e.target.value})}
            className="w-full border p-2 rounded" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Status</label>
          <select 
            value={form.status}
            onChange={(e: any) => setForm({...form, status: e.target.value})}
            className="w-full border p-2 rounded"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">
          Save Product
        </button>
      </form>
    </div>
  );
}