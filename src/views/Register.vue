<template>
    <div class="container">
        <div class="card">
            <h2 class="title">智能图书馆注册</h2>

            <div class="input-container">
                <input v-model="form.phone" placeholder="请输入手机号" />
                <input type="password" v-model="form.password" placeholder="输入密码" />
                <input v-model="form.name" placeholder="输入昵称" />
                <input v-model="form.email" placeholder="请输入邮箱" />

                <div class="select-group">
                    <p>性别:</p>
                    <div class="options">
                        <div 
                            v-for="option in ['男','女']" 
                            :key="option"
                            :class="['option-card', { selected: form.gender === option }]"
                            @click="form.gender = option"
                        >
                            {{ option }}
                        </div>
                    </div>
                </div>

                <div class="select-group">
                    <p>类别:</p>
                    <div class="options">
                        <div 
                            v-for="option in [{label:'学生', value:'student'}, {label:'教师', value:'teacher'}]" 
                            :key="option.value"
                            :class="['option-card', { selected: form.type === option.value }]"
                            @click="form.type = option.value"
                        >
                            {{ option.label }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="buttons">
                <button class="btn register-btn" @click="register">注册</button>
                <button class="btn login-btn" @click="goLogin">登录</button>
                <button class="btn home-btn" @click="toHome">主页</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';
import { useNavigation } from '../utils/navigation';

const router = useRouter();
const { toHome } = useNavigation();

const form = ref({
    phone: '',
    password: '',
    name: '',
    gender: '',
    type: '',
    email: ''
});

const register = async () => {

    const requiredFields = [
        { key: 'phone', label: '手机号' },
        { key: 'password', label: '密码' },
        { key: 'name', label: '昵称' },
        { key: 'gender', label: '性别' },
        { key: 'type', label: '类别' },
        { key: 'email', label: '邮箱' },
    ];

    for (const field of requiredFields) {
        const value = form.value[field.key];
        if (!value || (typeof value === 'string' && !value.trim())) {
            alert(`请输入${field.label}`);
            return ;
        }
    }

    try {
        const data = {
            phone: form.value.phone,
            password: form.value.password,
            name: form.value.name,
            gender: form.value.gender,
            type: form.value.type,
            email: form.value.email
        };
        const response = await api.post('/user/register', data);
        alert(response.message);

        if (response.data) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.userId);

            router.push('/login');
        }
    } catch (err) {
        console.error('注册失败', err);
        alert('注册失败，请重试');
    }
};

const goLogin = () => {
    router.push('/login');
};
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

            .select-group {
                display: flex;
                flex-direction: column;
                gap: 8px;
                text-align: center;

                p {
                    margin: 0;
                    font-size: 16px;
                    color: #333;
                }

                .options {
                    display: flex;
                    gap: 12px;
                    justify-content: center;

                    .option-card {
                        padding: 8px 16px;
                        border: 2px solid #ccc;
                        border-radius: 12px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        user-select: none;

                        &:hover {
                            border-color: #4f79a8;
                            background-color: rgba(79, 121, 168, 0.1);
                        }

                        &.selected {
                            border-color: #4f79a8;
                            background-color: #4f79a8;
                            color: white;
                            font-weight: 500;
                        }
                    }
                }
            }
        }

        .buttons {
            display: flex;
            flex-direction: column;
            gap: 16px;

            .btn {
                flex: 1;
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

                &.register-btn {
                    background-color: #6ba4d9;

                    &:hover {
                        background-color: #5493c1;
                    }
                }

                &.login-btn {
                    background-color: #4f79a8;

                    &:hover {
                        background-color: #3b66a0;
                    }
                }

                &.home-btn {
                    background-color: #38a169;

                    &:hover {
                        background-color: #2f855a;
                    }
                }
            }
        }
    }
}

@media (max-width: 480px) {
    .container .card {
        padding: 30px 20px;

        .input-container input {
            width: 100%;
        }

        .buttons {
            flex-direction: column;

            .btn {
                width: 100%;
            }
        }

        .select-group .options {
            flex-wrap: wrap;
        }
    }
}
</style>
