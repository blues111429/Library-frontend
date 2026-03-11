<template>
    <div class="books-page">
        <Navbar />

        <div class="content-wrapper">
            <div class="main-content">
                <!-- 左侧筛选栏 -->
                <aside class="sidebar" :class="{ collapsed: isSidebarCollapsed }">
                    <div class="sidebar-header">
                        <h3>筛选条件</h3>
                        <button class="collapse-btn" @click="toggleSidebar">
                            {{ isSidebarCollapsed ? '▶' : '◀' }}
                        </button>
                    </div>

                    <div v-if="!isSidebarCollapsed" class="filter-group">
                        <label>分类：</label>
                        <select v-model="selectedCategory" @change="applyFilter">
                            <option value="">全部</option>
                            <option v-for="cat in categories" :key="cat.id" :value="cat.name">
                                {{ cat.name }}
                            </option>
                        </select>
                    </div>

                    <div v-if="!isSidebarCollapsed" class="filter-group">
                        <label>状态：</label>
                        <select v-model="selectedStatus" @change="applyFilter">
                            <option value="">全部</option>
                            <option value="in-stock">可借</option>
                            <option value="out-of-stock">不可借</option>
                        </select>
                    </div>
                </aside>

                <!-- 右侧图书列表 -->
                <section class="books-list-wrapper">
                    <div v-if="loading" class="loading">📚 正在加载图书...</div>

                    <div v-else-if="filteredBooks.length" class="books-list">
                        <div class="book-card" v-for="book in pagedBooks" :key="book.id" @click="goDetail(book.id)">
                            <img :src="book.coverUrl || defaultCover" alt="封面" class="cover" />
                            <div class="info">
                                <h3 class="title" :title="book.title">{{ book.title }}</h3>
                                <p class="author">作者：{{ book.author || '未知' }}</p>
                                <p class="category">分类：{{ book.categoryName || '未分类' }}</p>
                                <p class="available" :class="book.status === 1 ? 'in-stock' : 'out-of-stock'">
                                    {{ book.status === 1 ? `可借数量：${book.availableCopies}` : '不可借' }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div v-else class="no-books">暂无符合条件的图书</div>

                    <!-- 分页控制 -->
                    <div v-if="totalPages > 1" class="pagination">
                        <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
                        <span>第 {{ currentPage }} / {{ totalPages }} 页</span>
                        <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>

                        <span>跳转到</span>
                        <input type="number" v-model.number="jumpPage" min="1" :max="totalPages"
                            @keyup.enter="goPage" />
                        <button @click="goPage">跳转</button>
                        <!-- 🧠 猜你喜欢按钮 -->
                        <button class="recommend-btn" @click="refreshRecommendations">猜你喜欢 🔄</button>
                    </div>

                    <!-- 预留：智能推荐区块 -->
                    <div class="recommend-section" v-if="showRecommendation">
                        <h3>📖 猜你喜欢</h3>
                        <div class="recommend-placeholder">
                            （这里稍后可以展示智能推荐的书籍）
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import Navbar from "../components/Navbar.vue";
import api from "../api";

const router = useRouter();
const defaultCover = "/default-cover.png";

// 数据
const books = ref([]);
const categories = ref([]);
const loading = ref(true);

// 筛选与分页
const selectedCategory = ref("");
const selectedStatus = ref("");
const currentPage = ref(1);
const pageSize = ref(15);
const jumpPage = ref(1);

// 侧边栏折叠状态
const isSidebarCollapsed = ref(false);
const toggleSidebar = () => {
    isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

// 推荐模块占位
const showRecommendation = ref(false);

// 获取图书列表
const loadBooks = async () => {
    loading.value = true;
    try {
        const res = await api.get("/book/bookList");
        console.log("获取到的全部书籍",res);
        if (res.code === 200) books.value = res.data.map(book => ({
            ...book,
            coverUrl: book.isbn
                ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`
                : defaultCover
        }));
    } catch (err) {
        console.error("获取图书列表失败", err);
    } finally {
        loading.value = false;
    }
};

// 获取分类列表
const loadCategories = async () => {
    try {
        const res = await api.get("/category/categoryList");
        console.log(res.data);
        if (res.code === 200) categories.value = res.data;
    } catch (err) {
        console.error("获取分类列表失败", err);
    }
};

// 过滤逻辑
const filteredBooks = computed(() => {
    console.log("Filtered Books:", books.value);  // 调试输出
    return books.value.filter((book) => {
        const categoryMatch = selectedCategory.value
            ? book.categoryName === selectedCategory.value
            : true;
        const statusMatch =
            selectedStatus.value === ""
                ? true
                : selectedStatus.value === "in-stock"
                    ? book.status === 1
                    : book.status === 0;
        return categoryMatch && statusMatch;
    });
});

// 分页计算
const totalPages = computed(() =>{
    const total = Math.ceil(filteredBooks.value.length / pageSize.value);
    console.log("Total Pages:", total); // 调试输出
    return total
});
const pagedBooks = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    return filteredBooks.value.slice(start, start + pageSize.value);
});

// 翻页
const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
        scrollToTop();
    }
}
const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
        scrollToTop();
    }
}
const goPage = () => {
    if (jumpPage.value >= 1 && jumpPage.value <= totalPages.value) {
        currentPage.value = jumpPage.value;
        scrollToTop();
    }
};
const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
};

// 筛选变化
const applyFilter = () => {
    currentPage.value = 1;
    scrollToTop();
};

// 跳转详情
const goDetail = (id) => {
    const state = {
        currentPage: currentPage.value,
        selectedCategory: selectedCategory.value,
        selectedStatus: selectedStatus.value,
        scrollY: window.scrollY
    };
    sessionStorage.setItem('bookListState', JSON.stringify(state));

    api.post('/book/browse', { bookId: id });
    router.push(`/book/${id}`);
}

//刷新推荐
const refreshRecommendations = async () => {
    try {
        const res = await api.get("/book/refreshRecommend");
        if (res.code === 200) {
            books.value = res.data.map(book => ({
                ...book,
                coverUrl: book.isbn
                    ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`
                    : defaultCover
            }));
            currentPage.value = 1;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    } catch (err) {
        console.error("刷新推荐失败", err);
    }
};

onMounted(() => {
    const savedState = sessionStorage.getItem('bookListState');
    if (savedState) {
        const { currentPage: cp, selectedCategory: sc, selectedStatus: ss, scrollY } = JSON.parse(savedState);
        currentPage.value = cp || 1;
        selectedCategory.value = sc || '';
        selectedStatus.value = ss || '';
        loadBooks().then(() => {
            loadCategories();
            setTimeout(() => window.scrollTo(0, scrollY || 0), 100);
        });
        sessionStorage.removeItem('bookListState');
    } else {
        loadBooks();
        loadCategories();
    }

});
</script>

<style scoped lang="scss">
.books-page {
    min-height: 100vh;
    width: 100%;
    background-color: #f5f7fa;

    .content-wrapper {
        max-width: 1400px;
        margin: 0 auto;
        padding: 30px 20px;
    }

    .page-title {
        font-size: 28px;
        font-weight: 700;
        color: #2b4c7e;
        margin-bottom: 25px;
        text-align: center;
    }

    .main-content {
        display: flex;
        align-items: flex-start;
        gap: 24px;
    }

    /* ==== 侧边栏 ==== */
    .sidebar {
        flex-shrink: 0;
        width: 180px;
        position: sticky;
        top: 100px;
        background: #ffffff;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
        transition: all 0.3s ease;

        &.collapsed {
            width: 80px;

            .filter-group,
            h3 {
                display: none;
            }
        }

        .sidebar-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;

            h3 {
                color: #2b4c7e;
                font-size: 18px;
                font-weight: 600;
            }

            .collapse-btn {
                background: none;
                border: none;
                cursor: pointer;
                color: #2b4c7e;
                font-size: 18px;
                font-weight: bold;
            }
        }

        .filter-group {
            margin-bottom: 20px;

            label {
                display: block;
                margin-bottom: 8px;
                font-weight: 500;
                color: #333;
            }

            select {
                width: 100%;
                padding: 8px 10px;
                border-radius: 8px;
                border: 1px solid #ccc;
                background-color: #fafafa;
                font-size: 14px;
                transition: border-color 0.2s;

                &:focus {
                    border-color: #2b4c7e;
                    outline: none;
                }
            }
        }
    }

    /* ==== 图书列表 ==== */
    .books-list-wrapper {
        flex: 1;
        background: #ffffff;
        border-radius: 12px;
        padding: 25px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
        min-height: 700px;

        .books-list {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 28px;
            justify-items: center;
            margin-bottom: 40px;
        }

        .book-card {
            width: 220px;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            cursor: pointer;
            overflow: hidden;
            transition: all 0.25s ease;
            display: flex;
            flex-direction: column;

            &:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
            }

            .cover {
                width: 100%;
                height: 300px;
                object-fit: cover;
                border-bottom: 1px solid #eee;
            }

            .info {
                flex: 1;
                padding: 12px 14px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                .title {
                    font-size: 16px;
                    font-weight: 600;
                    color: #2b4c7e;
                    margin-bottom: 8px;
                    line-height: 1.4;
                    height: 42px;
                    overflow: hidden;
                }

                .author,
                .category {
                    font-size: 14px;
                    color: #666;
                    margin-bottom: 4px;
                }

                .available {
                    font-size: 14px;
                    font-weight: 600;
                    margin-top: 8px;

                    &.in-stock {
                        color: #16a34a;
                    }

                    &.out-of-stock {
                        color: #dc2626;
                    }
                }
            }
        }

        .no-books {
            text-align: center;
            font-size: 16px;
            color: #999;
            margin-top: 50px;
        }

        /* ==== 分页 ==== */
        .pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
            margin-top: 20px;

            button {
                padding: 8px 16px;
                border: none;
                border-radius: 6px;
                background-color: #2b4c7e;
                color: #fff;
                cursor: pointer;
                font-weight: 500;
                transition: background-color 0.2s ease;

                &:hover:enabled {
                    background-color: #1f3660;
                }

                &:disabled {
                    background-color: #ccc;
                    cursor: not-allowed;
                }
            }

            input {
                width: 60px;
                padding: 6px;
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

    /* ==== 响应式 ==== */
    @media (max-width: 1024px) {
        .main-content {
            flex-direction: column;
        }

        .sidebar {
            width: 100%;
            order: 2;
        }

        .books-list-wrapper {
            order: 1;
        }

        .book-card {
            width: 100%;
            max-width: 300px;
        }
    }
}
</style>