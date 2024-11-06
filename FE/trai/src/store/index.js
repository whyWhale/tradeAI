// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import BTCDataReducer from './BTCDataSlice'
import rootReducer from './reducers'; // 리듀서 모음 (필요에 따라 설정)

const store = configureStore({
  reducer: {
    BTCData: BTCDataReducer,
  },
});

export default store;