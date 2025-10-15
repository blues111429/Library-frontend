import { createRouter, createWebHistory } from "vue-router";

import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
import UserInfo from "../components/UserInfo.vue";


const routes = [
    { path:'/login', name:"login", component: Login },
    { path:'/register', name:"register", component: Register },
    { path:'/user-info', name:"user-info", component:UserInfo },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router