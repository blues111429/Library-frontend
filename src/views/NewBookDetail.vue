<template>
    <Navbar />
    <div class="page_content">
        <div class="breadcrumbs">
            <ul>
                <li><a href="/">首页</a></li>
                <li><a href="/newbooklist">600 ebooks</a></li>
                <li><a :href=" '/newbook/' + bookId " @click="goBookDetail(bookId)">{{ bookId }}</a></li>
            </ul>
        </div>

        <div id="book_title" v-if="book">
            <h1 class="book_title">{{ book.title }}</h1>
        </div>

        <div class="page-body">
            <div class="book-cover-wrapper" v-if="book">
                <img :src="`https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`" alt="封面" class="cover" />
            </div>
            <div class="tab-wrapper" v-if="book">
                <div class="tab">
                    <div class="desc">"{{ book.description }}"</div>
                    <div class="more_stuff">
                        <button
                            :disabled="!book.status"
                            @click="borrowBook"
                            class="borrow_button" >
                            {{ book.status ? "借阅此书" : "该书已下架" }}
                        </button>
                    </div>
                    <div class="about">
                        <h2>关于此书</h2>
                        <table class="bibrec">
                            <colgroup>
                                <col class="narrow">
                                <col>
                            </colgroup>
                            <tbody>
                                <tr><th>作者</th><td>{{ book.author }}</td></tr>
                                <tr><th>出版社</th><td>{{ book.publisher }}</td>
                                </tr>
                                <tr><th>出版日期</th><td>{{ book.publishYear }}</td>
                                </tr>
                                <tr><th>ISBN</th><td>{{ book.isbn }}</td>
                                </tr>
                                <tr><th>语言</th><td>{{ book.language }}</td>
                                </tr>
                                <tr><th>总册数</th><td>{{ book.totalCopies }}</td>
                                </tr>
                                <tr><th>可借册数</th><td>{{ book.availableCopies }}</td>
                                </tr>
                                <tr><th>创建时间</th><td>{{ book.createTime }}</td>
                                </tr>
                                <tr><th>最后修改时间</th><td>{{ book.updateTime }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template> 


<script setup>
import { ref } from "vue";
import { onMounted } from "vue";
import Navbar from "../components/Navbar.vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from '../stores/userStore';
import api from "../api";

const route = useRoute();
const router = useRouter();
const bookId = route.params.id;
const userStore = useUserStore();

const book = ref(null);

const loadBookDetail = async () => {
    try {
        const response = await api.get(`/book/${bookId}`);
        if (response.code === 200 && response.data) {
            book.value = response.data; 
            console.log('书籍详情数据:', book.value);
        } else {
            book.value = null;
        }
    } catch (err) {
        console.log(err);
        book.value = null;
    }
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
            alert(response.message || '借阅失败，请重试');
            console.log(response);
        }
    } catch (err) {
        console.error(err);
        alert('借阅失败，请重试');
    }
};

onMounted(() => {
    loadBookDetail();
});
</script>

<style lang="scss" scoped>
.page_content {
    padding: 0 5vw;
    margin-top: 20px;
    margin-bottom: 30px;

    .breadcrumbs {
        margin-top: 0;
        margin-bottom: 20px;
        font-size: 14px;
        color: #666;

        ul {
            list-style: none;
            padding: 0;
            display: flex;
            gap: 5px;

            li {
                font-size: 16px;
                padding: 5px;

                &:not(:last-child)::after {
                    content: ">";
                    margin-left: 5px;
                    color: #999;
                }

                a {
                    color: rgb(62, 68, 77);
                    text-decoration: none;

                    &:hover {
                        background-color: #c7dde3;
                    }
                }
            }
        }
    }

    #book_title {
        width: 100%;
        font-weight: bold;
        margin-bottom: 20px;
        display: flex;
        text-align: left;
        border-bottom: 1px solid black;
        font-size: 2rem;

        .book_title {
            font-size: 2rem;
            display: flex;
            color: black;
            padding-bottom: 0.75rem;
            margin: 2rem 0 2.25rem;
            line-height: 1.2;
            letter-spacing: 0.01mm;
            word-break: break-word;
        }
    }

    .page-body {
        height: 1000px;

        .book-cover-wrapper {
            padding: 10px;
            width: 200px;
            height: 300px;
            float: left;

            .cover {
                width: 200px;
                object-fit: cover;
                border-radius: 10px;
                border: 1px solid #e0e0e0;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
                transition: transform 0.25s;
            }
        }

        .tab-wrapper {
            margin: 0 1em 0 200px;
            display: flex;

            .tab {
                gap: 20px;
                margin-left: 2em;
                width: 100%;
                height: 100%;

                .desc {
                    padding: 20px;
                    background-color: #f9f9f9;
                }

                .more_stuff {
                    padding: 20px;
                    background-color: #f9f9f9;

                    .borrow_button {
                        background-color: #007bff;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        font-size: 16px;
                        cursor: pointer;
                        border-radius: 5px;
                        transition: background-color 0.3s;

                        &:disabled {
                            background-color: #ccc;
                            cursor: not-allowed
                        }

                        &:hover {
                            background-color: #0056b3;
                        }
                    }
                }

                .about {
                    padding: 20px;
                    background-color: #f9f9f9;

                    .bibrec {
                        font-size: 16px;
                        padding: 0;
                        border-spacing: 0;
                        margin: 1em 0;
                        color: #222;
                        border: none;
                        width: 100%;
                        background-color: white;
                        border-collapse: collapse;

                        th,
                        td {
                            padding: 12px 15px;
                            text-align: left;
                            border-bottom: 1px solid #ddd;
                        }

                        th {
                            background-color: #f4f4f4;
                            color: #333;
                            font-weight: bold;
                        }

                        tr:nth-child(even) {
                            background-color: #f9f9f9;
                        }

                        tr:hover {
                            background-color: #f1f1f1;
                        }

                        td {
                            color: #555;
                            word-break: break-word;
                        }

                        .narrow {
                            width: 15%;
                        }
                    }
                }
            }
        }
    }
}
</style>