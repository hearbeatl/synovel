<template>
    <div class="user_information_box">
        <div class="user_information">
            <div class="user_information_title">
                <span>用户资料</span>
                <button @click="router.go(-1)">返回&gt;</button>
            </div>
            <div class="user_information_table">
                <table>
                    <tr>
                        <td>账号：</td>
                        <td>
                            <input :readonly="true" v-model="obj.user.user_name">
                        </td>
                    </tr>
                    <tr>
                        <td>昵称：</td>
                        <td>
                            <input :readonly="true" v-model="obj.user.nick_name">
                        </td>
                    </tr>

                  <tr>
                    <td>旧密码：</td>
                    <td>
                      <input  type="password" :readonly="!obj.isChange" v-model="oldPassword" >
                    </td>
                  </tr>
                  <tr>
                    <td>新密码：</td>
                    <td>
                      <input type="password"  :readonly="!obj.isChange"  v-model="newPassword">
                    </td>
                  </tr>
<!--                    <tr>-->
<!--                        <td>性别：</td>-->
<!--                        <td>-->
<!--                            <input v-if="!obj.isChange" :readonly="!obj.isChange" v-model="obj.user.sex">-->
<!--                            <div v-if="obj.isChange">-->
<!--                                <input type="radio" name="sex" :value="null" v-model="obj.user.sex">保密&nbsp;&nbsp;-->
<!--                                <input type="radio" name="sex" value="男" v-model="obj.user.sex">男&nbsp;&nbsp;-->
<!--                                <input type="radio" name="sex" value="女" v-model="obj.user.sex">女&nbsp;&nbsp;-->
<!--                            </div>-->
<!--                        </td>-->
<!--                    </tr>-->
<!--                    <tr>-->
<!--                        <td>Email：</td>-->
<!--                        <td>-->
<!--                            <input :readonly="true" v-model="obj.user.email">-->
<!--                        </td>-->
<!--                    </tr>-->
<!--                    <tr>-->
<!--                        <td>QQ：</td>-->
<!--                        <td>-->
<!--                            <input :readonly="!obj.isChange" v-model="obj.user.qq">-->
<!--                        </td>-->
<!--                    </tr>-->
<!--                    <tr>-->
<!--                        <td>博客/微博：</td>-->
<!--                        <td>-->
<!--                            <input :readonly="!obj.isChange" v-model="obj.user.microblog">-->
<!--                        </td>-->
<!--                    </tr>-->
                    <tr>
                        <td>注册日期：</td>
                        <td>
                            <input :readonly="true" v-model= "obj.user.create_time" >
                        </td>
                    </tr>
                    <tr>
                        <td>是否是vip</td>
                        <td>
                            <input  :readonly="true" v-model="chapterStatus">
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>
                            <button v-if="!obj.isChange" @click="updateBut()">修改</button>
                            <button v-if="obj.isChange" @click="submitUpdateBut()">提交</button>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from "../hooks/request";
import {computed, onMounted, reactive} from "vue";
import { useRoute, useRouter } from "vue-router";
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
let route = useRoute();
let router = useRouter();

let obj = reactive({
    isChange: false,
    user: {}
});
// 定义响应式变量
const oldPassword = ref('');
const newPassword = ref('');

let getUser = () => {
  // 从本地存储获取JWT令牌
  const token = localStorage.getItem('token');

// 设置请求头以包含JWT令牌
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
  console.log('1')
  // Send a GET request to fetch user information
  axios.get('http://localhost:8080/user/info', config)
      .then(res => {
        console.log('1')
        console.log(res.data.code)
        if (res.data.code === 0) {
          obj.user = res.data.data;
          console.log("User information:", obj.user);
          obj.user.create_time;
        } else {
          console.error("Failed to fetch user information:", res.data.msg);
        }
      })
      .catch(error => {
        console.error("Failed to make user information request:", error);
      });
}

let updateBut = () => {
    obj.isChange = true;
}

