<template>
    <div>
        <div v-if="username && username !== '游客'">
            <h2>{{ username }}的个人中心</h2>
            <div class="info">
                <p>姓名: {{ name }}</p>
                <p>性别: {{ gender }}</p>
                <p>类别: {{ type }}</p>
                <p>电话: {{ phone }}</p>
                <p>邮箱: {{ email }}</p>
            </div>
            <div class="button-container">
                <button class="btn" @click="logout">退出登录</button>
                <button class="btn" @click="toHome">主页</button>
                <button class="btn" @click="toAdmin">管理员页面</button>
            </div>
        </div>

        <div v-if="showModal" class="modal-overlay">
            <div class="modal">
                <h3>提示</h3>
                <p>您还未登陆，正在跳转到登录页面...</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';
import { useRouter } from 'vue-router';
import { useNavigation } from '../utils/navigation';

const name = ref('');
const gender = ref('');
const type = ref('');
const phone = ref('');
const email = ref('');
const username = ref('');
const showModal = ref(false);
const router = useRouter();
const { toHome, toAdmin } = useNavigation();

const getUserInfo = async ()=> {
    try {
        const response = await api.get('/user/userInfo');
        console.log(response);
        username.value = response.data.username;
        name.value = response.data.name;
        gender.value = response.data.gender;
        type.value = response.data.typeCn;
        phone.value = response.data.phone;
        email.value = response.data.email;
    } catch( err ) {
        console.log('获取用户信息失败', err);
        alert('无法获取用户信息，请重新登录');
        router.push('/login');
    }
}

const logout = async () => {
    try {
        const response = await api.post('/user/logout');

        alert(response.message);
        localStorage.removeItem('token');

        router.push('/login');
    } catch( err ) {
        console.log('退出失败:', err);
        alert('退出失败');
    }
}

onMounted(() => {
    const usernameStorage = localStorage.getItem('username');
    if(usernameStorage) {
        username.value = usernameStorage;
        getUserInfo();
    } else {
        username.value = '游客';
        showModal.value = true;
        setTimeout(() => {
            showModal.value = false
            router.push('/login');
        }, 2000);
    }
})
</script>

<style lang="scss" scoped>
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

.button-container {
    display: flex;
    gap: 20px;
    justify-content: center;
    flex-direction: column;
}

.btn {
    color: white;
    background-color: #7a1a17;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}

.modal {
    background: #fff;
    padding: 24px 36px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    text-align: center;
}
</style>