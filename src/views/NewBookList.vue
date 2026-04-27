<template>
    <Navbar />
    <div class="container">
        <div class="page_content">
            <h1>图书分类:</h1>
            <div class="body">
                <ul class="results">
                    <li class="sort">
                        <p>排序:</p>
                        <div class="sort-dropdown" 
                             @mouseenter="toggleDropdown" 
                             @mouseleave="hideDropdown">
                            <!-- 下拉框按钮，显示默认选项 -->
                            <button class="sort-dropdown-toggle">
                                {{ selectedOption || '选择排序' }}
                            </button>

                            <!-- Dropdown Menu, 在鼠标悬停时显示 -->
                            <div v-if="isDropdownOpen" class="sort-dropdown-menu">
                                <button @click="selectOption('按书名排序')">按书名排序</button>
                                <button @click="selectOption('按作者排序')">按作者排序</button>
                                <button @click="selectOption('按热度排序')">按热度排序</button>
                            </div>
                        </div>
                    </li>
                    

                    <!-- 图书列表显示（每本书显示为li） -->
                    <li v-for="book in pagedBooks" :key="book.id" class="booklink" @click="goBookDetail(book.id)">
                        <div class="book-item">
                            <!-- 图书封面 -->
                            <img :src="book.coverUrl" alt="Book Cover" class="book-cover"/>
                            <div class="book-info">
                                <!-- 书名 -->
                                <p class="book-title">{{ book.title }}</p>
                                <!-- 作者 -->
                                <p class="book-author">{{ book.author }}</p>
                            </div>
                        </div>
                    </li>

                    <!-- 分页控制 -->
                    <li class="statusline">
                        <div class="padded">
                            <span>展示结果 {{ startIndex + 1 }} - {{ endIndex }}</span>
                            <span class="link">
                                <a @click.prevent="prevPage">Previous</a> | 
                                <a @click.prevent="nextPage">Next</a>
                            </span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import Navbar from '../components/Navbar.vue';
import { computed, ref } from 'vue';
import { useRouter } from "vue-router";
import api from "../api";
const router = useRouter();

const defaultCover = "/default-cover.png";

const isDropdownOpen = ref(false);
const selectedOption = ref('按书名排序'); // 默认选项为 "按书名排序"

const loading = ref(false);
const books = ref([]);
const currentPage = ref(1);
const booksPerPage = 25;
const totalBooks = computed(() => books.value.length);

const startIndex = computed(() => (currentPage.value - 1) * booksPerPage);
const endIndex = computed(() => currentPage.value * booksPerPage, totalBooks.value);
const pagedBooks = computed(() => {
    return books.value.slice(startIndex.value, endIndex.value);
});

const toggleDropdown = () => {
    isDropdownOpen.value = true;
};

const hideDropdown = () => {
    isDropdownOpen.value = false;
};

const selectOption = (option) => {
    selectedOption.value = option; // 更新选中的选项
    console.log('选择的选项:', option);
    isDropdownOpen.value = false; // 选择后关闭下拉框
};


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

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
    upToTop();
};

const nextPage = () => {
    if (currentPage.value < Math.ceil(totalBooks.value / booksPerPage)) {
        currentPage.value++;
    }
    upToTop();
};

const upToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

const goBookDetail = (id) => {
    console.log('点击了书籍ID:', id);
    const state = {
        currentPage: currentPage.value,
        scrollY: window.scrollY
    };
    sessionStorage.setItem('bookListState', JSON.stringify(state));

    api.post('/newbook/browse', { bookId: id });
    router.push(`/newbook/${id}`);
};
loadBooks();
</script>

<style lang="scss" scoped>
.container {
    margin: 0 auto;
    padding-bottom: 10vh;

    .page_content {
        margin-top: 60px;
        margin-bottom: 30px;
        padding: 0 5vw;

        h1 {
            font-weight: bold;
            text-align: left;
            font-size: 1.875em;
            line-height: 1em;
            margin-bottom: 1em;
            word-break: break-word;
        }

        .body {
            box-sizing: border-box;
            width: 100%;
            display: flex;
            margin-bottom: 10px;

            .results {
                margin: 3em 0.5em 0 0.5em;
                min-height: 100vh;
                display: grid;
                grid-template-columns: repeat(4, 1fr); /* 四列 */
                gap: 20px;
                list-style-type: none;  
                
                .sort {
                    display: flex;
                    align-items: flex-start;
                    gap: 5px;
                    width: 100%;

                    p {
                        margin: 0;
                        font-weight: bold;
                        font-size: 20px;
                    }

                    .sort-dropdown {
                        position: relative;
                        width: 90%;

                        .sort-dropdown-toggle {
                            text-align: left;
                            padding: 10px 15px;
                            color: #000;
                            font-size: 1em;
                            border: none;
                            border-radius: 5px;
                            border: 1px solid #ccc;
                            width: 100%;
                            cursor: pointer;
                            display: inline-block;
                            transition: background-color 0.2s;
                        }

                        .sort-dropdown-menu {
                            position: absolute;
                            top: 35px;
                            left: 0;
                            width: 100%;
                            background-color: #fff;
                            border: 1px solid #ccc;
                            border-radius: 5px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                            z-index: 10;

                            button {
                                width: 100%;
                                padding: 10px 15px;
                                background-color: #fff;
                                border: none;
                                text-align: left;
                                font-size: 1em;
                                cursor: pointer;
                                transition: background-color 0.2s;

                                &:hover {
                                    background-color: #f1f1f1;
                                }
                            }
                        }
                    }
                }
                
                li {
                    padding: 10px;
                    gap: 10px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }

                .booklink {
                    padding: 10px;
                    gap: 10px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    :hover {
                        transition: transform 0.2s;

                        background-color: #c7dde3;
                    }

                    .book-item {
                        display: flex;
                        flex-direction: row;
                        align-items: flex-start;
                        gap: 15px;
                        width: 100%;
                        text-align: center;
                    }

                    .book-cover {
                        width: 100px;
                        height: 150px;
                        object-fit: cover;
                        border-radius: 8px;
                        border: 1px solid #ccc;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        cursor: pointer;
                    }

                    .book-info {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        text-align: left;
                        width: 100%;
                    }

                    .book-title {
                        font-size: 1em;
                        font-weight: bold;
                    }

                    .book-author {
                        font-size: 0.875em;
                        color: #777;
                    }
                }

                .statusline {
                    height: 50px;
                    font-weight: 500;
                    padding: 5px;
                    width: 100%;
                    margin-top: 20px;
                    background: #eceadf;
                    color: inherit;
                    background-color: #eceadf;
                    justify-content: center;


                    .padded {
                        padding: 0 10px;
                        display: flex;
                        gap: 10px;

                        .link {
                            a {
                                color: #007bff;
                                cursor: pointer;
                                text-decoration: underline;
                            }
                        }
                    }
                }
            }

            .results li:nth-child(odd) {
                border-right: 1px solid #ccc;
            }
        }
    }
}

</style>