<template>
    <div class="book-detail-page">
        <Navbar />

        <div class="content-wrapper">
            <!-- 返回按钮 -->
            <button class="back-btn" @click="goBack">← 返回</button>

            <!-- 加载状态 -->
            <div v-if="loading" class="loading">正在加载图书信息...</div>

            <!-- 图书详情 -->
            <div v-else-if="book" class="detail-card">
                <div class="book-main">
                    <img :src="`https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`" alt="封面" class="cover" />

                    <div class="info">
                        <h2 class="title">{{ book.title }}</h2>
                        <p class="author">作者：{{ book.author }}</p>
                        <p class="publisher">出版社：{{ book.publisher }} | 出版年份：{{ book.publishYear }}</p>
                        <p class="isbn">ISBN：{{ book.isbn }}</p>
                        <p class="category">分类：{{ categoryName }}</p>

                        <p class="description" v-if="book.description">{{ book.description }}</p>

                        <div class="copies-status">
                            <span class="total">总册数：{{ book.totalCopies }}</span>
                            <span class="available" :class="book.availableCopies > 0 ? 'in-stock' : 'out-of-stock'">
                                可借数量：{{ book.availableCopies }}
                            </span>
                        </div>

                        <button class="borrow-btn" :disabled="book.status !== 1 || book.availableCopies <= 0"
                            @click="borrowBook"
                            :title="book.status !== 1 ? '该图书已下架，暂不可借阅' : (book.availableCopies <= 0 ? '图书库存不足,不可借阅' : '借阅此书')">
                            {{ book.status !== 1 ? '已下架' : (book.availableCopies <= 0 ? '无可借库存' : '借阅此书') }} </button>

                    </div>
                </div>

                <div class="stats">
                    <span>浏览：{{ book.viewCount }}</span>
                    <span>借阅：{{ book.borrowCount }}</span>
                    <span class="status" :class="book.status === 1 ? 'on' : 'off'">
                        {{ book.status === 1 ? '上架中' : '已下架' }}
                    </span>
                </div>

                <!-- 静态评论区 -->
                <div class="comments-section">
                    <h3>评论区</h3>

                    <!-- 添加新评论 -->
                    <div class="add-comment">
                        <textarea v-model="newComment" placeholder="写下你的评论..." rows="3"></textarea>
                        <button @click="addComment" :disabled="!newComment.trim()">发布评论</button>
                    </div>

                    <!-- 评论列表 -->
                    <div class="comment-list">
                        <div class="comment-item" v-for="(c, index) in comments" :key="index">
                            <div class="user">{{ c.user }}</div>
                            <div class="time">{{ c.time }}</div>
                            <div class="content">{{ c.content }}</div>
                        </div>
                    </div>

                    <div v-if="comments.length === 0" class="no-comments">暂无评论，快来评论吧！</div>
                </div>
            </div>

            <div v-else>
                <p class="not-found">未找到该图书。</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../api';
import Navbar from '../components/Navbar.vue';
import { useUserStore } from '../stores/userStore';

const route = useRoute();
const router = useRouter();
const bookId = route.params.id;

const book = ref(null);
const categoryName = ref('-');
const loading = ref(true);

const userStore = useUserStore();

// 评论数据（静态）
const newComment = ref('');
const comments = ref([
    { user: '李四', time: '2025-10-29 10:30', content: '这本书很有用！' },
    { user: '王五', time: '2025-10-28 14:20', content: '内容讲解得很清楚，推荐阅读。' }
]);

// 获取图书详情
const loadBookDetail = async () => {
    try {
        const response = await api.get(`/book/${bookId}`);
        if (response.code === 200 && response.data) {
            book.value = response.data;

            if (book.value.categoryId) {
                const categoryRes = await api.get('/category/categoryList');
                const cat = categoryRes.data.find(c => c.id === book.value.categoryId);
                categoryName.value = cat ? cat.name : '-';
            }
        } else {
            book.value = null;
        }
    } catch (err) {
        console.error('获取图书详情失败:', err);
        book.value = null;
    } finally {
        loading.value = false;
    }
};

// 返回
const goBack = () => router.back();

// 借阅逻辑
const borrowBook = async () => {
    if (!userStore.isLoggedIn) {
        alert('请先登录！');
        router.push('/login');
        return;
    }
    if (book.value.status !== 1) {
        alert('该图书已下架，暂不可借阅');
    }
    if (book.value.availableCopies <= 0) {
        alert('图书库存不足,不可借阅');
    }
    console.log(book.value);
    try {
        const response = await api.post('/book/borrow', { bookId: book.value.id });
        if (response.code === 200) {
            alert('借阅成功！');
            await loadBookDetail(); // 更新库存
        } else {
            alert(response.message || '借阅失败');
        }
    } catch (err) {
        console.error(err);
        alert('借阅失败，请重试');
    }
};

