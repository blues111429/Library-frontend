<template>
    <div class="borrow-record-page">
        <h2>我的借阅记录</h2>

        <div v-if="loading" class="loading">加载中...</div>

        <div v-else>
            <table class="records-table">
                <thead>
                    <tr>
                        <th>书名</th>
                        <th>借阅日期</th>
                        <th>应还日期</th>
                        <th>状态</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="record in records" :key="record.id">
                        <td>
                            <router-link :to="`/book/${record.bookId}`" class="book-link">
                                {{ record.bookTitle }}
                            </router-link>
                        </td>
                        <td>{{ formatDate(record.borrowDate) }}</td>
                        <td>{{ formatDate(record.dueDate) }}</td>
                        <td>
                            <span :class="statusClass(record.status)">
                                {{ statusText(record.status) }}
                            </span>
                        </td>
                        <td>
                            <button v-if="record.status === 'borrowed'" class="return-btn"
                                @click="returnBook(record.id)">
                                归还
                            </button>
                            <span v-else>-</span>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div v-if="records.length === 0" class="no-records">暂无借阅记录</div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';

const records = ref([]);
const loading = ref(true);

const formatDate = t => (t ? new Date(t).toLocaleString() : '-');

const statusText = status => {
    switch (status) {
        case 'borrowed':
            return '借阅中';
        case 'returned':
            return '已归还';
        case 'overdue':
            return '已逾期';
        default:
            return status;
    }
};

const statusClass = status => {
    switch (status) {
        case 'borrowed':
            return 'status-borrowed';
        case 'returned':
            return 'status-returned';
        case 'overdue':
            return 'status-overdue';
        default:
            return '';
    }
};

// 加载借阅记录
const loadRecords = async () => {
    loading.value = true;
    try {
        const response = await api.get('/book/borrowList');
        if (response.code === 200) {
            records.value = response.data;
        }
    } catch (err) {
        console.error(err);
    } finally {
        loading.value = false;
    }
};

// 归还图书
const returnBook = async id => {
    try {
        const res = await api.post('/book/return', { id });
        if (res.code === 200) {
            alert('归还成功');
            loadRecords(); // 更新列表
        } else {
            alert(res.message || '归还失败');
        }
    } catch (err) {
        console.error(err);
        alert('归还失败，请重试');
    }
};

onMounted(() => {
    loadRecords();
});
</script>

<style scoped lang="scss">
.borrow-record-page {
    h2 {
        color: #1e3a8a;
        margin-bottom: 20px;
    }

    .loading {
        font-size: 16px;
        color: #555;
    }

    .records-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0 8px; // 行间距
        font-size: 14px;

        th {
            text-align: center;
            background-color: #f4f6f8;
            color: #333;
            padding: 12px;
            font-weight: 600;
            border: 1px solid #eee; // 表头边框
            border-radius: 6px 6px 0 0;
        }

        td {
            padding: 12px;
            background-color: #fff;
            color: #444;
            border: 1px solid #eee; // 给单元格加边框
            border-radius: 6px;
        }

        tr {
            background: transparent;
        }

        .book-link {
            color: #2563eb;
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        }
    }

    .status-borrowed {
        color: #2563eb;
        font-weight: 600;
    }

    .status-returned {
        color: #16a34a;
        font-weight: 600;
    }

    .status-overdue {
        color: #dc2626;
        font-weight: 600;
    }

    .return-btn {
        padding: 6px 14px;
        border: none;
        border-radius: 6px;
        background-color: #2563eb;
        color: #fff;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
            background-color: #1e40af;
            transform: translateY(-1px);
        }
    }

    .no-records {
        margin-top: 20px;
        text-align: center;
        color: #999;
        font-size: 14px;
    }
}
</style>
