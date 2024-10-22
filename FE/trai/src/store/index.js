// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers'; // 리듀서 모음 (필요에 따라 설정)

const store = configureStore({
  reducer: rootReducer,
});

export default store;
