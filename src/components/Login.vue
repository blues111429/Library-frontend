<template>
    <div class="container">
        <div class="input-container">
            <input v-model="username" placeholder="用户名" />
            <input type="password" v-model="password" placeholder="密码" />
        </div>
        <div class="buttons">
            <button class="btn" @click="login">登录</button>
            <button class="btn">注册</button>
        </div>
    </div>
</template>

<script setup>
import {ref} from'vue'
import { useRouter } from 'vue-router';

const username =ref('')
const password = ref('')
const router = useRouter()

async function login() {
    try {
        const res = await fetch('http://localhost:8080/api/user/login', {
            method:'POST',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify({ username: username.value, password: password.value})
        })

        const data = await res.json()
        if(data.message === '登录成功') {
            localStorage.setItem('token', data.token)
            console.log(data)
            console.log(data.username)
            console.log(data.role)
        } else {
            alert('用户名或密码错误')
        }
    } catch(err) {
        console.log(err)
        alert('登录失败，请检查后端服务')
    }
}
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