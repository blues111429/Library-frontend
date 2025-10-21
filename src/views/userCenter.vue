<template>
    <div class="user-center-page">
        <Navbar />

        <div class="content-wrapper">
            <aside class="sidebar">
                <ul>
                    <li :class="{ active: activeMenu === 'info' }" @click="activeMenu='info'">用户信息</li>
                    <li :class="{ active: activeMenu === 'bookshelf'}" @click="activeMenu='bookshelf'">我的书架</li>
                    <li :class="{ active: activeMenu === 'history' }" @click="activeMenu='history'">借阅历史</li>
                    <li :class="{ active: activeMenu === 'edit' }" @click="activeMenu='edit'">修改信息</li>
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
import { ref, computed } from 'vue';
import UserInfo from './UserInfo.vue';

const activeMenu = ref('info');

const currentComponent = computed(() => {
    switch(activeMenu.value) {
        case 'info': return UserInfo;
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
    border-color: #f5f7fa;
}

.sidebar {
    width: 200px;
    border-color: #ffffff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

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

            &.active {
                background-color: #4f79a8;
                color: #fff;
            }

            &:hover:not(.active) {
                background-color: #e6f0ff;
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
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    min-height: 400px;
}
</style>