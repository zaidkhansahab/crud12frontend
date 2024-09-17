import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API Base URL
const API_URL = 'https://crud12backend.onrender.com/api/users';
const PAYMENT_URL = 'http://localhost:5000/api/payments'; // Payment API base URL

// Fetch all users
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await axios.get(API_URL);
  return response.data;
});

// Add new user
export const addUser = createAsyncThunk('users/addUser', async (user) => {
  const response = await axios.post(API_URL, user);
  return response.data;
});

// Update user
export const updateUser = createAsyncThunk('users/updateUser', async ({ id, user }) => {
  const response = await axios.put(`${API_URL}/${id}`, user);
  return response.data;
});

// Delete user
export const deleteUser = createAsyncThunk('users/deleteUser', async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
});

// Make a payment (e.g., with Razorpay)
export const initiatePayment = createAsyncThunk('payments/initiatePayment', async (paymentData) => {
  const response = await axios.post(PAYMENT_URL, paymentData); // Send payment data to backend
  return response.data; // Return the payment response, e.g., order details
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    status: 'idle',
    paymentStatus: 'idle', // Track payment status
    paymentResponse: null, // Store payment response
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // User CRUD operations
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((user) => user._id === action.payload._id);
        state.users[index] = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      // Payment-related cases
      .addCase(initiatePayment.pending, (state) => {
        state.paymentStatus = 'loading';
      })
      .addCase(initiatePayment.fulfilled, (state, action) => {
        state.paymentStatus = 'succeeded';
        state.paymentResponse = action.payload; // Store payment response
      })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.paymentStatus = 'failed';
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
