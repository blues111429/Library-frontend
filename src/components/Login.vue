<template>
    <div class="container">
        <div class="input-container">
            <input v-model="username" placeholder="用户名" />
            <input type="password" v-model="password" placeholder="密码" />
        </div>
        <div class="buttons">
            <button class="btn" @click="login">登录</button>
            <button class="btn" @click="goRegister">注册</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { myFetch, loginUrl } from '../api';

const username = ref('');
const password = ref('');
const router = useRouter();

const login = async ()=> {
    try {
        const data = { username: username.value, password: password.value};
        const response = await myFetch(loginUrl, 'POST', data);
        
        if( response.message === '登录成功' ) {
            alert(response.message);
        } else {
            alert(response.message);
        }
    } catch( err ) {
        console.log('请求失败:' + err);
        alert('网络错误或服务器异常');
    }
};

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
    height: 25px;
}

.input-container input:hover {
    background-color: #ccc;
    border-radius: 4px;
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
}
</style>