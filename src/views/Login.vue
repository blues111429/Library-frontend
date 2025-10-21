<template>
    <div class="container">
        <div class="card">
            <h2 class="title">智能图书馆登录</h2>

            <div class="input-container">
                <input v-model="phone" placeholder="请输入手机号" />
                <input type="password" v-model="password" placeholder="请输入密码" />
            </div>

            <div class="buttons">
                <button class="btn login-btn" @click="login" :disabled="loading">
                    <span v-if="!loading">登录</span>
                    <div v-else class="spinner"></div>
                </button>
                <button class="btn register-btn" @click="$router.push('/register')">注册</button>
                <button class="btn home-btn" @click="$router.push('/')">主页</button>
            </div>
        </div>

        <BaseToast ref="toastRef" />
    </div>

    <BaseToast ref="toastRef" />
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api.js';
import BaseToast from '../components/Toast.vue';    

const phone = ref('');
const password = ref('');
const loading = ref(false)

const toastRef = ref(null);
const router = useRouter();

const login = async () => {

    if(!phone.value) {
        toastRef.value?.showToast('请输入手机号', 'warning');
        return ;
    }

    if(!password.value) {
        toastRef.value?.showToast('请输入密码', 'warning');
        return ;
    }

    loading.value = true;

    try {
        const data = { phone: phone.value, password: password.value };
        const response = await api.post('/user/login', data);

        if(response.data) {
            const typeCn = response.data.typeCn;

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', response.data.username);
            localStorage.setItem('name', response.data.name);

            console.log(response.data.name);
            console.log("登录成功,当前用户信息:userToken:", response.data.token, "phone:", response.data.phone);
            
            toastRef.value?.showToast(response.message, 'success');

            setTimeout(() => {
                if (typeCn === '学生' || typeCn === '教师') {
                    router.push('/userInfo');
                } else if (typeCn === '管理员') {
                    router.push('/admin');
                }
            }, 1500);
            
        } else {
            toastRef.value?.showToast(response.message, 'warning');
        }
    } catch( err ) {
        toastRef.value?.showToast(err, 'error');
        console.log('catch 捕获:', err);
    } finally {
        setTimeout(()=> {
            loading.value = false;
        }, 1000);
    }
}
</script>

<style lang="scss" scoped>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #4f79a8, #6ba4d9);
    padding: 20px;

    .card {
        background: #fff;
        padding: 40px 30px;
        border-radius: 16px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 400px;
        text-align: center;

        .title {
            font-size: 24px;
            font-weight: 600;
            color: #333;
            margin-bottom: 30px;
        }

        .input-container {
            display: flex;
            flex-direction: column;
            gap: 16px;
            margin-bottom: 30px;

            input {
                height: 44px;
                padding: 0 14px;
                font-size: 16px;
                border: 1px solid #ccc;
                border-radius: 12px;
                outline: none;
                transition: all 0.3s ease;

                &:focus {
                    border-color: #4f79a8;
                    box-shadow: 0 0 8px rgba(79, 121, 168, 0.3);
                }

                &:hover {
                    background-color: #fff;
                    box-shadow: 0 0 5px rgba(79, 121, 168, 0.2);
                }
            }
        }

        .buttons {
            display: flex;
            flex-direction: column;
            gap: 16px;

            .btn {
                height: 44px;
                border: none;
                border-radius: 12px;
                font-size: 16px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                color: #fff;
                display: flex;
                justify-content: center;
                align-items: center;

                &:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                &.login-btn {
                    background-color: #4f79a8;

                    &:hover:not(:disabled) {
                        background-color: #3b66a0;
                    }
                }

                &.register-btn {
                    background-color: #6ba4d9;

                    &:hover {
                        background-color: #5493c1;
                    }
                }

                &.home-btn {
                    background-color: #38a169;

                    &:hover {
                        background-color: #2f855a;
                    }
                }

                .spinner {
                    width: 20px;
                    height: 20px;
                    border: 3px solid rgba(255, 255, 255, 0.5);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
            }
        }
    }
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>