// 前端模拟添加评论
const addComment = () => {
    if (!newComment.value.trim()) return;
    comments.value.unshift({
        user: '我',
        time: new Date().toLocaleString(),
        content: newComment.value.trim()
    });
    newComment.value = '';
};

onMounted(() => {
    loadBookDetail();
});
</script>

<style scoped lang="scss">
.book-detail-page {
    width: 100%;
    background: linear-gradient(to bottom, #f7f9fc, #f0f4f8);

    .content-wrapper {
        max-width: 1100px;
        margin: 0 auto;
        padding: 30px 20px 60px;
    }

    .back-btn {
        background: none;
        border: none;
        color: #2b4c7e;
        cursor: pointer;
        font-size: 15px;
        margin-bottom: 24px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        transition: all 0.2s ease;

        &:hover {
            color: #1a3366;
            transform: translateX(-3px);
        }
    }

    .detail-card {
        background: #ffffff;
        border-radius: 16px;
        padding: 30px 40px;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
        display: flex;
        flex-direction: column;
        gap: 30px;
        transition: 0.3s ease;

        &:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
        }

        .book-main {
            display: flex;
            gap: 40px;
            flex-wrap: wrap;

            .cover {
                width: 220px;
                height: 320px;
                object-fit: cover;
                border-radius: 10px;
                border: 1px solid #e0e0e0;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
                transition: transform 0.25s;

                &:hover {
                    transform: scale(1.03);
                }
            }

            .info {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding: 5px 0;

                .title {
                    font-size: 28px;
                    color: #1e3a8a;
                    margin-bottom: 14px;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                }

                p {
                    margin: 6px 0;
                    font-size: 15px;
                    color: #444;
                    line-height: 1.5;
                }

                .description {
                    margin: 18px 0;
                    font-size: 14.5px;
                    color: #555;
                    background: #f9fafc;
                    border-left: 4px solid #3182ce;
                    padding: 12px 14px;
                    border-radius: 6px;
                    line-height: 1.6;
                }

                .copies-status {
                    display: flex;
                    gap: 24px;
                    margin: 14px 0;
                    font-size: 15px;
                    font-weight: 600;

                    .available.in-stock {
                        color: #16a34a;
                    }

                    .available.out-of-stock {
                        color: #dc2626;
                    }
                }

                .borrow-btn {
                    width: fit-content;
                    margin-top: 15px;
                    padding: 12px 24px;
                    background-color: #2563eb;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                    transition: all 0.25s ease;

                    &:hover:enabled {
                        background-color: #1e40af;
                        transform: scale(1.05);
                    }

                    &:disabled {
                        background-color: #a1a1aa;
                        cursor: not-allowed;
                    }
                }
            }
        }

        .stats {
            display: flex;
            gap: 40px;
            font-size: 14px;
            color: #666;
            border-top: 1px solid #eee;
            padding-top: 14px;

            .status.on {
                color: #16a34a;
                font-weight: bold;
            }

            .status.off {
                color: #dc2626;
                font-weight: bold;
            }
        }

        /* 评论区样式 */
        .comments-section {
            margin-top: 40px;
            border-top: 1px solid #e3e6eb;
            padding-top: 30px;

            h3 {
                font-size: 22px;
                color: #1e3a8a;
                margin-bottom: 20px;
                font-weight: 700;
            }

            .add-comment {
                display: flex;
                flex-direction: column;
                gap: 12px;

                textarea {
                    width: 100%;
                    min-height: 70px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    padding: 12px;
                    font-size: 14px;
                    transition: border-color 0.2s, box-shadow 0.2s;

                    &:focus {
                        outline: none;
                        border-color: #3182ce;
                        box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.2);
                    }
                }

                button {
                    align-self: flex-end;
                    padding: 8px 22px;
                    background-color: #2563eb;
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.25s ease;

                    &:hover:enabled {
                        background-color: #1e40af;
                        transform: translateY(-1px);
                    }

                    &:disabled {
                        background-color: #a1a1aa;
                        cursor: not-allowed;
                    }
                }
            }

            .comment-list {
                margin-top: 25px;
                display: flex;
                flex-direction: column;
                gap: 18px;

                .comment-item {
                    padding: 16px 18px;
                    border-radius: 10px;
                    background-color: #f9fafb;
                    border: 1px solid #e5e7eb;
                    transition: box-shadow 0.2s ease;

                    &:hover {
                        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
                    }

                    .user {
                        font-weight: 600;
                        color: #1e3a8a;
                    }

                    .time {
                        font-size: 12.5px;
                        color: #999;
                        margin-bottom: 6px;
                    }

                    .content {
                        font-size: 14.5px;
                        color: #444;
                        line-height: 1.6;
                    }
                }
            }

            .no-comments {
                margin-top: 15px;
                color: #999;
                font-size: 14px;
                text-align: center;
            }
        }
    }

    .not-found {
        text-align: center;
        font-size: 16px;
        color: #999;
        margin-top: 50px;
    }
}
</style>