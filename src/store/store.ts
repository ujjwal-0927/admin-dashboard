import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import ordersReducer from './ordersSlice';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('reduxState');
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify({
      products: { items: state.products.items, status: 'idle' },
      orders: { items: state.orders.items, status: 'idle' }
    });
    localStorage.setItem('reduxState', serializedState);
  } catch {
    // ignore
  }
};

const store = configureStore({
  reducer: {
    products: productsReducer,
    orders: ordersReducer,
  },
  preloadedState: loadState(),
});

store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;