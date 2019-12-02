<template>
  <div>
    <ul class="top">
      <li>
        <span>流水号:</span>
        {{obj.OrderNum}}
      </li>
      <li>
        <span>下单时间:</span>
        {{obj.CTime}}
      </li>
      <li>
        <span>店铺地址:</span>
        {{obj.Address}}
      </li>
      <li>
        <span>联系电话:</span>
        {{obj.Phone}}
      </li>
      <li>
        <span>备注:</span>
        {{obj.Remarks}}
      </li>
      <li>
        <span>订单总金额:</span>
        {{obj.Price}}
      </li>
      <li>
        <span>支付方式:</span>
        {{obj.PayType}}
      </li>
      <li class="flexbox">
        <div>
          <span>订单状态:</span>
          {{obj.OState |OStateFun}}
        </div>
        <div class="tip" @click="getReturnpage" v-show="obj.IsTh">查看退货详情</div>
      </li>
      <li v-if="obj.OState==1&obj.PayState==2">
        <span>退款状态:</span>
        {{obj.RStateDesc}}
      </li>
      <li v-if="obj.OState==1&obj.PayState==2">
        <span>退款时间:</span>
        {{obj.RTime}}
      </li>
      <li>
        <span>是否自取:</span>
        {{obj.PsType==1?'是':'否'}}
      </li>
    </ul>
    <div class="menu">
      <!-- <h1>货品列表:</h1> -->
      <ul>
        <li class="flexbox" style="padding-bottom:10px;">
          <span class="font_weight">商品名称</span>
          <span class="font_weight" style="text-align:center;">数量</span>
          <span class="font_weight">单价</span>
        </li>
        <li v-for="(item,index) in obj.List" :key="index" class="flexbox">
          <span>{{item.GName}}</span>
          <span style="text-align:center;">{{item.DiffNum}}</span>
          <span>¥{{item.SalePrice}}/{{item.CName}}</span>
        </li>
      </ul>
    </div>
    <div class="bottom_btn flexbox">
      <span @click="ScV7OrderQuXiao" v-if="obj.OState==0">取消订单</span>
      <span @click="onceMore">再来一单</span>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      obj: {},
      Id: ""
    };
  },
  filters: {
    OStateFun(data) {
      switch (data) {
        case 0:
          return "待处理";
        case 1:
          return "已取消";
        case 2:
          return "已确认";
      }
    }
  },
  created() {
    this.Id = this.$route.query.id;
    this.ScV7OrderInfo();
  },
  methods: {
    getReturnpage() {
      this.$router.push({ path: "/returnGoods", query: { id: this.Id } });
    },
    ScV7OrderInfo() {
      var json = {
        Id: this.Id
      };
      this.util.sendAjax(this, json, "ScV7OrderInfo").then(res => {
        this.obj = res.Value;
      });
    },
    ScV7OrderQuXiao() {
      let that = this;
      this.$dialog
        .confirm({
          title: "确定取消此订单吗"
        })
        .then(() => {
          var json = {
            Id: that.Id
          };
          that.util.sendAjax(that, json, "ScV7OrderQuXiao").then(res => {
            that.$toast({
              message: res.Msg
            });
            that.ScV7OrderInfo();
          });
        })
        .catch(() => {
          // on cancel
        });
    },
    onceMore() {
      sessionStorage.setItem("cart", JSON.stringify(this.obj.List));
      this.$router.push("menulist");
    }
  }
};
</script>
<style lang="less" scoped>
.top {
  padding: 20px 15px;
  font-size: 14px;
  border-bottom: 3px solid #f6f6f6;
  li {
    width: 100%;
    justify-content: space-between;
    padding-bottom: 5px;
    .tip {
      color: #ff5b5b;
    }
  }
}
.menu {
  padding: 10px 15px 45px;
  h1 {
    font-size: 14px;
    color: #6185f9;
  }
  ul {
    margin-top: 20px;
  }
  .font_weight {
    font-weight: 800;
  }
  ul li {
    span {
      flex: 1;
      font-size: 14px;
      &:first-child {
        font-weight: 800;
      }
      &:last-child {
        text-align: right;
      }
    }
  }
}
.bottom_btn {
  position: fixed;
  bottom: 0;
  z-index: 10;
  width: 100%;
  left: 0;
  background: #6185f9;
  color: #fff;
  justify-content: center;
  font-size: 16px;
  span {
    line-height: 45px;
    height: 45px;
    flex: 1;
    text-align: center;
  }
  span:last-child {
    background: #ff5b5b;
  }
}
</style>