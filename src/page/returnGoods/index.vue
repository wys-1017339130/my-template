<template>
  <div>
    <div v-for="(item,index) in dataList" :key="index" class="returnGood">
      <ul class="top">
        <li>
          <span>退货单号:</span>
          {{item.RefundNum}}
        </li>
        <li>
          <span>申请时间:</span>
          {{item.CTime}}
        </li>
        <li v-if='item.RTime'>
          <span>退款时间:</span>
          {{item.RTime}}
        </li>
        <li>
          <span>退货状态:</span>
          {{item.ROstate}}
        </li>
        <li>
          <span>退货原因:</span>
          {{item.Remarks}}
        </li>
        <li>
          <span>退货总金额:</span>
          {{item.Price}}
        </li>
      </ul>
      <div class="menu">
        <!-- <h1>退货信息:</h1> -->
        <ul>
          <li class="flexbox" style="padding-bottom:10px;">
            <span class='font_weight'>商品名称</span>
            <span class='font_weight' style="text-align:center;">数量</span>
            <span class='font_weight'>单价</span>
          </li>
          <li v-for="(child,index) in item.List" :key="index" class="flexbox">
            <span>{{child.GName}}</span>
            <span style="text-align:center;">{{child.RNum}}</span>
            <span>¥{{child.PriceDesc}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dataList: [],
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
    this.ScV7ReturnGoodsInfo();
  },
  methods: {
    ScV7ReturnGoodsInfo() {
      var json = {
        Id: this.Id
      };
      this.util.sendAjax(this, json, "ScV7ReturnGoodsInfo").then(res => {
        this.dataList = res.Value;
      });
    }
  }
};
</script>
<style lang="less" scoped>
.returnGood {
  border-bottom: 3px solid #f6f6f6;
  &:last-child {
    border: none;
  }
}
.top {
  padding: 20px 15px 0;
  font-size: 14px;
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
  .font_weight{
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
</style>