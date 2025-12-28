import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { mockApi } from '../mock/api';
import type { Product } from '../types.ts';

// Thunk example [cite: 54]
export const fetchProducts = createAsyncThunk('products/fetchAll', async () => {
  return await mockApi.fetchProducts();
});

interface ProductsState {
  items: Product[];
  status: 'idle' | 'loading' | 'failed';
}

const initialState: ProductsState = {
  items: [],
  status: 'idle',
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Sync actions for immediate UI updates if preferred, 
    // or standard reducers that might be triggered by other logic
    addProduct: (state, action: PayloadAction<Product>) => {
      state.items.push(action.payload);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex((p: Product) => p.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      // Soft delete preferred [cite: 31]
      const index = state.items.findIndex((p: Product) => p.id === action.payload);
      if (index !== -1) state.items[index].status = 'Inactive'; 
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { addProduct, updateProduct, deleteProduct } = productsSlice.actions;
export default productsSlice.reducer;