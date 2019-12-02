<template>
  <div class="box">
    <cube-scroll :data="orderList" :options="options" @pulling-up="onPullingUp">
      <ul class="list">
        <li class="flexbox" v-for="(item,index) in orderList" :key="index" @click="getInfo(item)">
          <div class="flexbox">
            <span>流水号:</span>
            {{item.OrderNum}}
          </div>
          <div class="flexbox">
            <span>下单时间:</span>
            {{item.CTime}}
          </div>
          <div class="flexbox">
            <span>订单总金额:</span>
            ¥{{item.Price}}
          </div>
          <div class="flexbox">
            <span>订单状态:</span>
            {{item.OState | OStateFun}}
          </div>
          <div class="flexbox">
            <span>是否自取:</span>
            {{item.PsType==1?'是':'否'}}
          </div>
        </li>
      </ul>
    </cube-scroll>
     <div class="noclass" v-if="orderList.length==0">
        <img src="../../assets/zanwushuju.png" />
        <span>暂无数据</span>
      </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      options: {
        pullUpLoad: true
      },
      orderList: [],
      PageIndex: 1
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
    this.ScV7OrderList(true);
  },
  methods: {
    //      加载更多
    onPullingUp() {
      this.PageIndex += 1;
      this.ScV7OrderList(false);
    },
    ScV7OrderList(ref) {
      if (ref) {
        this.PageIndex = 1;
      }
      var json = {
        PageIndex: this.PageIndex,
        PageSize: 10
      };
      this.util.sendAjax(this, json, "ScV7OrderList").then(res => {
        switch (res.State) {
          case 0:
            if (ref) {
              this.orderList = res.Value;
            } else {
              if (!res.HasNext) {
                return;
              }
              if (res.Value.length === 0) {
                this.$toast({
                  message: res.Msg
                });
              } else {
                this.orderList = this.orderList.concat(res.Value);
              }
            }
            break;
          case 1:
            this.$toast({
              message: res.Msg
            });
        }
      });
    },
    getInfo(item) {
      this.$router.push({ path: "/orderInfo", query: { id: item.Id } });
    }
  }
};
</script>
<style lang="less" scoped>
.box {
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: #fff;
}
.list {
  padding: 0 15px;
  li {
    width: 100%;
    padding: 15px 0;
    font-size: 14px;
    border-bottom: 0.5px solid #f6f6f6;
    flex-direction: column;
    align-items: flex-start;
    div {
      width: 100%;
      margin-right: 10px;
      span {
        display: inline-block;
        width: 21%;
      }
    }
  }
}
</style>