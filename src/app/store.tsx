// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';
import { profileApi } from '../features/Mypage/profileApi';
import { championsApi } from '../features/champions/championsApi';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      profileApi.middleware,
      championsApi.middleware
    ),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
