<template>
    <div class="user-center-page">
        <Navbar />

        <div class="content-wrapper">
            <aside class="sidebar">
                <ul>
                    <!-- 所有人都有 -->
                    <li :class="{ active: activeMenu === 'info' }" @click="activeMenu='info'">用户信息</li>
                    <li :class="{ active: activeMenu === 'myBorrows' }" @click="activeMenu='myBorrows'">借阅历史</li>
                    <li :class="{ active: activeMenu === 'bookshelf' }" @click="activeMenu='bookshelf'">我的书架</li>

                    <!-- 管理员功能 -->
                    <template v-if="userType === '管理员'">
                        <li :class="{ active: activeMenu === 'userManage' }" @click="activeMenu='userManage'">用户管理</li>
                        <li :class="{ active: activeMenu === 'bookManage' }" @click="activeMenu='bookManage'">图书管理</li>
                        <li :class="{ active: activeMenu === 'adminLog' }" @click="activeMenu='adminLog'">管理员日志</li>
                    </template>
                </ul>

                <div class="button-group">
                    <button class="btn home" @click="$router.push('/')">🏠 返回主页</button>
                </div>
            </aside>

            <main class="main-content">
                <component :is="currentComponent" />
            </main>
        </div>
    </div>
</template>

<script setup>
import Navbar from '../components/Navbar.vue';
import { ref, computed, watch } from 'vue';
import { useUserStore } from '../stores/userStore';

//子页面
import UserInfo from './UserInfo.vue';
import UserManage from './UserManage.vue';
import BookManage from './BookManage.vue';
import AdminLog from './AdminLog.vue';
import MyBorrows from './MyBorrows.vue';
import BookShelf from './BookShelf.vue';

const userStore = useUserStore();
const userType = computed(() => userStore.userInfo.type);

const activeMenu = ref(localStorage.getItem('activeMenu') || 'info');
watch(activeMenu, (newVal) => {
    localStorage.setItem('activeMenu', newVal);
});

const currentComponent = computed(() => {
    switch (activeMenu.value) {
        case 'info': return UserInfo;
        case'myBorrows': return MyBorrows;
        case'bookshelf': return BookShelf;
        case'userManage': return UserManage;
        case'bookManage': return BookManage;
        case'adminLog' : return AdminLog;
        default: return UserInfo;
    }
});
</script>

<style lang="scss" scoped>
.user-center-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.content-wrapper {
    display: flex;
    flex: 1;
    padding: 20px;
}

/* ==== 侧边栏 ==== */
.sidebar {
    width: 220px;
    border-radius: 12px;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);

    ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
            padding: 12px 16px;
            margin-bottom: 8px;
            cursor: pointer;
            border-radius: 8px;
            transition: all 0.2s ease;
            color: #333;
            text-align: center;
            font-weight: 500;
            box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);

            &.active {
                background-color: #4f79a8;
                color: #fff;
                transform: scale(0.98);
            }

            &:hover:not(.active) {
                background-color: #e6f0ff;
                color: #1a3f78;
            }
        }
    }

    .button-group {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 20px;

        .btn {
            padding: 8px 14px;
            border: none;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            color: white;
        }

        .home {
            background-color: #3182ce;

            &:hover {
                background-color: #2b6cb0;
            }
        }
    }
}

.main-content {
    flex: 1;
    margin-left: 20px;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
    min-height: 400px;
}
</style>
