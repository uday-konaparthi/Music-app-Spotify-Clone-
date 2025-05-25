// src/redux/slices/sidebarSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebar: true,
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    open(state) {
      state.sidebar = true;
    },
    close(state) {
      state.sidebar = false;
    },
    toggle(state) {
      state.sidebar = !state.sidebar;
    },
  },
});

export const { open, close, toggle } = sidebarSlice.actions;
export default sidebarSlice.reducer;
