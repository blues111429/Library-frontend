<template>
  <div class="book-manage">
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
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">正在加载图书...</div>

    <!-- 图书表格 -->
    <div v-else class="book-table-container">
      <table class="book-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>书名</th>
            <th>作者</th>
            <th>出版社</th>
            <th>出版年份</th>
            <th>ISBN</th>
            <th>类别</th>
            <th>语言</th>
            <th>总册数</th>
            <th>可借数量</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in filteredBooks" :key="book.id">
            <td>{{ book.id }}</td>
            <td>{{ book.title }}</td>
            <td>{{ book.author }}</td>
            <td>{{ book.publisher }}</td>
            <td>{{ book.publishYear }}</td>
            <td>{{ book.isbn }}</td>
            <td>{{ getCategoryName(book.categoryId) }}</td>
            <td>{{ book.language }}</td>
            <td>{{ book.totalCopies }}</td>
            <td>{{ book.availableCopies }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredBooks.length === 0" class="no-data">暂无符合条件的图书</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../api';

const bookList = ref([]);
const categoryList = ref([]);
const selectedCategory = ref('');
const loading = ref(true);

// 获取图书列表
const loadBooks = async () => {
  try {
    const res = await api.get('/book/bookList');
    bookList.value = Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error('获取图书列表失败:', err);
  }
};

// 获取分类列表
const loadCategories = async () => {
  try {
    const res = await api.get('/category/categoryList');
    categoryList.value = Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error('获取分类列表失败:', err);
  }
};

// 根据筛选条件计算过滤后的图书列表
const filteredBooks = computed(() => {
  if (!selectedCategory.value) return bookList.value;
  const selectedId = Number(selectedCategory.value);
  return bookList.value.filter(book => book.categoryId === selectedId);
});

// 根据 categoryId 获取分类名称
const getCategoryName = (id) => {
  const category = categoryList.value.find(c => c.id === id);
  return category ? category.name : '-';
};

onMounted(async () => {
  loading.value = true;
  await Promise.all([loadBooks(), loadCategories()]);
  loading.value = false;
});
</script>

<style lang="scss" scoped>
.book-manage {
  padding: 20px;

  .filter {
    margin-bottom: 15px;
    select {
      padding: 5px 10px;
      border-radius: 6px;
      border: 1px solid #ccc;
    }
  }

  .loading {
    text-align: center;
    font-weight: bold;
    color: #3182ce;
    padding: 20px 0;
  }

  .book-table-container {
    max-height: 700px;
    overflow-y: auto;
    border: 1px solid #ddd;
    border-radius: 8px;

    .book-table {
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
      table-layout: fixed;

      th, td {
        padding: 10px;
        border: 1px solid #ddd;
        text-align: center;
      }

      th {
        background: #f4f6fa;
        position: sticky;
        top: 0;
        z-index: 1;
      }
    }

    .no-data {
      text-align: center;
      padding: 15px 0;
      color: #666;
    }
  }
}
</style>
