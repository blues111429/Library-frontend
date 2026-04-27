<template>
    <div class="bookshelf-page">
        <h2>我的书架</h2>

        <div v-if="loading" class="loading">加载中...</div>

        <div v-else>
            <div v-if="books.length === 0" class="no-books">你的书架还没有图书 😅</div>

            <div v-else class="books-list">
                <div class="book-card" v-for="book in pagedBooks" :key="book.id">
                    <img :src="`https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`" alt="封面" class="cover" />
                    <div class="info">
                        <h3 class="title">{{ book.title }}</h3>
                        <p class="author">作者：{{ book.author || '未知' }}</p>
                        <p class="category">分类：{{ book.categoryName || '未分类' }}</p>
                        <button class="detail-btn" @click="goDetail(book.id)">查看详情</button>
                    </div>
                </div>
            </div>

            <!-- 分页 -->
            <div v-if="totalPages > 1" class="pagination">
                <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
                <span>第 {{ currentPage }} / {{ totalPages }} 页</span>
                <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>

                <span>跳转到</span>
                <input type="number" v-model.number="jumpPage" min="1" :max="totalPages" @keyup.enter="goPage" />
                <button @click="goPage">跳转</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';

const router = useRouter();
const defaultCover = '/default-cover.png';

// 数据
const books = ref([]);
const loading = ref(true);

// 分页
const currentPage = ref(1);
const pageSize = ref(8);
const jumpPage = ref(1);

// 获取书架数据
const loadBookshelf = async () => {
    loading.value = true;
    try {
        const response = await api.get('/book/bookshelf'); // 后端接口返回用户书架列表
        console.log(response);
        if (response.code === 200) {
            books.value = response.data.map(book => ({
                ...book,
                coverUrl: book.isbn ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg` : defaultCover
            }));
        }
    } catch (err) {
        console.error('获取书架失败', err);
    } finally {
        loading.value = false;
    }
};

// 分页计算
const totalPages = computed(() => Math.ceil(books.value.length / pageSize.value));
const pagedBooks = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    return books.value.slice(start, start + pageSize.value);
});

// 翻页
const prevPage = () => currentPage.value > 1 && currentPage.value--;
const nextPage = () => currentPage.value < totalPages.value && currentPage.value++;
const goPage = () => {
    if (jumpPage.value >= 1 && jumpPage.value <= totalPages.value) currentPage.value = jumpPage.value;
};

// 跳转到图书详情
const goDetail = (id) => {
    api.post('/book/browse', {bookId : id});
    router.push(`/newbook/${id}`);
}

onMounted(() => {
    loadBookshelf();
});
</script>

<style scoped lang="scss">
.bookshelf-page {
    h2 {
        color: #1e3a8a;
        margin-bottom: 20px;
    }

    .loading {
        font-size: 16px;
        color: #555;
    }

    .no-books {
        text-align: center;
        color: #999;
        font-size: 14px;
        margin-top: 40px;
    }

    .books-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 20px;

        .book-card {
            background-color: #fff;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            cursor: pointer;
            transition: all 0.2s ease;

            &:hover {
                transform: translateY(-3px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }

            .cover {
                width: 100%;
                height: 250px;
                object-fit: cover;
            }

            .info {
                padding: 10px;
                display: flex;
                flex-direction: column;
                align-items: center;

                .title {
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 6px;
                    text-align: center;
                }

                .author,
                .category {
                    font-size: 14px;
                    color: #666;
                    margin-bottom: 4px;
                }

                .detail-btn {
                    margin-top: 6px;
                    padding: 6px 12px;
                    background-color: #2563eb;
                    color: #fff;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s;

                    &:hover {
                        background-color: #1e40af;
                    }
                }
            }
        }
    }

    .pagination {
        margin-top: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;

        button {
            padding: 6px 14px;
            border: none;
            border-radius: 6px;
            background-color: #2563eb;
            color: #fff;
            cursor: pointer;

            &:disabled {
                background-color: #ccc;
                cursor: not-allowed;
            }
        }

        input {
            width: 60px;
            padding: 4px 8px;
            border-radius: 6px;
            border: 1px solid #ccc;
            text-align: center;
        }

        span {
            font-size: 14px;
            color: #444;
        }
    }
}
</style>
