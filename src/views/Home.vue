<template>
  <div class="library-home">
	<Navbar />

	<!-- Sidebar -->
	<div class="sidebar" :class="{ open: isSidebarOpen }" :style=" { width: isSidebarOpen ? '250px' : '0px', opacity: isSidebarOpen ? 1 : 0 } ">
		<div class="sidebar-content">
			<nav class="sidebar-nav">
				<ul>
					<li><a href="#">首页</a></li>
					<li><a href="#">分类</a></li>
					<li><a href="#">热门书籍</a></li>
					<li><a href="#">借阅记录</a></li>
					<li><a href="#">设置</a></li>
					<li><a href="#">用户信息</a></li>
				</ul>
			</nav>
		</div>
	</div>
	<!-- Toggle Button -->
	<div class="toggle-btn" @click="toggleSidebar">
		<span>{{ isSidebarOpen ? '<-' : '->' }}</span>
	</div>

	<!-- Hero Section -->
	<section class="hero">
	  <!-- <h1 class="title">欢迎来到智能图书馆</h1>
	  <p class="subtitle">探索知识的世界，随时随地，轻松借阅。</p> -->
	  <div class="search-bar">
		<input v-model="keyword" placeholder="请输入书名或作者" />
		<button class="search-btn" @click="goSearch">搜索</button>
	  </div>
	</section>

	<!-- Recommended Books Section -->
	<section class="recommend">
	  <h2>📖 推荐书籍</h2>
	  <div class="book-list">
		<div class="book-card" v-for="book in books" :key="book.id">
		  <img :src="book.cover" alt="Book Cover" class="book-cover" />
		  <div class="book-info">
			<h3 class="book-title">{{ book.title }}</h3>
			<p class="book-author">{{ book.author }}</p>
			<p class="book-description">{{ book.description }}</p>
		  </div>
		</div>
	  </div>
	</section>

	<!-- News Section -->
	<section class="news">
	  <h2>📣 最新新闻</h2>
	  <div class="news-list">
		<div class="news-card" v-for="newsItem in news" :key="newsItem.id">
		  <h3 class="news-title">{{ newsItem.title }}</h3>
		  <p class="news-date">{{ newsItem.date }}</p>
		  <p class="news-description">{{ newsItem.description }}</p>
		  <a :href="newsItem.link" class="read-more">阅读更多</a>
		</div>
	  </div>
	</section>

        <!-- Footer Section -->
        <footer class="footer">
            © 2025 智能图书馆 | support@smartlib.com
        </footer>
    </div>
	<!-- Footer Section -->
	<footer class="footer">
	  © 2025 智能图书馆 | support@smartlib.com
	</footer>
  </div>
</template>

<script setup>
    import { ref } from "vue";
    import Navbar from "../components/Navbar.vue";
// 搜索关键字
    const isSidebarOpen = ref(false);

    // 静态图书数据
    const books = ref([
        { id: 301, title: "百年孤独", author: "加西亚·马尔克斯", cover: "https://covers.openlibrary.org/b/isbn/9787544291170-L.jpg", description: "魔幻现实主义文学的代表作" },
        { id: 302, title: "围城", author: "钱钟书", cover: "https://covers.openlibrary.org/b/isbn/9787020090006-L.jpg", description: "现代文学经典，幽默讽刺小说" },
        { id: 303, title: "平凡的世界", author: "路遥", cover: "https://covers.openlibrary.org/b/isbn/9787530216781-L.jpg", description: "现实主义长篇小说" },
    ]);

    // 静态新闻数据
    const news = ref([
        { id: 1, title: "智能图书馆新功能上线", date: "2025-03-01", description: "智能图书馆新增了个性化推荐和自动借阅功能，提升了用户体验。", link: "#" },
        { id: 2, title: "春季书籍推荐", date: "2025-03-05", description: "春季来临，智能图书馆为你推荐一系列适合春季阅读的书籍。", link: "#" },
        { id: 3, title: "线上借阅服务全面升级", date: "2025-03-10", description: "智能图书馆线上借阅系统进行全面升级，提供更便捷的服务。", link: "#" },
    ]);

    function goSearch() {
        console.log('搜索关键词:', keyword.value);
        // 在这里添加搜索逻辑
    }

    const keyword = ref('');
// 侧边栏状态
const isSidebarOpen = ref(false);

