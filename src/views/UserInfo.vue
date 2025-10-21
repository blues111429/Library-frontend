<template>
    <div class="profile-page">
        <div v-if="name && name !== '游客'" class="profile-card">
            <h2 class="title">{{ name }}的个人中心</h2>
            <div class="info">
                <div class="info-item"><span class="label">性别:</span> {{ gender }}</div>
                <div class="info-item"><span class="label">类别:</span> {{ type }}</div>
                <div class="info-item"><span class="label">电话:</span> {{ phone }}</div>
                <div class="info-item"><span class="label">邮箱:</span> {{ email }}</div>
            </div>
            <div class="button-container">
                <button class="btn logout" @click="logout">退出登录</button>
                <button class="btn home" @click="toHome">主页</button>
                <button class="btn admin" @click="toAdmin">管理员页面</button>
            </div>
        </div>

        <BaseModal ref="modalRef" />
        
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';
import { useNavigation } from '../utils/navigation';
import BaseModal from '../components/BaseModal.vue';

const name = ref('');
const gender = ref('');
const type = ref('');
const phone = ref('');
const email = ref('');
const username = ref('');
const modalRef = ref(false);
const { toHome, toAdmin } = useNavigation();

const getUserInfo = async () => {
    try {
        const response = await api.get('/user/userInfo');
        name.value = response.data.name;
        gender.value = response.data.gender;
        type.value = response.data.typeCn;
        phone.value = response.data.phone;
        email.value = response.data.email;
    } catch (err) {
        console.log('获取用户信息失败', err);
        modalRef.value.showModalAndRedirect('无法获取用户信息，请重新登录','warning', '/login');
    }
};

const logout = async () => {
    try {
        const response = await api.post('/user/logout');
        console.log(response);
        modalRef.value.showModalAndRedirect(response.message, 'success', '/login');
    } catch (err) {
        console.error('退出请求失败', err);
        modalRef.value.showModalAndRedirect('退出失败，请重试');
    } finally {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("name");
        name.value = '';
    }
}

onMounted(() => {
    const nameStorage = localStorage.getItem('name');
    if (nameStorage) {
        username.value = nameStorage;
        getUserInfo();
    } else {
        modalRef.value.showModalAndRedirect('您还未登录，正在跳转到登录页面...', 'warning', '/login');
    }
});
</script>

<style lang="scss" scoped>
.profile-page {
    max-width: 600px;
    margin: 40px auto;
    font-family: 'Segoe UI', sans-serif;
}

.profile-card {
    background: #ffffff;
    padding: 30px 25px;
    border-radius: 16px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
    text-align: center;
}

.title {
    font-size: 24px;
    font-weight: 600;
    color: #333;
    margin-bottom: 20px;
}

.info {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 25px;

    .info-item {
        display: flex;
        justify-content: space-between;
        font-size: 16px;
        color: #555;

        .label {
            font-weight: 500;
            color: #333;
        }
    }
}

.button-container {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;

    .btn {
        padding: 10px 20px;
        border: none;
        border-radius: 8px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        color: white;
    }

    .logout {
        background-color: #e53e3e;
    }
    .logout:hover {
        background-color: #c53030;
    }

    .home {
        background-color: #3182ce;
    }
    .home:hover {
        background-color: #2b6cb0;
    }

    .admin {
        background-color: #38a169;
    }
    .admin:hover {
        background-color: #2f855a;
    }
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}

.modal {
    background: #fff;
    padding: 28px 36px;
    border-radius: 12px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
    text-align: center;

    h3 {
        font-size: 20px;
        margin-bottom: 12px;
    }

    p {
        font-size: 16px;
        color: #555;
    }
}
</style>
