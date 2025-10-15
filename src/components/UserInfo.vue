<template>
    <div>
        <h2>{{ username }}的个人中心</h2>
        <button class="btn" @click="logout">退出登录</button>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';
import { useRouter } from 'vue-router';

const username = ref('');
const router = useRouter();

const logout = async () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    let username = '';
    if( userStr ) {
        const user = JSON.parse(userStr);
        username = user.username;
    }

    try {
        const response = await api.post('/user/logout', { username }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

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
        username.value = user.username
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
</style>