<template>
  <div class="box">
    <div>
      <span>手机:</span>
      <input type="text" v-model="Phone" />
    </div>
    <div>
      <span>密码:</span>
      <input type="text" v-model="Pwd" />
    </div>
    <button @click="QbShopLogin">确认</button>
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
    QbShopLogin() {
      let json = {
        Phone: this.Phone,
        Pwd: this.Pwd
      };
      this.util.sendAjax(this, json, "QbShopLogin").then(res => {
        console.log(res);
        window.localStorage.setItem('Guid',res.Value.Guid);
        this.$router.push("menulist");
      });
    }
  }
};
</script>
<style lang="less" scoped>
.box {
  div {
    font-size: 14px;
    padding: 15px 0;
    input {
      margin-left: 10px;
      padding: 5px;
    }
  }
}
</style>
