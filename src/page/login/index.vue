<template>
  <div class="box">
    <ul class="form">
      <h2>掌上买菜</h2>
      <li class="flexbox">
        <span>手机号:</span>
        <van-field v-model="Phone" placeholder="请输入用户名" type="tel" clearable />
      </li>
      <li class="flexbox">
        <span>密码:</span>
        <van-field v-model="Pwd" placeholder="请输入密码" type="password" clearable />
      </li>
    </ul>
    <div class="btn" @click="QbV4Login">登录</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      Pwd: "",
      Phone: ""
    };
  },
  created() {},
  methods: {
    QbUserShopsList(){
let json = {
      };
      this.util.sendAjax(this, json, "QbUserShopsList").then(res => {
      });
    },
        ChangeShops(){
let json = {
  ShopId:id
      };
      this.util.sendAjax(this, json, "ChangeShops").then(res => {
      });
    },
    QbV4Login() {
      let json = {
        Phone: this.Phone,
        Pwd: this.Pwd
      };
      this.util.sendAjax(this, json, "QbV4Login").then(res => {
        window.localStorage.setItem("Guid", res.Value.Guid);
        this.$router.go(-1);
        // this.$router.push("menulist");
      });
    }
  }
};
</script>
<style lang="less" scoped>
.box {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url("../../assets/denglubeijing.png");
  background-repeat: no-repeat;
  background-size: cover;
  .form {
    width: 75%;
    margin: 36vh auto 0;
    // box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
    padding: 20px;
    box-sizing: border-box;
    h2 {
      font-size: 30px;
      text-align: center;
      color: #fff;
      padding-bottom: 60px;
    }
    li {
      margin-bottom: 10px;
      width: 100%;
      color: #fff;
      span {
        font-size: 14px;
        width: 80px;
      }
      input {
        font-size: 14px;
        flex: auto;
        padding: 5px;
        background: transparent;
        border-bottom: 1px solid #fff;
      }
    }
  }
  .btn {
    width: 65%;
    margin: 30px auto 0;
    text-align: center;
    background: #fff;
    padding: 10px 0;
    border-radius: 25px;
    font-size: 14px;
  }
}
</style>