import { useAppSelector, useAppDispatch } from '../store/hooks';
import { updateOrderStatus } from '../store/ordersSlice';
import { useState } from 'react';

export default function Orders() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector(state => state.orders);
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = statusFilter === 'All' 
    ? items 
    : items.filter(o => o.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Orders</h1>
        <select 
          className="border p-2 rounded" 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded shadow-sm overflow-hidden">
        {filtered.map(order => (
          <div key={order.id} className="border-b p-4 hover:bg-gray-50 flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <div className="font-bold">Order #{order.id} <span className="text-gray-500 text-sm font-normal">by {order.customerName}</span></div>
              <div className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()} • {order.items.length} Items</div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="font-bold">${order.total}</span>
              <select 
                value={order.status}
                onChange={(e) => dispatch(updateOrderStatus({ id: order.id, status: e.target.value as any }))}
                className={`border rounded p-1 text-sm ${
                  order.status === 'Completed' ? 'bg-green-50 text-green-700' :
                  order.status === 'Cancelled' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'
                }`}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="p-8 text-center text-gray-500">No orders found.</div>}
      </div>
    </div>
  );
}