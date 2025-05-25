// src/redux/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false
};

const LoadingSkeletonSlice = createSlice({
  name: 'isLoading',
  initialState,
  reducers: {
    toggleLoading(state) {
      state.isLoading = !isLoading
    }
  },
});

export const { toggleLoading } = LoadingSkeletonSlice.actions;
export default LoadingSkeletonSlice.reducer;
