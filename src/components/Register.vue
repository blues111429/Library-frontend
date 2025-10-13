<template>
    <div class="register-container">
        <input v-model="username" placeholder="输入用户名" />
        <input v-model="password" placeholder="输入密码" />
        <input v-model="name" placeholder="输入昵称" />
        <div class="gender-container">
            <label>
                <input type="radio" value="男" v-model="gender" />
                男
            </label>
            <label>
                <input type="radio" value="女" v-model="gender" />
                女
            </label>
            <label>
                <input type="radio" value="其他" v-model="gender" />
                其他
            </label>
        </div>
        <p>你选择的性别是: {{ gender }}</p>
        <input v-model="type" placeholder="身份：学生或教师" />
        <input v-model="phone" placeholder="请输入手机号" />
        <input v-model="email" placeholder="请输入邮箱" />
    </div>
    <div class="buttons">
        <button class="btn" @click="register">注册</button>
        <button class="btn" @click="goLogin">登录</button>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { registerUrl, myFetch } from '../api';

const router = useRouter()
const username = ref('');
const password = ref('');
const name = ref('');
const gender = ref('');
const type = ref('');
const phone = ref('');
const email = ref('');

const register = async ()=> {
    try {
        const data = {
            username: username.value,
            password: password.value,
            name: name.value,
            gender: gender.value,
            type: type.value,
            phone: phone.value,
            email: email.value
        };
        const response = await myFetch(registerUrl, 'POST', data);

        if(response.message === '注册成功') {
            console.log(response);
            alert(response.message);
        }
    } catch( err ) {
        console.log(err);
    }
};

const goLogin = ()=> {
    router.push('/login');
}
</script>

<style lang="scss" scoped>
.register-container {
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.register-container input {
    border: 2px solid black;
    height: 30px;
}

.gender-container {
    display: flex;
    gap: 20px;
    align-items: center;
}

.buttons {
    display: flex;
    flex-direction: column;
}

.btn {
    margin-top: 20px;
    background-color: #7a1a17;
    color: white;
}
</style>