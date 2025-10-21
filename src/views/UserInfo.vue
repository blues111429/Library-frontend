<template>
    <div class="profile-page">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading">
            <div class="spinner"></div>
            <p>正在加载用户信息...</p>
        </div>

        <!-- 登录成功 -->
        <div v-else-if="isLoggedIn" class="profile-card">
            <div class="header">
                <div class="avatar">{{ name.charAt(0) || '访' }}</div>
                <div class="user-info">
                    <h2 class="name">{{ name }}</h2>
                    <p class="type-tag">{{ type || '普通用户' }}</p>
                </div>
            </div>

            <div class="info-list">
                <div class="info-item">
                    <span class="label">性别</span>
                    <span class="value">{{ gender || '未填写' }}</span>
                </div>
                <div class="info-item">
                    <span class="label">类别</span>
                    <span class="value">{{ type || '未填写' }}</span>
                </div>
                <div class="info-item">
                    <span class="label">电话</span>
                    <span class="value">{{ phone || '未填写' }}</span>
                </div>
                <div class="info-item">
                    <span class="label">邮箱</span>
                    <span class="value">{{ email || '未填写' }}</span>
                </div>
            </div>
        </div>

        <!-- 未登录 -->
        <div v-else class="empty">
            <p>您还未登录，请先登录后查看个人信息</p>
            <button class="btn login" @click="$router.push('/login')">立即登录</button>
        </div>

        <BaseModal ref="modalRef" />
    </div>
</template>

<script setup>
import { ref, onMounted, computed  } from 'vue';
import BaseModal from '../components/BaseModal.vue';
import { userUserStore } from '../stores/userStore';
//弹窗显示
const modalRef = ref(false);
//加载状态
const loading = ref(true);
//
const userStore = userUserStore();

// 用计算属性绑定全局状态
const isLoggedIn = computed(() => userStore.isLoggedIn);
const name = computed(() => userStore.userInfo.name);
const gender = computed(() => userStore.userInfo.gender);
const type = computed(() => userStore.userInfo.type);
const phone = computed(() => userStore.userInfo.phone);
const email = computed(() => userStore.userInfo.email);

const getUserInfo = async () => {
    try {
        await userStore.fetchUserInfo();//拉取用户信息
    } catch (err) {
        console.log('获取用户信息失败', err);
        modalRef.value.showModalAndRedirect('无法获取用户信息，请重新登录', 'warning', '/login');
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    if (localStorage.getItem('name')) {
        getUserInfo();
    } else {
        loading.value = false;
        modalRef.value.showModalAndRedirect('您还未登录', 'warning');
    }
});
</script>

<style lang="scss" scoped>
.profile-page {
    max-width: 700px;
    margin: 60px auto;
    font-family: 'Segoe UI', sans-serif;
}

/* ========== 加载中状态 ========== */
.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #555;
    font-size: 18px;
    margin-top: 120px;

    .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #dbeafe;
        border-top-color: #3182ce;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 10px;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
}

/* ========== 未登录状态 ========== */
.empty {
    text-align: center;
    color: #666;
    font-size: 18px;
    margin-top: 100px;

    .btn {
        margin-top: 20px;
        padding: 10px 22px;
        background-color: #3182ce;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        &:hover {
            background-color: #2b6cb0;
        }
    }
}

/* ========== 用户信息卡片 ========== */
.profile-card {
    background: #ffffff;
    padding: 36px 40px;
    border-radius: 16px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    &:hover {
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
    }

    .header {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-bottom: 25px;

        .avatar {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            background: linear-gradient(135deg, #63b3ed, #4299e1);
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-size: 28px;
            font-weight: 600;
            box-shadow: 0 4px 10px rgba(66, 153, 225, 0.4);
        }

        .user-info {
            .name {
                font-size: 24px;
                font-weight: 600;
                color: #2d3748;
                margin-bottom: 4px;
            }

            .type-tag {
                display: inline-block;
                padding: 4px 10px;
                font-size: 14px;
                border-radius: 6px;
                background-color: #ebf8ff;
                color: #2b6cb0;
                font-weight: 500;
            }
        }
    }

    .info-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 30px;

        .info-item {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px dashed #e2e8f0;
            padding-bottom: 6px;
            font-size: 16px;

            .label {
                color: #4a5568;
                font-weight: 500;
            }

            .value {
                color: #2d3748;
            }
        }
    }
}
</style>
