import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import UserInfo from "../views/UserInfo.vue";
import Admin from "../views/UserManage.vue";
import Navbar from "../components/Navbar.vue";
import UserCenter from "../views/UserCenter.vue";
import BookManage from "../views/BookManage.vue";
import UserManage from "../views/UserManage.vue";

const routes = [
    { path:'/', name:"home", component: Home },
    { path:'/navbar', name:"navbar",  component:Navbar },
    { path:'/login', name:"login", component: Login },
    { path:'/register', name:"register", component: Register },
    //用户中心
    { path:'/userCenter', name:"userCenter",  component: UserCenter},
    
    //功能模块
    //用户信息
    { path:'/userInfo', name:"userInfo", component:UserInfo },
    //图书管理
    { path:'/bookManage', name:"bookmanage", component: BookManage },
    //管理员
    { path:'/admin', name:"admin", component:Admin },
    //用户管理
    { path:'/userManage', name:"userManage", component: UserManage},
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router