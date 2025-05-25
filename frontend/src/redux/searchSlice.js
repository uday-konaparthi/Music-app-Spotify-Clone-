// redux/slices/searchSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  results: [],
  query: '',
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setResults: (state, action) => {
      state.results = action.payload;
    },
    setQuery: (state, action) => {
      state.query = action.payload;
    },
  },
});

export const { setResults, setQuery } = searchSlice.actions;
export default searchSlice.reducer;