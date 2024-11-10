import axios from 'axios';
import { clearToken } from '../store/reducers/authSlice';
import store from '../store/index';



let axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
});


axiosInstance.interceptors.request.use(
    (config) => {
        const token = store.getState().auth.token;
        const tk = localStorage.getItem('token');
        if (token !== null && token) {
            config.headers['access'] = token;
        } else if (tk !== null && tk) {
            config.headers['access'] = tk;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const token = store.getState().auth.token;
        const tk = localStorage.getItem('token');
        if (error.response.status === 401) {
            if (token !== null && token) {
                clearToken();
            } else if (tk !== null && tk) {
                localStorage.removeItem('token');
            }
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);


export const instance = axiosInstance;