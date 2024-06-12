<template>
    <div class="home_box">
        <!-- 新闻资讯 -->
        <div class="news">
            <div class="news_title">
                <span>站内<br>公告</span>
            </div>
            <div class="news_content">
<!--                <a ></a>-->
<!--                <a    @click="goBookDetail(5)">-->
<!--                         三体-->
<!--                </a>-->
<!--                <a   @click="goBookDetail(6)">-->
<!--                    平凡的世界-->
<!--                </a>-->
<!--                <a  @click="goBookDetail(1)">-->
<!--                    追风筝的人-->
<!--                </a>-->
<!--                <a @click="goBookDetail(4)" >-->
<!--                    活着-->
<!--                </a>-->
<!--              <a ></a>-->
              <span>{{obj.bans}}</span>
<!--              本网站所有小说限时免费活动有效期至2024年6月15日为止！！-->

            </div>
        </div>
        <!-- 好看的小说 -->
        <div class="good_novel">
            <div class="good_novel_title">
                <span>为你推荐</span>
                <button @click="showMove()">查看更多&gt;</button>
            </div>
            <div class="good_novel_list">
              <div v-for="(item,index) in obj.books.slice(0, 15)" :key="index" @click="goBookDetail(item.id)">
                <img :src="`${item.cover_image_url}`">
                <div class="good_novel_list_content">
                  <span class="good_novel_list_content_top">{{ item.novel_title }}</span>
                  <span class="good_novel_list_content_middle">{{ cutString(item.introduction, 30) }}</span>
                  <div class="good_novel_list_content_bottom">
                    <span>{{ item.author }}</span>
                    <span>{{ item.tags.join(', ')}} | {{ item.is_finished === 0 ? '未完结': '已完结'}}</span>
                  </div>
                </div>
              </div>
            </div>
        </div>

<!--      最新更新-->

      <div class="new_novel">
        <div class="good_novel_title">
          <span>最新更新</span>
        </div>
        <div class="good_novel_list">
          <div v-for="(ls,index) in obj.newbook" :key="index" @click="goBookDetail(ls.id)">
            <img :src="`${ls.cover_image_url}`">
            <div class="good_novel_list_content">
              <span class="good_novel_list_content_top">{{ ls.novel_title }}</span>
              <span class="good_novel_list_content_middle">{{ cutString(ls.introduction, 30) }}</span>
              <div class="good_novel_list_content_bottom">
                <span>{{ ls.author }}</span>
                <span class="tag">        {{ ls.is_finished === 0 ? '未完结': '已完结'}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import axios from '../hooks/request';
import { onMounted, reactive } from 'vue';
import { cutString } from "../hooks/cutString";
import { useRoute, useRouter } from 'vue-router';

let route = useRoute();
let router = useRouter();

let obj = reactive({
    books: [],
    bans:'',
    newbook:[],
})

let goBookDetail = (bid) => {
    router.push({name: 'bookDetail', params: {bid}});
}

let showMove = () => {
    router.push({
        path: "/hello/bookList"
    });
};
// 获取推荐书籍
// let getBook = () => {
//   console.log('bid:' + route.params.bid)
//   axios.get(`http://localhost:8080/novel/${route.params.bid}`).then(res => {
//     if (res.data.code === 0) {
//       obj.books = res.data.data;
//       getLastChapter();
//     }else {
//       console.log(res.data.data)
//     }
//   })
// }


//获取书籍
const fetchBooks = async () => {
  try {
    const response = await axios.get('http://localhost:8080/novel/recommend');
    if (response.data.code === 0) {
      obj.books = response.data.data; // 假设返回的数据结构中包含 books 数组
      console.log("书籍" + obj.books);
    } else {
      console.error('获取最新书籍失败');
    }
  } catch (error) {
    console.error('请求失败', error);
  }
};

//获取最新书籍
let newbooks = async () => {
  try {
    const ls = await axios.get('http://localhost:8080/novel/latest');
    if (ls.data.code === 0) {
      obj.newbook = ls.data.data; // 假设返回的数据结构中包含 books 数组
      console.log("书籍" + obj.books);
    } else {
      console.error('获取推荐书籍失败');
    }
  } catch (error) {
    console.error('请求失败', error);
  }
};


//获取公告

let ban = () => {
  axios.get('http://localhost:8080/novel/notice').then(res => {
    if (res.data.code === 0) {
      obj.bans = res.data.data;
    }else {
      console.log(res.data.data)
    }
  })
}


onMounted(() => {
  fetchBooks();
  ban();
  newbooks();
})


</script>

<style scoped>
.home_box {
    padding-top: 0.1px;
}

.news {
    width: 100%;
    height: 60px;
    margin: 5px 0;
    box-sizing: border-box;
    border-radius: 20px;
    background-color: #ffffff;
    display: flex;
    justify-content: space-between;
    /* 在子元素之间和两端分配空间 */
    flex-wrap: wrap;
    /* 允许子元素换行 */
    align-items: center;
    /* 垂直居中 */
}

.news_title {
    width: 90px;
    height: 55px;
    margin-left: 6px;
    box-sizing: border-box;
    border-radius: 10px;
    background-image: linear-gradient(to right bottom, #F8A889, #F9503F);
    text-align: center;
}

.news_title span {
    line-height: 22px;
    font-size: 20px;
    font-weight: 400;
    color: #ffffff;
    font-family: "宋体", sans-serif;
}

.news_content {
    width: 1060px;
    display: flex;
    justify-content: center;
    /* 在子元素之间和两端分配空间 */
    flex-wrap: wrap;
    /* 允许子元素换行 */
    align-items: center;
    /* 垂直居中 */
}

.news_content span{

}

.news_content a {
    color: #000000;
    font-size: 16px;
    text-decoration: none;
     cursor: pointer;

}



.good_novel {
    margin-top: 40px;
  display: block;
}


.new_novel {
  margin-top: 380px;
}
.good_novel_title {
    display: flex;
    justify-content: space-between;
    /* 在子元素之间和两端分配空间 */
    flex-wrap: wrap;
    /* 允许子元素换行 */
    align-items: center;
    /* 垂直居中 */
}

.good_novel_title span {
    font-size: 22px;
    font-weight: 600;
}

.good_novel_title button {
    padding: 0 5px;
    border: 1px solid #000000;
    border-radius: 10px;
    background-color: #ffffff00;
    cursor: pointer;
}

.good_novel_list {
    width: 100%;
    height: 500px;
    margin-top: 20px;
    display: grid;
    grid-template-rows: repeat(3, 1fr);
    grid-template-columns: repeat(3, 1fr);
    gap: 20px 40px;
}

.good_novel_list>div{
    display: flex;
    height: 150px;
    cursor: pointer;
}

.good_novel_list>div>img{
    height: 150px;
    cursor: pointer;
}

.good_novel_list_content{
    padding: 15px 10px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    flex-wrap: wrap;

}

.good_novel_list_content_top{
    font-size: 18px;
    font-weight: 600;
    line-height: 30px;
  cursor: pointer;
}

.good_novel_list_content_middle{
    font-size: 14px;
    text-indent: 20px;
    line-height: 25px;
  cursor: pointer;
}

.good_novel_list_content_bottom{
    color: #6f6f6f;
    font-size: 14px;
    line-height: 25px;
    display: flex;
    justify-content: space-between;
  cursor: pointer;
}

.tag {
  margin-left: 35px;
}
</style>