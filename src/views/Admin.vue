<template>
    <div class="admin-container">
        <h2 class="title">管理员页面</h2>
        <div class="btn-container">
            <button class="btn" @click="toHome">返回主页</button>
            <button class="btn" @click="toUserInfo">查看个人信息</button>
            <button class="btn" @click="openAddUserModal">新增用户</button>
        </div>
        <div class="filter-container">
            <label>类别:
                <select v-model="filter.type" @change="applyFilter">
                    <option value="">全部</option>
                    <option value="学生">学生</option>
                    <option value="教师">教师</option>
                    <option value="管理员">管理员</option>
                </select>
            </label>

            <label>性别:
                <select v-model="filter.gender" @change="applyFilter">
                    <option value="">全部</option>
                    <option value="男">男</option>
                    <option value="女">女</option>
                </select>
            </label>

            <label>状态:
                <select v-model="filter.status" @change="applyFilter">
                    <option value="">全部</option>
                    <option value="1">正常</option>
                    <option value="0">禁用</option>
                </select>
            </label>
        </div>

        <!-- 用户表格 -->
        <div class="user-table-container">
            <table class="user-table">
                <thead>
                    <tr>
                        <th>用户ID</th>
                        <th>姓名</th>
                        <th>性别</th>
                        <th>类别</th>
                        <th>电话</th>
                        <th>邮箱</th>
                        <th>状态</th>
                        <th>注册时间</th>
                        <th>最后登录</th>
                        <th>状态更新时间</th>
                        <th>用户管理</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="user in userList" :key="user.userId">
                        <td>{{ user.user_id }}</td>
                        <td>{{ user.name }}</td>
                        <td>{{ user.gender }}</td>
                        <td>{{ user.typeCn }}</td>
                        <td>{{ user.phone }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.status === 1 ? "正常":"禁用" }}</td>
                        <td>{{ formatDate(user.create_time) }}</td>
                        <td>{{ formatDate(user.last_login) }}</td>
                        <td>{{ formatDate(user.status_update_time) }}</td>
                        <td>
                            <button class="action-btn disable" v-if="user.status === 1" @click="updateUserStatus(user.user_id, 0)">禁用</button>
                            <button class="action-btn enable" v-else @click="updateUserStatus(user.user_id, 1)">启用</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 新增用户 -->
        <transition name="fade-scale">
            <div v-if="showAddModal" class="modal-overlay">
                <div class="modal-card">
                    <h3>新增用户</h3>
                    <div class="form">
                        <label>姓名：</label>
                        <input v-model="newUser.name" type="text" placeholder="请输入姓名" />

                        <label>性别：</label>
                        <select v-model="newUser.gender">
                            <option value="男">男</option>
                            <option value="女">女</option>
                        </select>

                        <label>类别：</label>
                        <select v-model="newUser.type">
                            <option value="student">学生</option>
                            <option value="teacher">老师</option>
                            <option value="admin">管理员</option>
                        </select>

                        <label>电话：</label>
                        <input v-model="newUser.phone" type="text" placeholder="请输入手机号" />

                        <label>邮箱：</label>
                        <input v-model="newUser.email" type="email" placeholder="请输入邮箱" />

                        <label>密码：</label>
                        <input v-model="newUser.password" type="password" placeholder="请输入密码" />
                    </div>
                    <div class="modal-btns">
                        <button class="btn confirm" @click="submitAddUser">确定</button>
                        <button class="btn cancel" @click="closeAddUserModal">取消</button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../api";
import { useNavigation } from '../utils/navigation';

const rawUserList = ref([]);
const userList = ref([]);
const { toHome, toUserInfo } = useNavigation();

const filter = ref({
    type: "",
    gender: "",
    status: "",
})

const showAddModal = ref(false);
const newUser = ref({
    phone: "",
    password: "",
    name: "",
    gender: "男",
    type: "student",
    email: "",
});

