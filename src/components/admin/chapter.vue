<template>
  <div class="wrapper fixed">
    <!-- 顶部导航栏 -->
    <header class="main-header animated">

      <nav class="navbar">
        <a href="#" class="sidebar-toggle" >
          <span class="sr-only">小说后台管理系统</span>
        </a>
        <div class="navbar-custom-menu">

          <div class="navbar-dropdown el-dropdown">
            <div class="el-dropdown-link">
              <span>欢迎：admin</span>
              <!--              <img alt="U" src="/image/icon/love.jpg" style="width: 25px; height: 25px; border-radius: 50%; vertical-align: middle;">-->

            </div>
          </div>
        </div>
      </nav>
    </header>

    <!-- 侧边栏 -->
    <aside class="main-sidebar animated showSlide expandSide" >
      <div class="el-scrollbar">
        <div class="vue-scrollbar el-scrollbar__wrap">
          <div class="el-scrollbar__view">
            <div class="sidebar">
              <ul class="el-menu el-menu-style">

                <li class="el-menu-sub el-submenu" >
                  <div class="el-submenu__title" @click="gomanage()" style="padding-left: 20px;">
                    <i class="fa fa-upload"></i>
                    <span>上新小说</span>
                    <i class="el-submenu__icon-arrow" ></i>
                  </div>
                </li>


                <li class="el-menu-sub el-submenu" @click="gochapter()" >
                  <div class="el-submenu__title"  style="padding-left: 20px;">
                    <i class="fa fa-download"></i>
                    <span>章节发布</span>
                    <i class="el-submenu__icon-arrow" ></i>
                  </div>

                </li>
                <li class="el-menu-sub el-submenu" @click="dele()">
                  <div class="el-submenu__title" @click="" style="padding-left: 20px;">
                    <i class="fa fa-cog"></i>
                    <span>删除小说</span>
                    <i class="el-submenu__icon-arrow" ></i>
                  </div>

                </li>

                <li class="el-menu-sub el-submenu" >
                  <div class="el-submenu__title" @click="banner()" style="padding-left: 20px;">
                    <i class="fa fa-download"></i>
                    <span>发布公告</span>
                  </div>
                </li>

                <li class="el-menu-sub el-submenu" >
                  <div class="el-submenu__title" @click="discuss()" style="padding-left: 20px;">
                    <i class="fa fa-download"></i>
                    <span>评论审核</span>
                  </div>
                </li>

                                <li class="el-menu-sub el-submenu" >
                                  <div class="el-submenu__title" @click="user" style="padding-left: 20px;">
                                    <i class="fa fa-download"></i>
                                    <span>用户管理</span>
                                  </div>
                                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- 内容区域 -->
    <div class="content-wrapper">
      <div class="container">
        <div class="top_box">发布章节</div>
        <div class="boxes">
          <div class="box">
            <div class="field"  id="box1">
              <label for="input1">*小说编号</label>
              <input type="text" id="input1" placeholder="小说编号" v-model="chapter.id">
            </div>

            <div class="novel">
              <button  @click = "getBook(chapter.id)"> 查询小说名 </button>
              <span> 小说名： {{ chapter.book}}</span>
            </div>

            <div class="field" >
              <label for="input2">*章节数</label>
              <input type="text" id="input2" placeholder="章节数" v-model="chapter.chapter_num">
            </div>
            <div class="field">
              <label for="input3">*会员阅读</label>
              <select id="input3" v-model="chapter.is_vip">
                <option value="1">是</option>
                <option value="0">否</option>
              </select>
            </div>
          </div>
          <div class="box">
            <div class="field">
              <label for="input4">*章节标题</label>
              <input type="text" id="input4" placeholder="请输入章节标题" v-model="chapter.chapter_name">
            </div>
            <div class="field">
              <label for="input5">章节内容</label>
              <textarea id="input5" v-model="chapter.content"></textarea>
<!--              <quill-editor id="input5"  v-model="chapter.content"></quill-editor>-->
            </div>
          </div>
        </div>
        <div class="buttons">
          <button class="submit-btn" @click="handleSubmitc">提交</button>
          <button class="cancel-btn" @click="handleCancelc">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import QuillEditor from './editor.vue';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import axios from "../../hooks/request.js" ;
let route = useRoute();
let router = useRouter();
// 章节

const chapter = ref({
  id: '',
  chapter_num: '',
  chapter_name: '',
  is_vip: '',
  content: '',
  book:'',
});

// 获取小说名

