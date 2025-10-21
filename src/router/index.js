import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import UserInfo from "../views/UserInfo.vue";
import Admin from "../views/Admin.vue";
import Navbar from "../components/Navbar.vue";

const routes = [
    { path:'/', name:"home", component: Home },
    { path:'/login', name:"login", component: Login },
    { path:'/register', name:"register", component: Register },
    { path:'/userInfo', name:"userInfo", component:UserInfo },
    { path:'/admin', name:"admin", component:Admin },
    { path:'/navbar', name:"navbar",  component:Navbar },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router