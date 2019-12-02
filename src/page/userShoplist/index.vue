<template>
  <div>
    <van-radio-group v-model="radio">
      <div v-for="(item,index) in List" :key="index" class="list">
        <van-radio @click="ChangeShops(item.Id)" :name="item.Id">{{item.ShopName}}</van-radio>
      </div>
    </van-radio-group>
  </div>
</template>
<script>
export default {
  data() {
    return {
      radio: null,
      List: [],
      name: ""
    };
  },
  created() {
    this.name = this.$route.query.name || 'menulist';
    this.util.QbUserShopsList(this).then(data => {
      this.List = data.Value;
    });
  },
  methods: {
    ChangeShops(id) {
      let json = {
        ShopId: id
      };
      this.util.sendAjax(this, json, "ChangeShops").then(res => {
        this.$router.push({
          path: `/${this.name}`,
          query: { typeState: 1 }
        });
      });
    }
  }
};
</script>
<style lang="less">
.list {
  padding: 20px 15px;
  border-bottom: 1px solid #f6f6f6;
  font-size: 16px;
  .van-radio__label {
    margin-left: 20px;
  }
}
</style>