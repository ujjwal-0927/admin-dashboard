import { useState, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { usePagination } from '../hooks/usePagination';
import { useDebounce } from '../hooks/useDebounce';
import { deleteProduct } from '../store/productsSlice';
import { Link } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';

export default function Products() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.products);
  
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const filteredData = useMemo(() => {
    return items.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesCat = filterCat ? p.category === filterCat : true;
      return matchesSearch && matchesCat;
    });
  }, [items, debouncedSearch, filterCat]);

  const { currentData, totalPages, currentPage, nextPage, prevPage } = usePagination(filteredData, 10);

  const categories = Array.from(new Set(items.map(p => p.category)));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link to="/products/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Add Product
        </Link>
      </div>

      <div className="flex gap-4 flex-wrap bg-white p-4 rounded shadow-sm">
        <input 
          placeholder="Search products..." 
          className="border p-2 rounded flex-1"
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="border p-2 rounded" onChange={(e) => setFilterCat(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map(product => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{product.name}</td>
                <td className="p-4">{product.category}</td>
                <td className="p-4">${product.price}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${product.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.status}
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  <Link to={`/products/edit/${product.id}`} className="text-gray-500 hover:text-blue-600"><Pencil size={16}/></Link>
                  <button onClick={() => dispatch(deleteProduct(product.id))} className="text-gray-500 hover:text-red-600"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden grid gap-4">
        {currentData.map(product => (
          <div key={product.id} className="bg-white p-4 rounded shadow-sm flex justify-between items-center">
            <div>
              <div className="font-bold">{product.name}</div>
              <div className="text-sm text-gray-500">{product.category} • ${product.price}</div>
            </div>
            <div className="flex gap-3">
               <Link to={`/products/edit/${product.id}`} className="p-2 bg-gray-100 rounded"><Pencil size={16}/></Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-4">
        <button disabled={currentPage === 1} onClick={prevPage} className="px-4 py-2 border rounded disabled:opacity-50">Prev</button>
        <span className="py-2">Page {currentPage} of {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={nextPage} className="px-4 py-2 border rounded disabled:opacity-50">Next</button>
      </div>
    </div>
  );
}