import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchProducts } from './store/productsSlice';
import { fetchOrders } from './store/ordersSlice';

import Layout from './components/layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductForm from './pages/ProductForm';
import Orders from './pages/Orders';
import CreateOrder from './pages/CreateOrder';

function App() {
  const dispatch = useAppDispatch();
  const productsStatus = useAppSelector(state => state.products.status);
  const ordersStatus = useAppSelector(state => state.orders.status);

  useEffect(() => {
    if (productsStatus === 'idle') dispatch(fetchProducts());
    if (ordersStatus === 'idle') dispatch(fetchOrders());
  }, [dispatch, productsStatus, ordersStatus]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/edit/:id" element={<ProductForm />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/new" element={<CreateOrder />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;