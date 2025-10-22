import { defineStore } from "pinia";
import api from "../api";

export const useUserStore = defineStore('user', {
    state: () => ({
        isLoggedIn: false,
        userInfo: {
            user_id: '',
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
                    user_id: response.data.user_id,
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
                    user_id: '',
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
                user_id: '',
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