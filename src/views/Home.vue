<template>
    <div class="library-home">
        <Navbar />

        <section class="hero">
            <h1 class="title">欢迎来到智能图书馆</h1>
            <p class="subtitle">探索知识的世界，随时随地，轻松借阅。</p>
            <div class="search-bar">
                <input v-model="keyword" placeholder="请输入书名或作者" />
                <button class="search-btn" @click="goSearch">搜索</button>
            </div>
        </section>

        <section class="recommend">
            <h2>📖 推荐书籍</h2>
            <div class="book-list">

            </div>
        </section>

        <footer class="footer">
            © 2025 智能图书馆 | support@smartlib.com
        </footer>
    </div>
</template>

<script setup>
import { ref } from "vue";
import Navbar from "../components/Navbar.vue";

const keyword = ref('');
</script>

<style scoped>
.library-home {
    background: #f9f9f9;
    min-height: 100vh;
}

.hero {
    text-align: center;
    margin: 60px 0;
}

.search-bar {
    display: flex;
    justify-content: center;
    gap: 10px;
}

.search-bar input {
    width: 400px;
    padding: 10px;
    border-radius: 20px;
    border: 1px solid #ccc;
}

.search-btn {
    background: #7a1a17;
    color: white;
    border: none;
    padding: 10px 24px;
    border-radius: 20px;
}

.book-list {
    min-height: 600px;
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
    padding: 20px;
}

.footer {
    text-align: center;
    padding: 16px;
    background: #333;
    color: #ccc;
    margin-top: 40px;
}
</style>
