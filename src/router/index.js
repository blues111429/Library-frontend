import { createRouter, createWebHistory } from "vue-router";

import Home from "../components/Home.vue";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
import UserInfo from "../components/UserInfo.vue";
import Admin from "../components/Admin.vue";


const routes = [
    { path:'/', name:"home", component: Home },
    { path:'/login', name:"login", component: Login },
    { path:'/register', name:"register", component: Register },
    { path:'/userInfo', name:"userInfo", component:UserInfo },
    { path:'/admin', name:"admin", component:Admin },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router