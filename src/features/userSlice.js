import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API Base URL
const API_URL = 'http://localhost:5000/api/users';

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

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
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
      });
  },
});

export default userSlice.reducer;