//日期格式
const formatDate = (time) => {
    if(!time) return '-';
    const date = new Date(time);
    return date.toLocaleString();
};
//加载用户列表
const loadUsers = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await api.get('/user/userList');
        console.log(response);

        rawUserList.value = response.data || [];
        applyFilter();
    } catch (err) {
        console.log(err);
    }
};
//根据筛选条件过滤
const applyFilter = () => {
    userList.value = rawUserList.value.filter(user => {
        const typeMatch = !filter.value.type || user.typeCn === filter.value.type;
        const genderMatch = !filter.value.gender || user.gender === filter.value.gender;
        const statusMatch = !filter.value.status || user.status === Number(filter.value.status);
        return typeMatch && genderMatch && statusMatch;
    })
}
//更新用户账号状态
const updateUserStatus = async (user_id, newStatus) => {
    try {
        console.log(user_id, newStatus);
        const response = await api.post('/user/updateUserStatus', {
            userId: user_id,
            status: newStatus
        });

        if(response.code === 200 || response.data?.code === 200) {
            alert('修改成功');
            await loadUsers();
        } else {
            console.log(response);
            alert(response.message || "修改失败");
        }
    } catch (err) {
        console.log('修改用户状态出错:', err);
    }
}
//打开新增用户窗口
const openAddUserModal = () => {
    showAddModal.value = true;
};
//关闭窗口
const closeAddUserModal = () => {
    showAddModal.value = false;
    newUser.value = {
        phone: "",
        password: "",
        name: "",
        gender: "男",
        type: "student",
        email: "",
    };
};
//新增用户
const submitAddUser = async () => {
    try {
        const response = await api.post('/user/addUser', newUser.value);
        if (response.code === 200) {
            alert('新增成功');
            closeAddUserModal();
            await loadUsers();
        } else {
            console.log(response);
            alert(response.message || '新增失败');
        }
    } catch (err) {
        console.log("新增用户出错", err);
        console.log(response);
        alert("服务器出错,请稍后再试");
    }
}

onMounted(()=> {
    loadUsers();
});

</script>

<style lang="scss" scoped>
.admin-container {
    padding: 20px;
    max-width: 1500px;
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

.filter-container {
    display: flex;
    gap: 20px;
    margin-bottom: 15px;

    label {
        font-weight: 600;
        select {
            margin-left: 5px;
            padding: 4px 6px;
            border-radius: 4px;
            border: 1px solid #ccc;
        }
    }
}

.title {
    text-align: center;
    margin-bottom: 20px;
}

.user-table-container {
    max-height: 600px;
    overflow-y: auto;
    margin-top: 20px;
    border: 1px solid #ddd;
    border-radius: 6px;
    background: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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
        width: 150px;
    }

    th {
        background-color: #f5f5f5;
        font-weight: bold;
        position: sticky;
        top: 0;
        z-index: 2;
    }

    tr:hover {
        background-color: #f9f9f9;
    }
}

.action-btn {
    padding: 4px 8px;
    border: none;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
    font-size: 14px;
    transition: 0.2s;

    &.disable {
        background-color: red;
    }

    &.enable {
        background-color: green;
    }

    &.hover {
        opacity: 0.8;
    }
}

.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}

.modal-card {
    background: #fff;
    padding: 25px 30px;
    border-radius: 12px;
    width: 400px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    animation: pop-in 0.25s ease;
}

@keyframes pop-in {
    from {
        transform: scale(0.9);
        opacity: 0;
    }

    to {
        transform: scale(1);
        opacity: 1;
    }
}

.modal-content h3 {
    text-align: center;
    margin-bottom: 20px;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 12px;

    label {
        font-weight: 600;
    }

    input,
    select {
        padding: 8px 10px;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 14px;
    }

    input:focus,
    select:focus {
        border-color: #7a1a17;
        outline: none;
    }
}

.modal-btns {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;

    .btn {
        flex: 1;
        margin: 0 5px;
        border: none;
        border-radius: 6px;
        color: #fff;
        font-size: 15px;
        padding: 8px;
        cursor: pointer;

        &.confirm {
            background-color: #7a1a17;
        }

        &.cancel {
            background-color: #666;
        }

        &:hover {
            opacity: 0.9;
        }
    }
}

.fade-scale-enter-active,
.fade-scale-leave-active {
    transition: all 0.25s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
    opacity: 0;
    transform: scale(0.9);
}
</style>