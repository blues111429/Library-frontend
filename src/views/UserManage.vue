<template>
    <div class="admin-container">
        <h2 class="title">用户管理</h2>

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

            <button class="add-btn" @click="openAddUserModal">➕ 新增用户</button>
        </div>

        <!-- 用户表格 -->
        <div class="user-table-container">
            <table class="user-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>姓名</th>
                        <th>性别</th>
                        <th>类别</th>
                        <th>手机号</th>
                        <th>邮箱</th>
                        <th>状态</th>
                        <th>注册时间</th>
                        <th>最后登录</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in userList" :key="user.user_id">
                        <td>{{ user.user_id }}</td>
                        <td>{{ user.name }}</td>
                        <td>{{ user.gender }}</td>
                        <td>{{ user.typeCn }}</td>
                        <td>{{ user.phone }}</td>
                        <td>{{ user.email }}</td>
                        <td>
                            <span :class="['status', user.status === 1 ? 'active' : 'disabled']">
                                {{ user.status === 1 ? '正常' : '禁用' }}
                            </span>
                        </td>
                        <td>{{ formatDate(user.create_time) }}</td>
                        <td>{{ formatDate(user.last_login) }}</td>
                        <td class="actions">
                            <button class="action edit" @click="openEditUserModal(user)">编辑</button>
                            <button class="action danger" @click="deleteUser(user.user_id)">删除</button>
                            <button class="action toggle" :class="user.status === 1 ? 'disable' : 'enable'" @click="toggleUserStatus(user)">
                                {{ user.status === 1 ? '禁用' : '启用' }}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 新增/编辑弹窗 -->
        <transition name="fade-scale">
            <div v-if="showModal" class="modal-overlay">
                <div class="modal-card">
                    <h3>{{ isEdit ? '编辑用户' : '新增用户' }}</h3>
                    <div class="form">
                        <label>姓名</label>
                        <input v-model="editUser.name" placeholder="姓名" />

                        <label>手机号</label>
                        <input v-model="editUser.phone" placeholder="手机号" />

                        <label>邮箱</label>
                        <input v-model="editUser.email" placeholder="邮箱" />

                        <label>性别</label>
                        <select v-model="editUser.gender">
                            <option value="男">男</option>
                            <option value="女">女</option>
                        </select>

                        <label>类别</label>
                        <select v-model="editUser.type">
                            <option value="student">学生</option>
                            <option value="teacher">教师</option>
                            <option value="admin">管理员</option>
                        </select>
                    </div>

                    <div class="modal-btns">
                        <button class="btn confirm" @click="submitUser">{{ isEdit ? '保存修改' : '确认新增' }}</button>
                        <button class="btn cancel" @click="closeModal">取消</button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';

const allUsers = ref([]);
const userList = ref([]);
const filter = ref({ type: '', gender: '', status: '' });

const showModal = ref(false);
const isEdit = ref(false);
const editUser = ref({
    user_id: '',
    name: '',
    phone: '',
    gender: '男',
    email: '',
    type: 'student'
});

const formatDate = t => (t ? new Date(t).toLocaleString() : '-');

const loadUsers = async () => {
    const res = await api.get('/admin/userList');
    allUsers.value = res.data || [];
    applyFilter();
};

const toggleUserStatus = async user => {
    const newStatus = user.status === 1 ? 0 : 1;
    const message = newStatus === 0 ? '确定禁用该账号吗?' : '确定启用该账号吗?';
    if(confirm(message)) {
        await api.post('/admin/updateUserStatus', { userId: user.user_id, status: newStatus });
        await loadUsers();
    }
}

const applyFilter = () => {
    userList.value = allUsers.value.filter(u => {
        return (!filter.value.type || u.typeCn === filter.value.type)
            &&(!filter.value.gender || u.gender === filter.value.gender)
            &&(!filter.value.status || String(u.status) === filter.value.status)
    })
};

const openAddUserModal = () => {
    isEdit.value = false;
    showModal.value = true;
    editUser.value = { gender: '男', type: 'student' };
};

const openEditUserModal = user => {
    isEdit.value = true;
    showModal.value = true;
    editUser.value = { ...user };
};

const closeModal = () => (showModal.value = false);

const submitUser = async () => {
    const endpoint = isEdit.value ? '/admin/editUser' : '/admin/addUser';
    await api.post(endpoint, editUser.value);
    await loadUsers();
    closeModal();
};

const deleteUser = async id => {
    if (confirm('确定删除该用户吗？')) {
        await api.post('/admin/deleteUser', { userId: id });
        await loadUsers();
    }
};

onMounted(loadUsers);
</script>

<style lang="scss" scoped>
.admin-container {
    background: #fff;
    padding: 20px;
    border-radius: 12px;
}

.title {
    text-align: center;
    font-size: 22px;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 16px;
}

.filter-container {
    display: flex;
    gap: 20px;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 20px;

    select {
        padding: 5px 10px;
        border-radius: 6px;
        border: 1px solid #ccc;
    }

    .add-btn {
        background: #4f79a8;
        color: white;
        border: none;
        border-radius: 6px;
        padding: 6px 12px;
        cursor: pointer;

        &:hover {
            background: #3c5f8b;
        }
    }
}

.user-table-container {
    max-height: 600px;           /* 容器最大高度，可按需求调整 */
    overflow-y: auto;            /* 超出时显示垂直滚动条 */
    border: 1px solid #ddd;
    border-radius: 8px;
}

/* 固定表头 */
.user-table thead {
    position: sticky;
    top: 0;
    background: #f4f6fa;        /* 表头背景色 */
    z-index: 1;
}

/* 表格样式保持原样 */
.user-table {
    width: 100%;
    border-collapse: collapse;
    th, td {
        padding: 10px;
        border: 1px solid #ddd;
        text-align: center;
    }

    th {
        background: #f4f6fa;
    }

    .status {
        padding: 4px 10px;
        border-radius: 8px;
        color: white;
        font-size: 13px;
        &.active { background: #28a745; }
        &.disabled { background: #dc3545; }
    }

    .actions .action {
        margin: 0 4px;
        padding: 5px 8px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        transition: 0.2s;

        &.edit { background: #4f79a8; color: white; }
        &.danger { background: #b22222; color: white; }
    }

    .actions .action.toggle {
        &.disable { background-color: #dc3545; color: white; }
        &.enable { background-color: #28a745; color: white; }
    }
}

/* 弹窗样式 */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.4);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-card {
    background: white;
    border-radius: 10px;
    padding: 20px;
    width: 400px;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 10px;

    input, select {
        padding: 6px;
        border-radius: 6px;
        border: 1px solid #ccc;
    }
}

.modal-btns {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;

    .btn {
        flex: 1;
        margin: 0 5px;
        border: none;
        border-radius: 6px;
        color: white;
        padding: 8px;
        cursor: pointer;

        &.confirm { background: #4f79a8; }
        &.cancel { background: #777; }
    }
}
</style>
