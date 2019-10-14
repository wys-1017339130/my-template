<template>
  <div class="box">
    <p>hhhh</p>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  created() {},
  mounted() {
    QbShopLogin(){
        let json ={};
        this.util.setAjax(this,"QbShopLogin",json).then(res => {
          console.log(res);
        })
    }
  }
}
</script>
<style lang="less" scoped>
.box {
  p {
  }
}
</style>
