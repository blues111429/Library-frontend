<template>
    <header class="navbar">
        <div class="logo" @click="$router.push('/')">📚 智能图书馆</div>
        <nav>
            
            <button v-if="!isLoggedIn" @click="$router.push('/login')">登录</button>
            
            <div v-else class="user-menu" @mouseenter="showDropdown=true" @mouseleave="handlerMouseLeave">
                <button class="user-btn">欢迎,{{ name }}</button>
                <div v-if="showDropdown" class="dropdown">
                    <p @click="$router.push('/userInfo')">个人中心</p>
                    <p @click="logout">退出登录</p>
                </div>
            </div>

            <button>所有图书</button>
            <button>智能推荐</button>
            <button>热门榜单</button>
        </nav>
    </header>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';

const isLoggedIn = ref(false);
const name = ref('');
const showDropdown = ref(false);

const handlerMouseLeave = () => {
    setTimeout(() => {
        showDropdown.value = false;
    }, 150);
}

const logout = async () => {
    try {
        const response = await api.post('/user/logout');
        console.log(response);
        alert(response.message);
    } catch (err) {
        console.error('退出请求失败', err);
    } finally {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("name");
        isLoggedIn.value = false;
        name.value = '';
        showDropdown.value = false;
    }
}

onMounted(() => {
    const token = localStorage.getItem("token");
    const storagedname = localStorage.getItem("name");

    if(token && storagedname) {
        isLoggedIn.value = true;
        name.value = storagedname;
    }
})
</script>

<style lang="scss" scoped>
.navbar {
    display: flex;
    background-color: #4f79a8; // 柔和蓝
    color: white;
    padding: 10px 40px;
    justify-content: space-between;
    align-items: center;
}

.logo {
    font-weight: bold;
    font-size: 20px;
    cursor: pointer;
}

nav {
    display: flex;
    align-items: center;
}

nav button {
    background: #ffffff33; // 半透明白
    color: #ffffff;
    border: none;
    padding: 6px 14px;
    margin-left: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
}

nav button:hover {
    background: #ffffff66; // hover 加深
    color: #4f79a8;       // 按钮文字变蓝
}

.user-menu {
    position: relative;
    display: inline-block;
}

.user-btn {
    background: #6ba4d9; // 浅蓝按钮
    color: white;
    border: none;
    padding: 6px 14px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.user-btn:hover {
    background: #5493c1; // hover 深蓝
}

.dropdown {
    position: absolute;
    top: 32px;
    right: 0;
    background: #ffffff; 
    border-radius: 6px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1); // 浅阴影
    min-width: 100px;
    width: fit-content;
    z-index: 10;
    animation: fadeIn 0.2s ease;
    text-align: center;
}

.dropdown button,
.dropdown p {
    color: #4f79a8; // 深蓝文字
    margin: 0;
    padding: 10px 12px;
    cursor: pointer;
    display: block;
    border: none;
    background: none;
    transition: background-color 0.2s ease;
}

.dropdown button:hover,
.dropdown p:hover {
    background-color: #d9eafc; // 浅蓝 hover
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-5px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

</style>