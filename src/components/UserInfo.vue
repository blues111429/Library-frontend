<template>
    <div>
        <h2>{{ username }}的个人中心</h2>
        
        <div class="info">
            <p>姓名: {{ name }}</p>
            <p>性别: {{ gender }}</p>
            <p>类别: {{ type }}</p>
            <p>电话: {{ phone }}</p>
            <p>邮箱: {{ email }}</p>
        </div>

        <button class="btn" @click="logout">退出登录</button>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';
import { useRouter } from 'vue-router';

const name = ref('');
const gender = ref('');
const type = ref('');
const phone = ref('');
const email = ref('');
const username = ref('');
const router = useRouter();

const getUserInfo = async ()=> {
    try {
        const userStr = localStorage.getItem('user');
        if(!userStr) return;
        const user = JSON.parse(userStr);
        console.log(user.username);

        const response = await api.post('/user/userInfo', { username: user.username });

        username.value = response.username;
        name.value = response.name;
        gender.value = response.gender;
        type.value = response.type;
        phone.value = response.phone; // 修正：之前写成 response.value
        email.value = response.email; // 修正：之前写成 response.value
    } catch( err ) {
        console.log('获取用户信息失败', err);
        alert('无法获取用户信息，请重新登录');
        router.push('/login');
    }
}

const logout = async () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    let username = '';
    if( userStr ) {
        const user = JSON.parse(userStr);
        username = user.username;
    }

    try {
        const response = await api.post('/user/logout', { username });

        alert(response.message);
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        window.location.reload();
    } catch( err ) {
        console.log('退出失败:', err);
        alert('退出失败');
    }
}

onMounted(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
        const user = JSON.parse(userStr)
        username.value = user.username;
        getUserInfo();
    } else {
        username.value = '游客'
    }
})
</script>

<style lang="scss" scoped>
.btn {
    color: white;
    background-color: #7a1a17;
}

.info {
    display: flex;
    background-color: #fff5f5;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    margin: 20px auto;
    flex-direction: column;
    
}

p {
    font-size: 16px;
    color: #333;
    margin: 8px 0;
}
</style>