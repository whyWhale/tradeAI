// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import BTCDataReducer from './reducers/BTCDataSlice'
import authReducer from './reducers/authSlice';
import decisionCountReducer from './reducers/decisionCountSlice';


const store = configureStore({
  reducer: {
    BTCData: BTCDataReducer,
    auth: authReducer,
    decisionCount: decisionCountReducer
  },
});

export default store;