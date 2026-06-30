import { configureStore } from '@reduxjs/toolkit';
import climateReducer from './climateSlice';

export const store = configureStore({
  reducer: {
    climate: climateReducer,
  }
});