<template>
    <div class="admin-container">
        <h2 class="title">管理员页面</h2>
        <div class="btn-container">
            <button class="btn" @click="toHome">返回主页</button>
            <button class="btn" @click="toUserInfo">查看个人信息</button>
            <button class="btn" @click="addUser">新增用户</button>
        </div>
        <table class="user-table">
            <thead>
                <tr>
                    <th>用户ID</th>
                    <th>用户名</th>
                    <th>姓名</th>
                    <th>性别</th>
                    <th>类别</th>
                    <th>电话</th>
                    <th>邮箱</th>
                    <th>状态</th>
                    <th>注册时间</th>
                    <th>最后登录</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="user in userList" :key="user.userId">
                    <td>{{ user.user_id }}</td>
                    <td>{{ user.username }}</td>
                    <td>{{ user.name }}</td>
                    <td>{{ user.gender }}</td>
                    <td>{{ user.typeCn }}</td>
                    <td>{{ user.phone }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.status === 1 ? "正常":"禁用" }}</td>
                    <td>{{ formatDate(user.create_time) }}</td>
                    <td>{{ formatDate(user.last_login) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../api";
import { useNavigation } from '../utils/navigation';

const userList = ref([]);
const { toHome, toUserInfo } = useNavigation();

const formatDate = (time) => {
    if(!time) return '-';
    const date = new Date(time);
    return date.toLocaleString();
};

const loadUsers = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await api.get('/user/userList');
        console.log(response);

        userList.value = response.data
    } catch (err) {
        console.log(err);
    }
};

const addUser = async () => {
    try {
        const username = localStorage.getItem('username');
        console.log(username);
    } catch (err) {
        console.log(err);
    }
};

onMounted(()=> {
    loadUsers();
});

</script>

<style lang="scss" scoped>
.admin-container {
    padding: 20px;
    max-width: 1100px;
    margin: 0 auto;
}

.btn-container {
    display: flex;
    margin-bottom :20px;
    gap: 40px;
}

.btn {
    background-color: #7a1a17;
    color: white;
    font-size: 16px;
}

.title {
    text-align: center;
    margin-bottom: 20px;
}

.user-table {
    width: 100%;
    border-collapse: collapse;
    background: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

    th, td {
        padding: 10px 12px;
        border: 1px solid #ddd;
        text-align: center;
        width: 50px;
    }

    th {
        background-color: #f5f5f5;
        font-weight: bold;
    }

    tr:hover {
        background-color: #f9f9f9;
    }
}
</style>