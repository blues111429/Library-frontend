<template>
    <div class="book-manage">
        <h2>图书管理</h2>
        <!-- 筛选 -->
        <div class="filter">
            <label>类别:
                <select v-model="selectedCategory">
                    <option value="">全部</option>
                    <option v-for="c in categoryList" :key="c.id" :value="String(c.id)">
                        {{ c.name }}
                    </option>
                </select>
            </label>
            <label class="search">
                书名搜索:
                <input type="text" v-model="searchKeyword" placeholder="请输入书名关键词" />
            </label>
            <button class="add-btn" @click="openAddModal">+ 新增图书</button>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="loading">正在加载图书...</div>

        <!-- 图书分页展示 -->
        <div v-else class="book-pagination-container">
            <div class="book-items">
                <div class="book-item" v-for="book in pagedBooks" :key="book.id">
                    <h3>{{ book.title }}</h3>
                    <p>类别: {{ getCategoryName(book.categoryId) }}</p>
                    <p>可借数量: {{ book.availableCopies }}</p>
                    <p>浏览次数: {{ book.viewCount }}</p>
                    <p>借阅次数: {{ book.borrowCount }}</p>
                    <p>状态: <span :class="book.status === 1 ? 'status-on' : 'status-off'">{{ book.status === 1 ? '上架中' : '已下架' }}</span></p>
                    <div class="book-actions">
                        <button class="edit-btn" @click="openEditModal(book)">编辑</button>
                        <button class="status-btn" @click="toggleStatus(book)">
                        {{ book.status === 1 ? '下架' : '上架' }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- 分页控件 -->
            <div class="pagination">
                <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">上一页</button>
                <span>{{ currentPage }} / {{ totalPages }}</span>
                <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">下一页</button>
            </div>
        </div>

        <!-- 编辑/新增图书 -->
        <div v-if="showModal" class="modal-overlay">
            <div class="modal">
                <h3>{{ isEdit ? '编辑图书' : '新增图书' }}</h3>
                <div class="modal-body">
                    <label>书名:</label>
                    <input v-model="editBook.title" />
                    <label>作者:</label>
                    <input v-model="editBook.author" />
                    <label>分类:</label>
                    <select v-model="editBook.categoryId">
                    <option v-for="c in categoryList" :key="c.id" :value="c.id">{{ c.name }}</option>
                    </select>
                    <label>ISBN:</label>
                    <input v-model="editBook.isbn" />
                    <label>总册数:</label>
                    <input v-model="editBook.totalCopies" />
                    <label>可借册数:</label>
                    <input v-model="editBook.availableCopies" />
                    <label>出版社:</label>
                    <input v-model="editBook.publisher" />
                    <label>出版日期:</label>
                    <input v-model="editBook.publishYear" />
                </div>
                <div class="modal-footer">
                    <button class="btn confirm" @click="submitBook">{{ isEdit ? '保存修改' : '确认新增' }}</button>
                    <button class="btn cancel" @click="closeModal">取消</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import api from '../api';

const bookList = ref([]);
const categoryList = ref([]);
const selectedCategory = ref('');
const searchKeyword = ref('');
const loading = ref(true);

const isEdit = ref(false);
const showModal = ref(false);
const editBook = ref({
    book_id: '',
    title: '',
    author: '',
    categoryId: '',
    isbn: '',
    totalCopies: '',
    availableCopies: '',
    publisher: '',
    publishYear: '',
});

// 分页相关
const currentPage = ref(1);
const pageSize = 10;

const totalPages = computed(() => Math.ceil(filteredBooks.value.length / pageSize));

watch(selectedCategory, () => {
    currentPage.value = 1; // 切换分类时重置到第一页
});

// 获取图书列表
const loadBooks = async () => {
    try {
        const response = await api.get('/book/bookList');
        bookList.value = Array.isArray(response.data) ? response.data : [];
    } catch (err) {
        console.error('获取图书列表失败:', err);
    }
};

// 获取分类列表
const loadCategories = async () => {
    try {
        const response = await api.get('/category/categoryList');
        categoryList.value = Array.isArray(response.data) ? response.data : [];
    } catch (err) {
        onsole.error('获取分类列表失败:', err);
    }
};

// 根据筛选条件计算过滤后的图书列表
const filteredBooks = computed(() => {
    let books = bookList.value;

    if (selectedCategory.value) {
        const selectedId = Number(selectedCategory.value);
        books = books.filter(book => book.categoryId === selectedId);
    }

    if (searchKeyword.value.trim() !== '') {
        const keyword = searchKeyword.value.trim().toLowerCase();
        books = books.filter(book => book.title.toLowerCase().includes(keyword));
    }

    return books;
});

// 获取分类名称
const getCategoryName = (id) => {
    const category = categoryList.value.find(c => c.id === id);
    return category ? category.name : '-';
};

// 获取当前页面的图书
const pagedBooks = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredBooks.value.slice(startIndex, endIndex);
});

// 改变当前页
const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
    }
};