// 静态图书数据
const books = ref([
  { id: 301, title: "百年孤独", author: "加西亚·马尔克斯", cover: "https://covers.openlibrary.org/b/isbn/9787544291170-L.jpg", description: "魔幻现实主义文学的代表作" },
  { id: 302, title: "围城", author: "钱钟书", cover: "https://covers.openlibrary.org/b/isbn/9787020090006-L.jpg", description: "现代文学经典，幽默讽刺小说" },
  { id: 303, title: "平凡的世界", author: "路遥", cover: "https://covers.openlibrary.org/b/isbn/9787530216781-L.jpg", description: "现实主义长篇小说" },
]);
// 静态新闻数据
const news = ref([
  { id: 1, title: "智能图书馆新功能上线", date: "2025-03-01", description: "智能图书馆新增了个性化推荐和自动借阅功能，提升了用户体验。", link: "#" },
  { id: 2, title: "春季书籍推荐", date: "2025-03-05", description: "春季来临，智能图书馆为你推荐一系列适合春季阅读的书籍。", link: "#" },
  { id: 3, title: "线上借阅服务全面升级", date: "2025-03-10", description: "智能图书馆线上借阅系统进行全面升级，提供更便捷的服务。", link: "#" },
]);

// 搜索
function goSearch() {
  console.log('搜索关键词:', keyword.value);
  // 在这里添加搜索逻辑
}
// 侧边栏
function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
}

    function toggleSidebar() {
        isSidebarOpen.value = !isSidebarOpen.value;
    }
</script>

<style scoped lang="scss">
.library-home {
  background: #333;
  min-height: 100vh;
  font-family: 'Roboto', sans-serif;
}

.hero {
  text-align: center;
  margin: 60px 0;
}

/* Sidebar */
.sidebar {
	position: relative;
	width: 250px;
	visibility: hidden;
	background-color: #333;
	color: white;
	padding: 20px;
	height: 100vh;
	position: fixed;
	transition: width 0.3s ease, opacity 0.3s ease, visibility 0.3s ease;
	z-index: 100;

  	&.open {
		width: 250px;
		visibility: visible;
		opacity: 1;
	}

  	&.closed {
		width: 0;
		visibility: hidden;
		opacity: 0;
	}

	.sidebar-content {
		display: flex;
		flex-direction: column;
		height: 100%;

		.sidebar-nav {
			
			ul {
				list-style: none;
				padding: 0;
			}

			li {
				margin: 20px 0;
			}

			a {
				color: white;
				text-decoration: none;
				font-size: 1.1rem;
				display: block;
				
				&:hover {
					color: #f86d43;
				}
			}
		}
	}
}
/* Toggle Button */
.toggle-btn {
	color: white;
	visibility: visible;
	position: absolute;
	top: 50%;
	right: 0;  /* Position at the right side */
	cursor: pointer;
	transition: transform 0.3s ease;
	margin-top: -15px;
}

.title {
  font-size: 2.5rem;
  color: #333;
  font-weight: bold;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-top: 10px;
}

.search-bar {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.search-bar input {
  width: 400px;
  padding: 12px;
  border-radius: 30px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.search-btn {
  background: #7a1a17;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 30px;
  font-size: 1rem;
  cursor: pointer;
}

.search-btn:hover {
  background: #9b2c25;
}

.recommend {
  padding: 20px;
}

.book-list {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
  padding: 20px;
}

.book-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 220px;
  margin-bottom: 30px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.book-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.book-cover {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-bottom: 2px solid #f0f0f0;
}

.book-info {
  padding: 15px;
}

.book-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.book-author {
  font-size: 1rem;
  color: #7a1a17;
  margin-top: 5px;
}

.book-description {
  font-size: 0.9rem;
  color: #555;
  margin-top: 10px;
  height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.news {
  padding: 20px;
  background: #fff;
}

.news-list {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.news-card {
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 250px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.news-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.news-title {
  font-size: 1.2rem;
  color: #333;
  font-weight: bold;
}

.news-date {
  font-size: 0.9rem;
  color: #777;
  margin-top: 5px;
}

.news-description {
  font-size: 0.9rem;
  color: #555;
  margin-top: 10px;
  height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.read-more {
  color: #7a1a17;
  font-size: 1rem;
  margin-top: 10px;
  text-decoration: none;
}

.read-more:hover {
  text-decoration: underline;
}

.footer {
  text-align: center;
  padding: 16px;
  background: #333;
  color: #ccc;
  margin-top: 40px;
}
</style>