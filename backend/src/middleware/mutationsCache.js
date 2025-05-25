import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import searchReducer from './searchSlice';
import totalAlbumsReducer from './totalAlbumsSlice';
import { freeze } from 'immer';

const store = configureStore({
  reducer: {
    search: searchReducer,
    totalAlbums: totalAlbumsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(freeze), // 🔥 catches all mutations
});

export default store;
