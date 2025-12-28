import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import type { PayloadAction } from '@reduxjs/toolkit';
import { mockApi } from '../mock/api';
import type { Product } from '../types.ts';

interface ProductsState {
  items: Product[];
  status: 'idle' | 'loading' | 'failed';
}

const initialState: ProductsState = {
  items: [],
  status: 'idle',
};

// Async Thunks
export const fetchProducts = createAsyncThunk('products/fetchAll', async () => {
  return await mockApi.fetchProducts();
});

export const addProduct = createAsyncThunk('products/add', async (product: Product) => {
  return await mockApi.addProduct(product);
});

export const updateProduct = createAsyncThunk('products/update', async (product: Product) => {
  return await mockApi.updateProduct(product);
});

export const deleteProduct = createAsyncThunk('products/delete', async (id: string) => {
  return await mockApi.deleteProduct(id);
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchProducts.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = action.payload;
      })
      // Add
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(p => p.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      // Delete (Soft)
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(p => p.id === action.payload);
        if (index !== -1) state.items[index].status = 'Inactive';
      });
  },
});

export default productsSlice.reducer;