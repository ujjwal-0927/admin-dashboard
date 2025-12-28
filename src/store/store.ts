import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import ordersReducer from './ordersSlice'; // (You create this similar to products)

// Load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('reduxState');
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

// Save state (excluding loading status) [cite: 62]
const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify({
      products: { items: state.products.items }, // Only persist data, not status
      orders: { items: state.orders.items }
    });
    localStorage.setItem('reduxState', serializedState);
  } catch {
    // ignore write errors
  }
};

const store = configureStore({
  reducer: {
    products: productsReducer,
    orders: ordersReducer,
  },
  preloadedState: loadState(), // Rehydration [cite: 10]
});

// Subscribe to store updates to save to localStorage
store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;