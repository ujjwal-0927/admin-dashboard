import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import type { PayloadAction } from '@reduxjs/toolkit';
import { mockApi } from '../mock/api';
import type { Order } from '../types';

interface OrdersState {
  items: Order[];
  status: 'idle' | 'loading' | 'failed';
}

const initialState: OrdersState = {
  items: [],
  status: 'idle',
};

export const fetchOrders = createAsyncThunk('orders/fetchAll', async () => {
  return await mockApi.fetchOrders();
});

export const createOrder = createAsyncThunk('orders/create', async (order: Order) => {
  return await mockApi.createOrder(order);
});

export const updateOrderStatus = createAsyncThunk('orders/updateStatus', 
  async ({ id, status }: { id: string; status: Order['status'] }) => {
    return await mockApi.updateOrderStatus(id, status);
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = action.payload;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const order = state.items.find(o => o.id === action.payload.id);
        if (order) order.status = action.payload.status;
      });
  },
});

export default ordersSlice.reducer;