<template>
    <h2>📜 管理员操作日志</h2>
    <div class="table-container">
        <table class="log-table">
            <thead>
                <tr>
                    <th>日志ID</th>
                    <th>管理员ID</th>
                    <th>操作内容</th>
                    <th>时间</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="log in logs" :key="log.id">
                    <td>{{ log.log_id }}</td>
                    <td>{{ log.admin_id }}</td>
                    <td>{{ log.action }}</td>
                    <td>{{ formatDate(log.create_time) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import api from '../api';

const logs = ref([]);

const formatDate = t => (t ? new Date(t).toLocaleString() : '-');

onMounted(async ()=> {
    const response = await api.get('/admin/logs');
    console.log(response.data);
    logs.value = response.data.logs || [];
})
</script>

<style lang="scss" scoped>
h2 {
    font-size: 22px;
    margin-bottom: 20px;
    color: #2b4c7e;
    text-align: center;
    font-weight: 600;
}

.table-container {
    max-height: 700px;
    overflow-y: auto;
    border-radius: 10px;
    background: #fafafa;
    padding: 10px;

    
    .log-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 15px;
        text-align: center;

        th,
        td {
            border: 1px solid #ccc;
            padding: 10px 14px;
        }

        th {
            background-color: #f2f2f2;
            color: #2a4265;
            font-weight: 600;
        }
        
        tr:nth-child(even) {
            background-color: #eaf2ff;
        }

        tr:hover {
            background-color: #e6f0ff;
            transition: background-color 0.2s ease;
        }

        td {
            color: #333;
        }
    }
}
</style>