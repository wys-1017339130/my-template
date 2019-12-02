<template>
  <div class="box">
    <ul class="list">
      <li class="item flexbox">
        <span>店铺名称:</span>
        <input type="text" placeholder disabled v-model="obj.ShopName" />
      </li>
      <li class="item flexbox">
        <span>店铺地址:</span>
        <input type="text" placeholder="请输入店铺地址" v-model="obj.ShopAddress" />
      </li>
      <li class="item flexbox">
        <span>联系电话:</span>
        <input type="text" placeholder="请输入联系电话" v-model="obj.ContactsPhone" />
      </li>
      <li class="item flexbox">
        <span>备注:</span>
        <input type="text" placeholder="请输入备注" v-model="Remarks" />
      </li>
      <li class="item flexbox" @click="sheetShow=true">
        <span>支付方式</span>
        <div style="padding-left:5px;">{{ctype.name || '请选择支付方式'}}</div>
        <img
          src="../../assets/jiantou_lanse.png"
          alt
          class="right_img"
          width="20"
          v-if="actions.length>1"
        />
      </li>
      <li class="item flexbox border_none">
        <span>是否自取</span>
        <div style="padding-left:5px;">
          <van-switch v-model="PsType" />
        </div>
      </li>
    </ul>
    <div class="menu">
      <h1>货品列表</h1>
      <ul>
        <li class="flexbox" style="padding-bottom:10px;">
          <span>商品名称</span>
          <span style="text-align:center;">数量</span>
          <span>单价</span>
        </li>
        <li v-for="(item,index) in cart" :key="index" class="flexbox">
          <span>{{item.GName}}</span>
          <span style="text-align:center;">{{item.Num}}</span>
          <span>¥{{item.SalePrice}}/{{item.CName}}</span>
        </li>
      </ul>
    </div>
    <div class="bottom flexbox">
      <span>
        合计:
        <span>¥{{totalPrice}}</span>
      </span>
      <span class="btn flexbox" @click="ScV7GoodsOrderIng">确认下单</span>
    </div>
    <van-action-sheet
      v-model="sheetShow"
      :actions="actions"
      close-on-click-action
      @select="onSelect"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      cart: [],
      obj: {},
      Remarks: "",
      PsType: false,
      ctype: {},
      sheetShow: false,
      actions: []
    };
  },
  computed: {
    totalPrice() {
      let total = 0;
      this.cart.forEach(food => {
        total += this.util.mul(food.SalePrice, food.Num);
      });
      return total.toFixed(2);
    }
  },
  created() {
    this.cart = JSON.parse(window.sessionStorage.getItem("cart"));
    this.ScV7ShopInfo();
    this.ScV7GetPayType();
  },
  methods: {
    onSelect(item) {
      // 可以通过 close-on-click-action 属性开启自动关闭
      this.sheetShow = false;
      this.ctype = item;
    },
    // 获取供应链开启的支付方式
    ScV7GetPayType() {
      var json = {
        CType: 2
      };
      this.util.sendAjax(this, json, "ScV7GetPayType").then(res => {
        res.Value.forEach(item => {
          item.name = item.Title;
        });
        this.actions = res.Value;
        this.ctype = res.Value[0];
        // 列表   货到付款   在线支付
      });
    },
    ScV7ShopInfo() {
      var json = {};
      this.util.sendAjax(this, json, "ScV7ShopInfo").then(res => {
        this.obj = res.Value;
      });
    },
    ScV7GoodsOrderIng() {
      var json = {
        Address: this.obj.ShopAddress,
        Phone: this.obj.ContactsPhone,
        Remarks: this.Remarks,
        PsType: this.PsType ? 1 : 0,
        Menus: this.cart,
        PayType: this.ctype.Id, // PayType=0 货到付款不用支付 ， PayType = 1 表示微信支付
        Openid: sessionStorage.getItem("id")
      };
      this.util.sendAjax(this, json, "ScV7GoodsOrderIng").then(res => {
        if (res.State === 5) {
          var data = JSON.parse(res.Value);
          if (this.util.isWx()) {
            var jsondata = {
              timeStamp: data.timeStamp,
              nonceStr: data.nonceStr,
              package: data.package,
              signType: data.signType,
              paySign: data.paySign,
              appId: data.appId
            };
            try {
              WeixinJSBridge.invoke("getBrandWCPayRequest", jsondata, val => {
                if (val.err_msg == "get_brand_wcpay_request:ok") {
                  this.jump();
                } // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
              });
            } catch (e) {
              WeixinJSBridge.invoke("getBrandWCPayRequest", jsondata, val => {
                if (val.err_msg == "get_brand_wcpay_request:ok") {
                  this.jump();
                } // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
              });
            }
          }
        } else {
          this.$toast({
            message: res.Msg
          });
          this.jump();
        }
      });
    },
    jump() {
      this.$toast.loading(
        {
        message: "请稍候",
        loadingType: "spinner"
      });
      setTimeout(() => {
        this.$toast.clear();
        sessionStorage.removeItem("cart");
        this.$router.replace("/orderList");
      }, 2500);
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../common/mixin.less";
.van-switch {
  width: 1.5em;
  height: 0.5em;
}
.van-switch__node {
  width: 0.5em;
  height: 0.5em;
}
.van-switch--on {
  background-color: blue;
}
.box {
  .list {
    padding: 0 15px;
    background: #fff;
    border-bottom: 3px solid #f6f6f6;
    .item {
      position: relative;
      width: 100%;
      border-bottom: 1px solid rgba(7, 17, 27, 0.1);
      padding: 10px 0;
      font-size: 14px;
      span {
        width: 100px;
      }
      input {
        flex: auto;
        padding: 0 5px;
      }
      input[disabled],
      input:disabled {
        background-color: #fff;
        color: #333;
      }
      .right_img {
        position: absolute;
        right: 0px;
      }
    }
    .border_none {
      border: none;
    }
  }
  .menu {
    padding: 20px 15px 45px;
    h1 {
      font-size: 14px;
      color: #6185f9;
    }
    ul {
      margin-top: 20px;
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
  .bottom {
    position: fixed;
    z-index: 100;
    bottom: 0;
    width: 100%;
    left: 0;
    background: #fff;
    border-top: 1px solid rgba(7, 17, 27, 0.1);
    span {
      font-size: 14px;
      flex: auto;
      text-align: center;
      span {
        color: #6185f9;
      }
    }
    .btn {
      background: #6185f9;
      color: #fff;
      height: 45px;
      width: 40px;
      justify-content: center;
    }
  }
}
</style>