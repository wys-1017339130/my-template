<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import remoteLoad from './remoteLoad.js'
export default {
  name: "app",
  async created() {
    await remoteLoad("https://res.wx.qq.com/open/js/jweixin-1.3.2.js");
  }
};
</script>

<style>
</style>

