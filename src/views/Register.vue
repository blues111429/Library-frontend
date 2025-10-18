<template>
    <div class="register-container">
        <input v-model="form.phone" placeholder="请输入手机号" />
        <input v-model="form.password" placeholder="输入密码" />
        <input v-model="form.name" placeholder="输入昵称" />
        <div class="gender-container">
            <label>
                <input type="radio" value="男" v-model="form.gender" />
                男
            </label>
            <label>
                <input type="radio" value="女" v-model="form.gender" />
                女
            </label>
            <label>
                <input type="radio" value="其他" v-model="form.gender" />
                其他
            </label>
        </div>
        <div class="type-container">
            <label>
                <input type="radio" value="student" v-model="form.type"/>
                学生
            </label>
            <label>
                <input type="radio" value="teacher" v-model="form.type"/>
                教师
            </label>
        </div>
        <input v-model="form.email" placeholder="请输入邮箱" />
    </div>
    <div class="buttons">
        <button class="btn" @click="register">注册</button>
        <button class="btn" @click="goLogin">登录</button>
        <button class="btn" @click="toHome">主页</button>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';
import { useNavigation } from '../utils/navigation';

const router = useRouter();
const { toHome } = useNavigation();
const form = ref({
    phone: '',
    password: '',
    name: '',
    gender: '',
    type: '',
    email: ''
});

const register = async ()=> {
    try {
        const data = {
            phone: form.value.phone,
            password: form.value.password,
            name: form.value.name,
            gender: form.value.gender,
            type: form.value.type,
            email: form.value.email,
        };
        const response = await api.post('/user/register', data);
        alert(response.message);

        if(response.data) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.userId);

            router.push('/login');
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
    width: 250px;
    height: 40px;
    padding: 0 12px;
    font-size: 16px;
    outline: none;
    border: 1px solid #ccc;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.register-container input:hover {
    background-color: #fff;
    box-shadow: 0 0 5px rgba(122, 26, 23, 0.4);
    border-color: #7a1a17;
}

.type-container, 
.gender-container {
    display: flex;
    gap: 20px;
    align-items: center;
}

input[type="radio"] {
    accent-color: #7a1a17;
    cursor: pointer;
    width: 18px;
    height: 18px;
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