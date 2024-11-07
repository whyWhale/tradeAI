// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import BTCDataReducer from './BTCDataSlice'
import authReducer from './authSlice';


const store = configureStore({
  reducer: {
    BTCData: BTCDataReducer,
    auth: authReducer,
  },
});

export default store;