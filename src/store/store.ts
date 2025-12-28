import { configureStore, combineReducers } from '@reduxjs/toolkit';
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

const rootReducer = combineReducers({
  products: productsReducer,
  orders: ordersReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  // Fix: Removed explicit casting to 'PreloadedState'
  // loadState() returns 'any', which is valid here.
  preloadedState: loadState(),
});

store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;