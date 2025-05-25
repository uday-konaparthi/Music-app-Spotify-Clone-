// src/store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from './redux/authSlice'
import sidebarReducer from './redux/sidebarSlice'
import totalAlbumsReducer from './redux/totalCollectionSlice'

import songsByAlbumidReducer from './redux/songsCollectionSlice'
import musicReducer from './redux/playSlice'
import likedSongsReducer from './redux/likedSongsSlice'
import playlistReducer from './redux/playlistSlice'
import recentsReducer from './redux/recentsSlice'
import playlistSongsReducer from './redux/playlistSongs'
import searchReducer from './redux/searchSlice'
import LoadingSkeletonReducer from './redux/skeletons'

const rootReducer = combineReducers({
  auth: authReducer,
  sidebar: sidebarReducer,
  totalAlbums: totalAlbumsReducer,
  songsByAlbumid: songsByAlbumidReducer,
  music: musicReducer,
  likedSongs: likedSongsReducer,
  playlist: playlistReducer,
  recents: recentsReducer,
  playlistSongs: playlistSongsReducer,
  search: searchReducer,
  loadingSkeleton: LoadingSkeletonReducer
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
