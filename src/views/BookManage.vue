<template>
	<div class="book-manage">

		<!-- 筛选 -->
		<div class="filter">
			<!-- 根据类别 -->
			<label>类别:
				<select v-model="selectedCategory">
					<option value="">全部</option>
					<option v-for="c in categoryList" :key="c.id" :value="String(c.id)">
						{{ c.name }}
					</option>
				</select>
			</label>
			<!-- 根据书名 -->
			<label class="search">
				书名搜索:
				<input type="text" v-model="searchKeyword" placeholder="请输入书名关键词" />
			</label>
			<!-- 添加图书 -->
			<button class="add-btn" @click="openAddModal">+ 新增图书</button>
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
						<th>类别</th>
						<th>总册数</th>
						<th>可借数量</th>
						<th>浏览次数</th>
						<th>借阅次数</th>
						<th>状态</th>
						<th>操作</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="book in filteredBooks" :key="book.id">
						<td>{{ book.id }}</td>
						<td>{{ book.title }}</td>
						<td>{{ book.author }}</td>
						<td>{{ book.publisher }}</td>
						<td>{{ getCategoryName(book.categoryId) }}</td>
						<td>{{ book.totalCopies }}</td>
						<td>{{ book.availableCopies }}</td>
						<td>{{ book.viewCount }}</td>
						<td>{{ book.borrowCount }}</td>
						<td>
							<span :class="book.status === 1 ? 'status-on' : 'status-off'">
								{{ book.status === 1 ? '上架中' : '已下架' }}
							</span>
						</td>
						<td>
							<button class="edit-btn" @click="openEditModal(book)">编辑</button>
							<button
								class="status-btn"
								:class="book.status === 1 ? 'off' : 'on'"
								@click="toggleStatus(book)"
							>
								{{ book.status === 1 ? '下架' : '上架' }}
							</button>
						</td>
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
//图书列表
const bookList = ref([]);
//分类列表
const categoryList = ref([]);
//筛选分类
const selectedCategory = ref('');
//书名关键词
const searchKeyword = ref('');
//加载状态
const loading = ref(true);

// 获取图书列表
const loadBooks = async () => {
	try {
		const response = await api.get('/book/bookList');
		bookList.value = Array.isArray(response.data) ? response.data : [];
		console.log(response);
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
		console.error('获取分类列表失败:', err);
	}
};

// 根据筛选条件计算过滤后的图书列表
const filteredBooks = computed(() => {
	let books = bookList.value;

	//按类别筛选
	if(selectedCategory.value) {
		const selectedId = Number(selectedCategory.value);
		books = books.filter(book => book.categoryId === selectedId);
	}

	//大小写分类
	if(searchKeyword.value.trim() !== '') {
		const keyword = searchKeyword.value.trim().toLowerCase();
		books = books.filter(book => book.title.toLowerCase().includes(keyword));
	}

	return books;
});

// 根据 categoryId 获取分类名称
const getCategoryName = (id) => {
	const category = categoryList.value.find(c => c.id === id);
	return category ? category.name : '-';
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
				vertical-align: middle;
			}

			th {
				background: #f4f6fa;
				position: sticky;
				top: 0;
				z-index: 1;
			}

			.status-on {
				color: #16a34a;
				font-weight: bold;
			}

			.status-off {
				color: #dc2626;
				font-weight: bold;
			}

			td:last-child {
				display: flex;
				gap: 8px;
				flex-direction: column;
				align-items: center;
			}

			.edit-btn,
			.status-btn {
				width: 60px;
				padding: 5px 12px;
				border-radius: 6px;
				border: none;
				font-size: 14px;
				cursor: pointer;
				transition: all 0.2s ease;
			}

			.edit-btn {
				background-color: #3b82f6;
				color: #fff;

				&:hover {
					background-color: #2563eb;
					box-shadow: 0 0 6px rgba(37, 99, 235, 0.4);
				}
			}

			.status-btn {
				&.on {
					background-color: #16a34a;
					color: #fff;

					&:hover {
						background-color: #15803d;
						box-shadow: 0 0 6px rgba(22, 163, 74, 0.4);
					}
				}

				&.off {
					background-color: #dc2626;
					color: #fff;

					&:hover {
						background-color: #b91c1c;
						box-shadow: 0 0 6px rgba(220, 38, 38, 0.4);
					}
				}
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
