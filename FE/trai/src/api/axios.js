import axios from 'axios';
import authSlice from '@store/authSlice';
import {configureStore} from "@reduxjs/toolkit";

let axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
});


axiosInstance.interceptors.request.use(
    (config) => {
        let store = configureStore({reducer: authSlice});
        const tk = store.getState().token;
        if (tk !==null && tk) {
            config.headers['access'] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const instance = axiosInstance;