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
        const response = await api.get('/user/userInfo');
        console.log(response);
        username.value = response.username;
        name.value = response.name;
        gender.value = response.gender;
        type.value = response.typeCn;
        phone.value = response.phone;
        email.value = response.email;
    } catch( err ) {
        console.log('获取用户信息失败', err);
        alert('无法获取用户信息，请重新登录');
        router.push('/login');
    }
}

const logout = async () => {
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

        router.push('/login');
    } catch( err ) {
        console.log('退出失败:', err);
        alert('退出失败');
    }
}

onMounted(() => {
    const usernameStorage = localStorage.getItem('username')
    if(usernameStorage) {
        username.value = usernameStorage;
        getUserInfo();
    } else {
        username.value = '游客';
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