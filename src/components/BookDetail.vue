<template>
  <div class="book_detail_box">
    <div class="book_detail_title">
      <span>小说详情</span>
      <button @click="router.go(-1)">返回上一页&gt;</button>
    </div>
    <div class="book_detail_top">
      <img :src="`${obj.book.cover_image_url}`" class="book_detail_img" />
      <div class="book_detail_content">
        <span class="book_detail_content_name">{{ obj.book.novel_title }}</span>
        <span class="book_detail_content_author">{{ obj.book.author }}</span>
        <div class="book_detail_content_tag">
                    <span class="book_detail_content_type">
                        {{ obj.book.type }}
                    </span>
          <span>
                        {{ obj.book.state }}
                    </span>
          <span>
                        {{ obj.book. is_finished === 1 ? '已完结' : '正在更新' }}
                    </span>

          <div class="point">
            <span> 分数：{{ obj.point }}</span>
            <span>评分：</span>
            <el-rate
                v-model="point" @change="postpoint">
            </el-rate>
          </div>
        </div>
        <div>
                    <span class="book_detail_content_issuedTime">
                        更新时间：{{ obj.book.update_time }}
                    </span>
          <span>
                        {{ obj.lastChapterNum == 0 ? '未阅读' : `已看章节：第${obj.lastChapterNum}章  ${obj.lastChapter}` }}
                    </span>
        </div>
        <div class="book_detail_content_but_box">
          <button class="book_detail_content_but_read" @click="readBook(obj.lastChapterNum)">
            {{ obj.lastChapterNum === 1 ? '立即阅读' : '继续阅读' }}
          </button>
          <!--          <div class="book_detail_content_but_praise" @click="thumbsUp()">-->
          <!--            <img src="/image/icon/praise.png" alt="">-->
          <!--            <span>好评</span>-->
          <!--          </div>-->
          <div class="book_detail_content_but_collect" @click="collectBook()">
            <img src="/image/icon/love.png" alt="">
            <span>收藏</span>
          </div>
        </div>
      </div>
    </div>
    <div class="book_detail_introduction_box">
      <div class="book_detail_introduction_title">
        <span>书籍简介</span>
      </div>
      <div class="book_detail_introduction_content">
        <span>{{ obj.book.introduction }}</span>
      </div>
    </div>

    <div class="book_detail_chapters_box">
      <div class="book_detail_chapters_title">
        <span>书籍章节</span>
      </div>
      <!--      <ul class="book_detail_chapters_content">-->
      <!--        <li v-for="item in obj.book.chapters" :key="item.chapterNum" @click="readBook(item.chapterNum)">-->
      <!--          <span>第{{ item.chapterNum }}章</span>-->
      <!--&lt;!&ndash;          <span>《{{ item.title }}》</span>&ndash;&gt;-->
      <!--        </li>-->
      <!--      </ul>-->

      <ul class="book_detail_chapters_content">
        <!-- 静态生成前6章 -->
        <li v-for="chapterNum in obj.chanum" :key="chapterNum" @click="readBook(chapterNum)">
          <span>第{{ chapterNum }}章</span>
        </li>
      </ul>
      <!--      <ul class="book_detail_chapters_content">-->
      <!--        &lt;!&ndash; 静态生成6-12章 &ndash;&gt;-->
      <!--        <li v-for="chapterNum in 6" :key="chapterNum" @click="readBook(6 + chapterNum)">-->
      <!--          <span>第{{ 6 + chapterNum }}章</span>-->
      <!--        </li>-->
      <!--      </ul>-->
      <!--      <ul class="book_detail_chapters_content">-->
      <!--        &lt;!&ndash; 静态生成6-12章 &ndash;&gt;-->
      <!--        <li v-for="chapterNum in 6" :key="chapterNum" @click="readBook(12 + chapterNum)">-->
      <!--          <span>第{{ 12 + chapterNum }}章</span>-->
      <!--        </li>-->
      <!--      </ul>-->

    </div>

    <!--    评论-->

    <div class="pinglun">
      <div v-clickoutside="hideReplyBtn" @click="inputFocus" class="my-reply">
        <el-avatar class="header-img" :size="40" :src="myHeader"></el-avatar>
        <div class="reply-info">
          <div
              tabindex="0"
              contenteditable="true"
              id="replyInput"
              spellcheck="false"
              placeholder="输入评论..."
              class="reply-input"
              @focus="showReplyBtn"
              ref="commentInput"
          ></div>
        </div>
        <div class="reply-btn-box" v-show="btnShow">
          <el-button class="reply-btn" size="medium" @click="sendCommentReply" type="primary">发表评论</el-button>
        </div>
      </div>
      <div v-for="(item, i) in obj.discuss" :key="i" class="author-title reply-father">
        <el-avatar class="header-img" :size="40" :src="item.headImg"></el-avatar>
        <div class="author-info">
          <span class="author-name">{{ item.nick_name }}</span>
          <span class="author-time">{{ item.create_time }}</span>
        </div>
        <div class="icon-btn">
          <span @click="showReplyInput(i, item.nick_name, item.id)">点击回复<i class="iconfont el-icon-s-comment"></i>{{ item.commentNum }}</span>
          <i class="iconfont el-icon-caret-top"></i>{{ item.like }}
        </div>
        <div class="talk-box">
          <p><span class="reply">{{ item.text }}</span></p>
        </div>
        <div class="reply-box">
          <div v-for="(reply, j) in item.reply_list" :key="j" class="author-title">
            <el-avatar class="header-img" :size="40" :src="reply.fromHeadImg"></el-avatar>
            <div class="author-info">
              <span class="author-name">{{ reply.nick_name}}</span>
              <span class="author-time">{{ reply.create_time }}</span>
            </div>
            <div class="icon-btn">
              <span @click="showReplyInput(i, reply.from, reply.id)"><i class="iconfont el-icon-s-comment"></i>{{ reply.commentNum }}</span>
              <i class="iconfont el-icon-caret-top"></i>{{ reply.like }}
            </div>
            <div class="talk-box">
              <p><span>回复 {{ item.nick_name }}:</span><span class="reply">{{ reply.text }}</span></p>
            </div>
          </div>
        </div>
        <div v-show="_inputShow(i)" class="my-reply my-comment-reply">
          <el-avatar class="header-img" :size="40" :src="myHeader"></el-avatar>
          <div class="reply-info">
            <!--            <div-->
            <!--                tabindex="0"-->
            <!--                contenteditable="true"-->
            <!--                id="replyInput2"-->
            <!--                spellcheck="false"-->
            <!--                placeholder="输入评论..."-->
            <!--                class="reply-input"-->
            <!--                v-model="replyContent"-->
            <!--                @focus="showReplyBtn"-->
            <!--            ></div>-->
            <el-input  v-model="replyContent" placeholder="请输入内容" @focus="showReplyBtn"></el-input>
          </div>
          <div class="reply-btn-box">
            <el-button class="reply-btn" size="medium" @click="huifu(item.id, i)" type="primary">发表评论</el-button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import axios from '../hooks/request';
import { onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';

let route = useRoute();
let router = useRouter();

let obj = reactive({
  book: {},
  lastChapter: '',
  lastChapterNum: 1,
  discuss:{},
  novels:[],
  point:'',
  chanum:'',
})

//收藏图书
let collectBook = () => {
  let user = sessionStorage.getItem('user');
  if (user) {
    let uid = JSON.parse(user).uid;
    axios.post(`http://localhost:8080/user/bookshelf?novel_id=${route.params.bid}`).then(res => {
      if (res.data.code == 0) {
        alert("收藏成功！")
      } else if (res.data.code == 403) {
        alert("重复收藏！")
      } else {
        alert("收藏失败！")
      }
    })
  } else {
    if (confirm("此操作需要登录，是否登录？")) {
      router.push({ path: '/login' });
    }
  }
}
let point = ref(null);
// 提交评分
// 评分http://localhost:8080/novel/1184/rate?rating=9
let postpoint = () => {
  axios.post(`http://localhost:8080/novel/${route.params.bid}/rate?rating=${point.value}`).then(res => {
    if (res.data.code === 0) {
      ElMessage.success('评分成功！')
      // console.log(res.data.data)
    }else {
      console.log(res.data.data)
    }
  })
}
// 获取评分 http://localhost:8080/novel/1216/rate
let getpoint = () => {
  axios.get(`http://localhost:8080/novel/${route.params.bid}/rate`).then(res => {
    if (res.data.code === 0) {
      obj.point = res.data.data;
      console.log(res.data.data)
    }else {
      console.log(res.data.data)
    }
  })
}

// 获取章节 http://localhost:8080/novel/1204/chapter
let getchapter = () => {
  axios.get(`http://localhost:8080/novel/${route.params.bid}/chapter`).then(res => {
    if (res.data.code === 0) {
      obj.chanum= res.data.data.length;
      // console.log('obj.chanum:', obj.chanum)
    }else {
      console.log(res.data.data)
    }
  })
}


let getBook = () => {
  console.log('bid:' + route.params.bid)
  axios.get(`http://localhost:8080/novel/${route.params.bid}`).then(res => {
    if (res.data.code === 0) {
      obj.book = res.data.data;
      getLastChapter();
    }else {
      console.log(res.data.data)
    }
  })
}

// 获取评论
let getdiscuss = () => {
  axios.get(`http://localhost:8080/novel/${route.params.bid}/comment`).then(res => {
    if (res.data.code === 0) {
      obj.discuss = res.data.data;
      console.log("pinglun:" + res.data.data)
    }else {
      console.log(res.data.data)
    }
  })
}

// 回复评论


// const replay = ref(null);
let replyContent = ref(null);
const huifu = (id) => {
  // const repl =replay.value.innerHTML;


  axios.post(`http://localhost:8080/novel/reply?id=${id}&reply=${replyContent.value}`).then(res => {
    if (res.data.code === 0) {
      ElMessage.success('回复成功！');
      getdiscuss(); // Refresh comments after reply
    } else {
      console.log(res.data.data);
    }
  });
};


const commentInput = ref(null);
// 发送评论
const sendCommentReply = async () => {
  // 获取评论内容
  const commentContent = commentInput.value.innerHTML;

  // 检查评论内容是否为空
  // if (!commentContent.trim()) {
  //   ElMessage.error('评论内容不能为空！');
  //   return;
  // }

  try {
    // 发送POST请求
    const response = await axios.post(`http://localhost:8080/novel/${route.params.bid}/comment?text=${commentContent}`);

    // 检查响应结果
    if (response.data.code === 0) {
      ElMessage.success('评论成功！');
      // 清空评论输入框
      commentInput.value.innerHTML = '';
    } else {
      ElMessage.error('评论失败，请稍后再试！');
    }
  } catch (error) {
    ElMessage.error('评论提交失败，请检查网络连接！');
  }
};




// 获取阅读的章节
let getLastChapter = () => {
  let user = sessionStorage.getItem('user');
  if (user) {
    axios.get("http://localhost:8080/user/history").then(res => {
      if (res.data.code === 0) {
        obj.novels = res.data.data;
        console.log('obj.novels章节:', obj.novels[0].chapter_num); // 使用逗号而不是加号来打印数组

        let found = false;
        for (let i = 0; i < obj.novels.length; i++) {
          // console.log('Checking novel_id:', obj.novels[i].novel_id); // 打印正在检查的 novel_id
          // console.log('route.params.bid:',route.params.bid)
          if (obj.novels[i].novel_id == route.params.bid) {
            obj.lastChapterNum = obj.novels[i].chapter_num;
            obj.lastChapter =  obj.novels[i].chapter_name;
            console.log('Found matching novel. obj.lastChapterNum:', obj.lastChapterNum);
            found = true;
            break; // 找到匹配的小说后退出循环
          }
        }



        // 如果没有找到匹配的 novel_id，则打印 lastChapterNum 还是之前的值
        console.log('obj.lastChapterNum:', obj.lastChapterNum);
      }
    }).catch(error => {
      console.error('Error fetching user history:', error);
    });
  } else {
    obj.lastChapter = 0;
  }
};

// 传递
let readBook = (chapterNum) => {
  axios.get(`http://localhost:8080/novel/${route.params.bid}/chapter`).then(res => {
    if (res.data.code === 0) {
      obj.chacon = res.data.data;
      for (let i = 0; i < obj.chacon.length; i++) {
        if (obj.chacon[i].chapter_num == chapterNum) {
          obj.isvip = obj.chacon[i].is_vip;
          break; // 找到匹配的章节后退出循环
        }
      }
      // 在回调中调用 new1 确保 isvip 已经被赋值
      new1(chapterNum);
    } else {
      console.log(res.data.data);
    }
  });
};

let new1 = (chapterNum) => {
  let vipnum = obj.isvip; // 获取最新的 isvip 值
  console.log('obj.isvip:', vipnum); // Debug log
  router.push({
    path: '/readBook',
    query: {
      bid: obj.book.id,
      chapterNum,
      title: obj.lastChapter,
      isvip: vipnum
    }
  });
};

onMounted(() => {
  getBook();
  getdiscuss();
  getpoint();
  getchapter();

})
</script>

<script>
const clickoutside = {
  // 初始化指令
  bind(el, binding, vnode) {
    function documentHandler(e) {
      // 这里判断点击的元素是否是本身，是本身，则返回
      if (el.contains(e.target)) {
        return false;
      }
      // 判断指令中是否绑定了函数
      if (binding.expression) {
        // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
        binding.value(e);
      }
    }
    // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
    el.vueClickOutside = documentHandler;
    document.addEventListener('click', documentHandler);
  },
  update() {},
  unbind(el, binding) {
    // 解除事件监听
    document.removeEventListener('click', el.vueClickOutside);
    delete el.vueClickOutside;
  },
};



export default {
  name:'张欣欣',
  data(){
    return{
      btnShow: false,
      index:'0',
      replyComment:'',
      myName:'王欣欣',
      myHeader:'',
      myId:19870621,
      to:'',
      toId:-1,
      comments:[
        {
          name:'张欣然',
          id:19870621,
          headImg:'',
          comment:'书很赞，情节很有吸引力',
          time:'2024年5月1日 18:43',
          commentNum:2,
          like:15,
          inputShow:false,
          reply:[
            {
              from:'王小小',
              fromId:19891221,
              fromHeadImg:'',
              to:'张欣然',
              toId:19870621,
              comment:'很中肯',
              time:'2024年5月1日 18:44',
              commentNum:1,
              like:15,
              inputShow:false
            },
            {
              from:'歆然',
              fromId:1123,
              fromHeadImg:'',
              to:'张欣然',
              toId:19870621,
              comment:'喜欢你的评论',
              time:'2024年5月1日 18:43',
              commentNum:0,
              like:5,
              inputShow:false

            }
          ]
        },
        {
          name:'李可',
          id:19891221,
          headImg:'',
          comment:'我很喜欢名著尤其是这本',
          time:'2024年5月1日 18:43',
          commentNum:1,
          like:5,
          inputShow:false,
          reply:[
            {
              from:'辛克',
              fromId:19870621,
              fromHeadImg:'https://ae01.alicdn.com/kf/Hd60a3f7c06fd47ae85624badd32ce54dv.jpg',
              to:'李可',
              toId:19891221,
              comment:'我喜欢他，虽然不知道他是名著！',
              time:'2024年5月1日 18:43',
              commentNum:25,
              like:5,
              inputShow:false

            }
          ]
        },
        {
          name:'大信心',
          id:20190830,
          headImg:'https://ae01.alicdn.com/kf/Hdd856ae4c81545d2b51fa0c209f7aa28Z.jpg',
          comment:'Plz buy Norman Fucking Rockwell on everywhere',
          time:'2024年5月1日 18:45',
          commentNum:0,
          like:5,
          inputShow:false,
          reply:[]
        },
      ]
    }
  },
  directives: {clickoutside},
  methods: {
    inputFocus(){
      var replyInput = document.getElementById('replyInput');
      replyInput.style.padding= "8px 8px"
      replyInput.style.border ="2px solid blue"
      replyInput.focus()
    },
    showReplyBtn(){
      this.btnShow = true
    },
    hideReplyBtn(){
      this.btnShow = false
      replyInput.style.padding= "10px"
      replyInput.style.border ="none"
    },
    showReplyInput(i,name,id){
      this.comments[this.index].inputShow = false
      this.index =i
      this.comments[i].inputShow = true
      this.to = name
      this.toId = id
    },
    _inputShow(i){
      return this.comments[i].inputShow
    },
    sendComment(){
      if(!this.replyComment){
        this.$message({
          showClose: true,
          type:'warning',
          message:'评论不能为空'
        })
      }else{
        let a ={}
        let input =  document.getElementById('replyInput')
        let timeNow = new Date().getTime();
        let time= this.dateStr(timeNow);
        a.name= this.myName
        a.comment =this.replyComment
        a.headImg = this.myHeader
        a.time = time
        a.commentNum = 0
        a.like = 0
        this.comments.push(a)
        this.replyComment = ''
        input.innerHTML = '';

      }
    },
    sendCommentReply(i,j){
      if(!this.replyComment){
        this.$message({
          showClose: true,
          type:'warning',
          message:'评论不能为空'
        })
      }else{
        let a ={}
        let timeNow = new Date().getTime();
        let time= this.dateStr(timeNow);
        a.from= this.myName
        a.to = this.to
        a.fromHeadImg = this.myHeader
        a.comment =this.replyComment
        a.time = time
        a.commentNum = 0
        a.like = 0
        this.comments[i].reply.push(a)
        this.replyComment = ''
        document.getElementsByClassName("reply-comment-input")[i].innerHTML = ""
      }
    },
    onDivInput: function(e) {
      this.replyComment = e.target.innerHTML;
    },
    dateStr(date){
      //获取js 时间戳
      var time=new Date().getTime();
      //去掉 js 时间戳后三位，与php 时间戳保持一致
      time=parseInt((time-date)/1000);
      //存储转换值
      var s;
      if(time<60*10){//十分钟内
        return '刚刚';
      }else if((time<60*60)&&(time>=60*10)){
        //超过十分钟少于1小时
        s = Math.floor(time/60);
        return  s+"分钟前";
      }else if((time<60*60*24)&&(time>=60*60)){
        //超过1小时少于24小时
        s = Math.floor(time/60/60);
        return  s+"小时前";
      }else if((time<60*60*24*30)&&(time>=60*60*24)){
        //超过1天少于30天内
        s = Math.floor(time/60/60/24);
        return s+"天前";
      }else{
        //超过30天ddd
        var date= new Date(parseInt(date));
        return date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate();
      }
    }
  },
}
</script>
<style scoped>
.book_detail_box {
  padding-top: 0.1px;
}

.book_detail_title {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  /* 在子元素之间和两端分配空间 */
  flex-wrap: wrap;
  /* 允许子元素换行 */
  align-items: center;
  /* 垂直居中 */
}

.book_detail_title span {
  font-size: 22px;
  font-weight: 600;
}

.book_detail_title button {
  padding: 0 5px;
  border: 1px solid #000000;
  border-radius: 10px;
  background-color: #ffffff00;
  cursor: pointer;
}

.book_detail_top {
  height: 250px;
  margin-top: 30px;
  display: flex;
}

.book_detail_content {
  width: 600px;
  padding: 15px 35px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.book_detail_content_name {
  font-weight: 600;
  font-size: 30px;
}

.book_detail_content_author {
  color: #ff1500;
}

.book_detail_content_type {
  margin-right: 30px;
  padding: 0 10px;
  display: inline-block;
  border-radius: 5px;
  background-color: #e8e8e8;
  font-size: 14px;
  line-height: 25px;
}

.book_detail_content_tag span:last-of-type {
  margin-left: 50px;
}

.book_detail_content_issuedTime {
  display: inline-block;
  margin-right: 30px;
}

.book_detail_content_but_box {
  display: flex;
}

.book_detail_content_but_read {
  width: 170px;
  height: 50px;
  margin-right: 110px;
  border: none;
  border-radius: 25px;
  background-color: #CB3D30;
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
}

.book_detail_content_but_praise,
.book_detail_content_but_collect {
  margin: 0 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.book_detail_content_but_praise img,
.book_detail_content_but_collect img {
  width: 30px;
}

.book_detail_introduction_box
{
  margin-top: 40px;
}

.book_detail_introduction_title,
.book_detail_chapters_title {
  border-bottom: 1px solid #808080;
}


.book_detail_chapters_box {
  width: 100%;
  max-height: 300px; /* Height to display 3 rows */
  overflow-y: auto; /* Enable vertical scrolling */
}

.book_detail_chapters_content {
  display: grid;
  grid-template-columns: repeat(6, 1fr); /* 6 items per row */
  gap: 10px; /* Space between items */
  padding: 10px;
  list-style: none;
}



.book_detail_introduction_title span{
  line-height: 60px;
  font-weight: 600;
  font-size: 24px;
}

.point{
  //width: 200px;
  //flex: 1;
  //margin-left: 100px;
  //margin-top: 30px;
}


.book_detail_introduction_content {
  margin: 0;
  text-indent: 50px
}


.book_detail_chapters_content li {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px; /* Adjust based on desired item height */
  background-color: #f0f0f0; /* Example background color */
  border: 1px solid #ddd; /* Example border */
  cursor: pointer;
}
.book_detail_introduction_content span {
  font-size: 18px;
  line-height: 50px;
}





.book_detail_chapters_content li:hover {
  color: #ff0000;
}

.book_detail_chapters_content li span {
  margin: auto;
}



.pinglun {
  padding: 50px 0;
}

.my-reply {
  padding: 10px;
  background-color: #fafbfc;
}

.my-reply .header-img {
  display: inline-block;
  vertical-align: top;
}

.my-reply .reply-info {
  display: inline-block;
  margin-left: 5px;
  width: 90%;
}

@media screen and (max-width: 1200px) {
  .my-reply .reply-info {
    width: 80%;
  }
}

.my-reply .reply-info .reply-input {
  min-height: 20px;
  line-height: 22px;
  padding: 10px 10px;
  color: #ccc;
  background-color: #fff;
  border-radius: 5px;
  position: relative;
}

.my-reply .reply-info .reply-input:empty::before {
  content: attr(placeholder);
  position: absolute;
  left: 10px;
  top: 10px;
  color: #ccc;
}

.my-reply .reply-info .reply-input:focus::before {
  content: none;
}

.my-reply .reply-info .reply-input:focus {
  padding: 8px 8px;
  border: 2px solid blue;
  box-shadow: none;
  outline: none;
}

.my-reply .reply-btn-box {
  height: 25px;
  margin: 10px 0;
}

.my-reply .reply-btn-box .reply-btn {
  position: relative;
  float: right;
  margin-right: 15px;
}

.my-comment-reply {
  margin-left: 50px;
}


.my-comment-reply {
  display: flex;
  margin-left: 50px;
}

.my-comment-reply .reply-input {
  flex: 1;
  min-width: 0; /* 确保在 flex 容器中正确缩放 */
}


.author-title:not(:last-child) {
  border-bottom: 1px solid rgba(178, 186, 194, 0.3);
}

.author-title {
  padding: 10px;
}

.author-title .header-img {
  display: inline-block;
  vertical-align: top;
}

.author-title .author-info {
  display: inline-block;
  margin-left: 5px;
  width: 60%;
  height: 40px;
  line-height: 20px;
}

.author-title .author-info > span {
  display: block;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.author-title .author-info .author-name {
  color: #000;
  font-size: 14px;
  font-weight: bold;
}

.author-title .author-info .author-time {
  font-size: 14px;
}

.author-title .icon-btn {
  width: 30%;
  padding: 0 !important;
  float: right;
}

@media screen and (max-width: 1200px) {
  .author-title .icon-btn {
    width: 20%;
    padding: 7px;
  }
}

.author-title .icon-btn > span {
  cursor: pointer;
}

.author-title .icon-btn .iconfont {
  margin: 0 5px;
}

.author-title .talk-box {
  margin: 0 50px;
}

.author-title .talk-box > p {
  margin: 0;
}

.author-title .talk-box .reply {
  font-size: 16px;
  color: #000;
}

.author-title .reply-box {
  margin: 10px 0 0 50px;
  background-color: #efefef;
}
</style>
