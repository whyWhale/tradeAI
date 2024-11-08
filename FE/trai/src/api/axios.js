import axios from 'axios';
import {configureStore} from "@reduxjs/toolkit";
import authSlice from "@store/reducers/authSlice.jsx";

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
        const tk = localStorage.getItem('token');
        if (tk !== null && tk) {
            config.headers['access'] = tk;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);


export const instance = axiosInstance;