import { defineStore } from "pinia";
import api from "../api";

export const userUserStore = defineStore('user', {
    state: () => ({
        isLoggedIn: false,
        userInfo: {
            name: '',
            gender: '',
            type: '',
            phone: '',
            email: '',
        },
    }),

    actions: {
        //拉取用户信息
        async fetchUserInfo() {
            try {
                const response = await api.get('/user/userInfo');
                this.userInfo = {
                    name: response.data.name,
                    gender: response.data.gender,
                    type: response.data.typeCn,
                    phone: response.data.phone,
                    email: response.data.email,
                };
                this.isLoggedIn = true;
                localStorage.setItem('name', response.data.name);
            } catch (err) {
                console.log('获取用户信息失败:', err);
                this.isLoggedIn = false;
                this.userInfo = {
                    name: '',
                    gender: '',
                    type: '',
                    phone: '',
                    email: '',
                };
            }
        },
        //退出登录
        logout() {
            this.isLoggedIn = false;
            this.userInfo = {
                name: '',
                gender: '',
                type: '',
                phone: '',
                email: '',
            };
            localStorage.removeItem('name');
            localStorage.removeItem('token');
        }
    }
})