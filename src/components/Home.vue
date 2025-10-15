<template>
    <div>
        <h2>主页</h2>
        <div class="btn-container">
            <button class="btn" @click="toLogin">登录</button>
            <button class="btn" @click="toRegister">注册</button>
            <button class="btn" @click="toUserInfo">个人中心</button>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useNavigation } from '../utils/navigation';

const { toLogin, toRegister, toUserInfo } = useNavigation();
</script>

<style lang="scss" scoped>
.btn-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 40px;
}

.btn {
    color: white;
    background-color: #7a1a17;
    width: 200px;
    height: 40px;
    border-radius: 4px;
    font-size: 16px;
}
</style>