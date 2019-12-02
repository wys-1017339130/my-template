<template>
  <div class="cartcontroll flexbox">
    <transition name="slide-fade">
      <div class="decrease flexbox" v-show="food.count" @click="decreaseCart">
        <img src="../../assets/jianshao.png" alt />
      </div>
    </transition>
    <div class="count" v-show="food.count">{{food.count}}</div>
    <div class="add flexbox" @click="addCart">
      <img src="../../assets/zengjia.png" alt />
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { eventBus } from "../event-bus";
export default {
  props: {
    food: {
      type: Object
    }
  },
  methods: {
    // 能否下单
    ScV7ShopsBindGys() {
      var json = {};
      this.util.sendAjax(this, json, "ScV7ShopsBindGys").then(res => {
        console.log(res);
      });
    },
    addCart(e) {
      if (!this.food.count) {
        Vue.set(this.food, "count", 1);
      } else {
        this.food.count += 1;
      }
      // 优化体验，异步传递当前点击文档节点
      this.$nextTick(() => {
        eventBus.$emit("addcart", e.target);
        eventBus.$emit("addcartData", this.food);
      });
    },
    decreaseCart() {
      if (this.food.count) {
        this.food.count--;
        eventBus.$emit("decreaseCart", this.food);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.cartcontroll {
  font-size: 0;
  justify-content: center;
  .decrease,
  .add {
    padding: 0 10px;
    color: #6185f9;
    img {
      width: 20px;
      height: 20px;
    }
  }
  .count {
    font-size: 12px;
    color: #333;
  }
}
.cartcontroll &.slide-fade-enter-active {
  transition: all 0.3s ease;
}

&.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

&.slide-fade-enter,
&.slide-fade-leave-to {
  /* .slide-fade-leave-active for below version 2.1.8 */
  transform: translateX(24px) rotate(360deg);
  opacity: 0;
}
</style>