const openAddModal = () => { 
    isEdit.value = false; 
    editBook.value = { totalCopies : 1, availableCopies : 1, }; 
    showModal.value = true; 
};
const openEditModal = book => { 
    isEdit.value = true; 
    editBook.value = {...book}; 
    showModal.value = true; 
}; 
const closeModal = () => { 
    showModal.value = false; 
};
const submitBook = async () => { 
    const endPoint = isEdit.value ? '/admin/editBook' : '/admin/addBook'; 
    try { 
        const response = await api.post(endPoint, editBook.value); 
        console.log(editBook.value); 
        if(response.code === 200 || response.data?.code === 200) { 
            alert(response.message || '操作成功'); 
            showModal.value = false; 
            await loadBooks(); 
        } 
        else { 
            console.log(response.message); 
            alert(response.message || '操作失败'); 
        } 
    } 
    catch(err) { 
        console.log(err); 
    } 
};
//改变状态
const toggleStatus = async (book) => {
    try {
        const newStatus = book.status === 1 ? 0 : 1;
        const response = await api.post("/book/updateStatus", { id: book.id, status: newStatus });
        if(response.code === 200) {
        alert(`图书已${newStatus === 1 ? '上架' : '下架'}成功`);
        await loadBooks();
        } else {
            console.log(response.message);
        }
    } catch (err) {
        console.log('切换状态失败', err);
        alert('服务器出错');
    }
}

onMounted(async () => {
    loading.value = true;
    await Promise.all([loadBooks(), loadCategories()]);
    loading.value = false;
});
</script>

<style lang="scss" scoped>
.book-manage {
    padding: 20px;

    h2 {
    font-size: 22px;
    margin-bottom: 20px;
    color: #2b4c7e;
    text-align: center;
    font-weight: 600;
    }

    .filter {
    margin-bottom: 15px;
    display: flex;
    gap: 20px;
    justify-content: center;

        select,
        input {
            padding: 5px 10px;
            border-radius: 6px;
            border: 1px solid #ccc;
        }

        .search input {
        width: 180px;
        padding: 6px 10px;
        border: 1px solid #ccc;
        border-radius: 6px;
        transition: border-color 0.2s;

            &:hover {
            outline: none;
            border-color: #3182ce;
            box-shadow: 0 0 2px #3182ce;
            }
        }

        .add-btn {
        background: #3182ce;
        color: white;
        padding: 6px 12px;
        border: none;
        border-radius: 6px;
        cursor: pointer;

            &:hover {
                background: #2563eb;
            }
        }
    }

    .loading {
        text-align: center;
        font-weight: bold;
        color: #3182ce;
        padding: 20px 0;
    }

    .book-pagination-container {
        display: flex;
        flex-direction: column;

        .book-items {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 20px;

            .book-item {
                padding: 15px;
                border: 2px solid #ddd;
                border-radius: 8px;
                background-color: #f9f9f9;
                width: calc(20% - 20px);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                box-sizing: border-box;

                .book-actions {
                    margin-top: 10px;
                    display: flex;
                    gap: 10px;

                    .edit-btn,
                    .status-btn {
                        flex: 1;
                        padding: 6px;
                        border: none;
                        border-radius: 6px;
                        color: white;
                        cursor: pointer;

                        &.edit-btn {
                            background-color: #3b82f6;

                            &:hover {
                                background-color: #2563eb;
                            }
                        }

                        &.status-btn {
                            background-color: #7a1a17;

                            &:hover {
                                background-color: #9b2c25;
                            }
                        }
                    }
                }
            }
        }

        .pagination {
            justify-content: center;
            gap: 15px;
            margin-top: 20px;
            display: flex; /* 让分页按钮居中 */
            text-align: center;
            
            button {
                padding: 8px 16px;
                border-radius: 6px;
                border: 1px solid #ccc;
                cursor: pointer;
                background-color: #3182ce;
                color: white;

                &:disabled {
                background-color: #ccc;
                cursor: not-allowed;
                }

                &:hover {
                background-color: #2563eb;
                }
            }

            span {
                text-align: center;
                justify-content: center;
                margin-top: 5px;
            }
        }
    }

    .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.4);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 999;

        .modal {
            width: 400px;
            padding: 40px;
            background: white;

            .modal-body {
                display: flex;
                flex-direction: column;
                gap: 10px;
                margin-bottom: 20px;

                .label {
                    margin-right: 10px;
                }

                input,
                select {
                    padding: 6px;
                    border-radius: 6px;
                    border: 1px solid #ccc;
                    font-size: 14px;
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                    background-color: white;
                    width: 100%;
                    box-sizing: border-box;
                    appearance: none;

                    &:hover,
                    &:focus {
                    border-color: #3182ce;
                    box-shadow: 0 0 3px #3182ce;
                    }

                    &:disabled {
                    background-color: #f5f5f5;
                    cursor: not-allowed;
                    }
                }

                select {
                    background-image: linear-gradient(45deg, transparent 50%, #3182ce 50%),
                                linear-gradient(135deg, #3182ce 50%, transparent 50%);
                    background-position: calc(100% - 16px) center, calc(100% - 12px) center;
                    background-size: 5px 5px, 5px 5px;
                    background-repeat: no-repeat;
                    padding-right: 30px;
                    cursor: pointer;
                }
            }

            .modal-footer {
                display: flex;
                justify-content: center;
                gap: 20px;

                .btn {
                flex: 1;
                margin: 0 6px;
                border: none;
                border-radius: 6px;
                color: white;
                padding: 8px;	
                cursor: pointer;

                &.confirm {	background-color: #3b82f6; }
                &.cancel { background-color: #777; }
                }
            }
        }	
    }
}
</style>