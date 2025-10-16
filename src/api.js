import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8080/api',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
    timeout: 10000
});

// 请求拦截器
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization  = `Bearer ${token}`;
    }
    return config;
}, error => Promise.reject(error));

api.interceptors.response.use(
    response => response.data,
    err => {
        if(err.response) {
            if (err.response.status === 401) {
                console.log('未授权token或token过期，请重新登录');
            } else if(err.response.status === 403) {
                console.warn('无权访问');
            }
        }
        return Promise.reject(err);
    }
);

export default api;