let getBook = (id) => {
  console.log('bid:' + route.params.bid)
  axios.get(`http://localhost:8080/novel/${id}`).then(res => {
    if (res.data.code === 0) {
       chapter.value.book = res.data.data.novel_title;
      console.log('chapter.book:',chapter.value.book)
    }else {
      console.log(res.data.data)
    }
  })
}

let handleSubmitc = async () => {
  try {
    const res = await axios.post(`http://localhost:8080/novel/${chapter.value.id}/chapter`, {
      chapter_num: chapter.value.chapter_num,
      chapter_name: chapter.value.chapter_name,
      is_vip: chapter.value.is_vip,
      content: chapter.value.content,
    });
    if (res.data.code === 0) {
      ElMessage.success('发布成功！');
    } else {
      ElMessage.warning('发布失败，请稍后再试！' );
    }
  } catch (error) {
    ElMessage.error('发布失败，请检查网络连接！');
  }
};

// 取消操作
const handleCancelc = () => {
  // 清空表单
  for (const key in chapter.value) {
    chapter.value[key] = '';
  }
};



let gochapter = () => {
  router.push("/chapter");
}

let gomanage = () => {
  router.push("/manage");
}
let dele = () => {
  router.push("/dele");
}
let banner = () => {
  router.push("/banner");
}


let discuss = () => {
  router.push("/discuss");
}


let user = () => {
  router.push("/userinfo");
}
</script>

<style scoped>
/* 顶部导航栏样式 */
.main-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #f7eff0;

  z-index: 1030;
}



.navbar {
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 15px;
}

.sidebar-toggle {
  font-size: 18px;
  cursor: pointer;
  margin-right: 15px;
  text-decoration: none;
}

.sr-only{
  color: #0e0f0f;
}

.navbar-custom-menu {
  display: flex;
  align-items: center;
  margin-left: auto;
}

/* 侧边栏样式 */
.main-sidebar {
  position: fixed;
  top: 50px;
  left: 0;
  width: 230px;
  height: calc(100% - 50px);
  overflow: hidden;
  transition: width 0.3s ease;
}

.main-sidebar.collapsed {
  width: 60px;
}

.sidebar {
  height: 100%;
  overflow-y: auto;
  text-decoration: none;
}

.el-menu {
  padding: 0;
  list-style: none;
}


.el-submenu__title {
  display: flex;
  align-items: center;
  height: 50px;
  color: rgba(40, 42, 42, 0.97);
  cursor: pointer;
}

.el-submenu__title:hover {
  background-color: #f7eff0;
}
.el-submenu__title.active {
  background-color: #f7eff0;
}

.el-submenu__icon-arrow {
  margin-left: auto;
  transition: transform 0.3s;
}

.el-submenu__icon-arrow.el-icon-arrow-down {
  transform: rotate(0);
}

.el-submenu__icon-arrow.el-icon-arrow-up {
  transform: rotate(180deg);
}

/* 内容区域样式 */


.content-wrapper {
  margin-top: 50px;
  margin-left: 230px;
  padding: 20px;
  transition: margin-left 0.3s ease;
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f4;
}

.main-sidebar.collapsed + .content-wrapper {
  margin-left: 60px;
}


.container {
  display: flex;
  flex-direction: column;
  width: 95%;
  height: 95%;
  min-width: 772px;
  min-height: 500px;
  border: 1px solid #ccc;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.top_box {
  width: 100%;
  height: 50px;
  font-size:25px;

}


.boxes {
  display: flex;
  width: 100%;
  padding-top: 25px;
}
.box {
  flex: 1;
  margin: 0 10px;
}
.field {
  display: flex;
  align-items: center;
  margin-bottom: 60px;
}

#box1 {
  margin-bottom: 30px;
}
.field label {
  flex: 0 0 100px;
  margin-right: 10px;
  text-align: right;
}

.novel {
  margin-bottom: 40px;
  margin-left: 20px;
}


.field input[type="text"], .field input[type="file"] ,.field select,.field input[type="datetime-local"]
,.field textarea{
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}


.buttons {
  display: flex;
  justify-content: space-between;
  margin: 20px 34% 5px ;
}
.buttons .submit-btn, .buttons .cancel-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  flex: 1;
  margin: 0 10px;
}
.buttons .submit-btn {
  background-color: #28a745;
  color: #fff;
}
.buttons .cancel-btn {
  background-color: #dc3545;
  color: #fff;
}







/* 响应式调整 */
@media (max-width: 767px) {
  .main-header,
  .content-wrapper {
    margin-left: 0;
  }

  .sidebar-toggle {
    display: block;
  }
}
</style>