// 获取会员信息
const chapterStatus = computed(() => {
  return obj.user.user_status == 1 ? '普通用户' : 'VIP';
});
// let submitUpdateBut = () => {
//     axios.put("http://localhost:8080/user/update", obj.user).then(res => {
//         if (res.data.code == 200) {
//             getUser(obj.user.uid);
//             obj.isChange = false;
//             axios.get("/user/token/getUserById/" + obj.user.uid).then(res2 => {
//                 if (res2.data.code == 200) {
//                     obj.user = res2.data.data;
//                     sessionStorage.setItem("user", JSON.stringify(res2.data.data));
//                     location.reload();
//                 }
//             })
//         } else {
//             alert('修改失败！')
//         }
//     })
// }

// let obj = reactive({
//   isChange: false,
//   user: {}
// });
// 修改密码
let submitUpdateBut = () => {
  axios.patch("http://localhost:8080/user/updatePwd", {
    'old_password':oldPassword.value,
    'new_password':newPassword.value,
  }).then(res => {
    if (res.data.code == 0) {
      getUser(obj.user);
      obj.isChange = false;
      //  obj.user = {
      //   id: obj.user.id,
      //   user_name: obj.user.user_name,
      //   nick_name: obj.user.nick_name,
      //   email: obj.user.email.com,
      // }
      console.log('修改后的' + obj.user)
      // axios.get("/user/token/getUserById/" + obj.user.uid).then(res2 => {
      //   if (res2.data.code == 1) {
      //     obj.user = res2.data.data;
      //     sessionStorage.setItem("user", JSON.stringify(res2.data.data));
      //     location.reload();
      //   }
      // })
      ElMessage.success('修改成功！！！')
    }
    else {
      ElMessage.warning('密码错误！')
    }
  })
}



onMounted(() => {
    let user = JSON.parse(sessionStorage.getItem("user"));
    getUser(user.uid);
})



</script>

<style scoped>
.user_information_box {
    padding-top: 0.1px;
}

.user_information {
    margin-top: 40px;
}

.user_information_title {
    display: flex;
    justify-content: space-between;
    /* 在子元素之间和两端分配空间 */
    flex-wrap: wrap;
    /* 允许子元素换行 */
    align-items: center;
    /* 垂直居中 */
}

.user_information_title span {
    font-size: 22px;
    font-weight: 600;
}

.user_information_title button {
    padding: 0 5px;
    border: 1px solid #000000;
    border-radius: 10px;
    background-color: #ffffff00;
    cursor: pointer;
}



.user_information_table {
    margin: 20px;
}

.user_information_table table {
    width: 100%;
    border-collapse: collapse;
    background-color: #f9f9f9;
    border-radius: 5px;
}

.user_information_table td {
    padding: 10px;
    border-bottom: 1px solid #e0e0e0;
}

.user_information_table td:first-child {
    font-weight: bold;
}

.user_information_table button {
    background-color: #3498db;
    color: #ffffff;
    border: none;
    padding: 8px 16px;
    border-radius: 3px;
    cursor: pointer;
}

.user_information_table button:hover {
    background-color: #2980b9;
}

.user_information_table input {
    outline: none;
    /* 取消默认的轮廓样式 */
}

/* 只读的 input 样式 */
.user_information_table input[readonly] {
    background-color: rgba(0, 0, 0, 0);
    /* 设置背景色 */
    border: none;
    /* 设置边框样式 */
    color: #666;
    /* 设置文字颜色 */
    cursor: not-allowed;
    /* 鼠标样式 */
    padding: 6px;
    /* 设置内边距 */
}

/* 普通的 input 样式 */
.user_information_table input:not([readonly]) {
    background-color: #fff;
    /* 设置背景色 */
    border: 1px solid #999;
    /* 设置边框样式 */
    color: #333;
    /* 设置文字颜色 */
    cursor: text;
    /* 鼠标样式 */
    padding: 5px;
    /* 设置内边距 */
    border-radius: 3px;
    /* 设置圆角 */
}
</style>