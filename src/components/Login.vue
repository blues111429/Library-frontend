<template>
    <div class="container">
        <div class="input-container">
            <input v-model="username" placeholder="用户名" />
            <input type="password" v-model="password" placeholder="密码" />
        </div>
        <div class="buttons">
            <button class="btn" @click="login" :disabled="loading">
                <span v-if="!loading">登录</span>
                <div v-else class="spinner"></div>
            </button>
            <button class="btn" @click="toRegister">注册</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api.js';
import { useNavigation } from '../utils/navigation.js';

const username = ref('');
const password = ref('');
const loading = ref(false)
const { toHome, toRegister, toUserInfo } = useNavigation();
const router = useRouter();


const login = async () => {

    if(!username.value) {
        alert('请输入用户名');
        return ;
    }

    if(!password.value) {
        alert('请输入密码');
        return ;
    }
    loading.value = true;

    try {
        const data = { username: username.value, password: password.value };
        const response = await api.post('/user/login', data)
        
        if(response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('username', response.username);
            
            alert(response.message);
            router.push('/userInfo');
        }
    } catch( err ) {
        console.log('请求失败:', err);
        alert('网络错误或服务器异常');
        console.log('catch 捕获:', err);
    } finally {
        console.log('finally 执行，loading 应该关闭');
        setTimeout(()=> {
            loading.value = false;
        }, 2000);
    }
}


const goRegister  = ()=> {
    router.push('/register');
};
</script>

<style lang="scss" scoped>
.container {
    display: flex;
    margin: 0 auto;
    gap: 30px;
    flex-direction: column;
    align-items: center;
}

.input-container {
    display: flex;
    gap: 20px;
    flex-direction: column;
}

.input-container input {
    width: 250px;
    height: 40px;
    padding: 0 12px;
    font-size: 16px;
    outline: none;
    border: 1px solid #ccc;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.input-container input:hover {
    background-color: #fff;
    box-shadow: 0 0 5px rgba(122, 26, 23, 0.4);
    border-color: #7a1a17;
}

.buttons {
    width: 100px;
    display: flex;
    gap: 20px;
    flex-direction: column;
}

.btn {
    color: white;
    background-color: #7a1a17;
    height: 40px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
}

.spinner {
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.5);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>