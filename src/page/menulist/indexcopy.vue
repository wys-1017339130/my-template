<template>
  <div>
    <div class="search_box flexbox">
      <input type="text" placeholder="请输入货品名称" />
    </div>
    <div class="goods">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li
            v-for="(item,index) in goods"
            class="menu-item"
            :key="index"
            :class="{'current': currentIndex === index}"
            @click="selectMenu(index)"
          >
            <div class="text border-1px">
              {{item.GName}}
              <span class="num" v-show="item.count>0">{{item.count}}</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="foodsWrapper">
        <ul>
          <li v-for="item in goods" :key="item.Id" class="food-list food-list-hook">
            <!-- <h1 class="title">{{item.GName}}</h1> -->
            <ul v-for="food in item.List" :key="food.Id" class="food-item border-1px">
              <!-- <div class="icon" @click="selectFood(food)">
              <img width="57" height="57" :src="food.icon" />
              </div>-->
              <div class="content">
                <h2 class="name">{{food.GName}}</h2>
                <p class="description">{{food.description}}</p>
                <div class="extra">
                  <span class="count">规格:{{food.CName}}</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.SalePrice}}</span>
                </div>
                <div class="cart-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </div>
            </ul>
          </li>
        </ul>
      </div>
      <shopcart
        :select-foods="selectFoods"
        :delivery-price="seller.deliveryPrice"
        :min-price="seller.minPrice"
      ></shopcart>
      <!-- <food :food="selectedFood" ref="food"></food> -->
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import shopcart from "../../components/shopcar/index";
import cartcontrol from "../../components/cartcontrol/index.vue";
import { eventBus } from "../../components/event-bus.js";
export default {
  data() {
    return {
      seller: {
        deliveryPrice: 0,
        minPrice: 0
      },
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectFoods: [], //购物车
      selectedFood: {}
    };
  },
  computed: {
    currentIndex() {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i + 1];
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i;
        }
      }
      return 0;
    }
    // selectFoods() {
    // var arr = JSON.parse(window.sessionStorage.getItem("cart")) || [];
    // console.log(arr);
    //  let foods = []; 逻辑有问题
    // if (arr.length > 0) {
    //   console.log(arr);
    //   foods = arr;
    //   arr.forEach(item => {
    //     this.goods.forEach((good, i) => {
    //       if (item.GTypeId === good.Id) {
    //         console.log(item.GTypeId + "----------" + good.Id);
    //         if (!good.count) {
    //           good.count = 0;
    //         }
    //         good.count += item.count;
    //         console.log(item.count);
    //         this.$set(this.goods[i], "count", good.count);
    //       }
    //       if (good.List.length > 0) {
    //         good.List.forEach(childitem => {
    //           if (childitem.Id == item.Id) {
    //             childitem.count = item.count;
    //           }
    //         });
    //       }
    //     });
    //   });
    // } else {
    // this.goods.forEach((good, i) => {
    //   good.List.forEach(food => {
    //     if (food.count) {
    //       foods.push(food);
    //     }
    //   });
    // });
    // arr = foods;
    // }
    // window.sessionStorage.setItem("cart", JSON.stringify(foods));
    // return foods;
    // }
  },
  created() {
    this.ScV7Goods();
    eventBus.$on("addcartData", data => {
      this.goods.forEach((good, i) => {
        if (good.Id === data.GTypeId) {
          if (!good.count) {
            this.$set(this.goods[i], "count", 1);
          } else {
            good.count += 1;
          }
        }
      });
      if (this.selectFoods.length > 0) {
        let a = this.selectFoods.filter(item => {
          return data.Id === item.Id;
        });
        if (a.length === 0) {
          this.selectFoods.push(data);
        } else {
          a.forEach((item, k) => {
            console.log(item.Id + "-----------" + data.Id);
            if (item.Id == data.Id) {
              item.count = data.count;
            }
          });
        }
      } else {
        this.selectFoods.push(data);
      }
      window.sessionStorage.setItem("cart", JSON.stringify(this.selectFoods));
    });

    eventBus.$on("decreaseCart", data => {
      console.log(data);
      let a = this.selectFoods.filter(item => {
        return data.Id === item.Id;
      });
      this.goods.forEach((good, i) => {
        if (good.Id === data.GTypeId) {
          if (data.count) {
            good.count--;
          } else {
            good.count = 0;
          }
          // if (good.List.length > 0) {
          //   good.List.forEach((kid, j) => {
          //     if (kid.Id === data.Id) {
          //       kid.count = data.count;
          //       console.log(kid);
          //     }
          //   });
          // }
        }
      });
       this.selectFoods.forEach((item, i) => {
        if (item.Id === data.Id) {
          item.count--;
          // this.$set(this.selectFoods[i], "count", data.count);
        }
      });
      //  window.sessionStorage.setItem("cart", JSON.stringify(this.selectFoods));
      // this.selectFoods.splice(this.selectFoods.indexOf(data), 1);
    });
  },
  beforeDestroy() {
    eventBus.$off("addcart");
    eventBus.$off("decreaseCart");
  },
  methods: {
    // 菜单列表
    ScV7Goods() {
      var json = {};
      this.util.sendAjax(this, json, "ScV7Goods").then(res => {
        console.log(res);
        this.goods = res.Value;
        var arr = JSON.parse(window.sessionStorage.getItem("cart")) || [];
        if (arr.length > 0) {
          this.selectFoods = arr;
          arr.forEach(item => {
            this.goods.forEach((good, i) => {
              if (item.GTypeId === good.Id) {
                if (!good.count) {
                  good.count = 0;
                }
                good.count += item.count;
                this.$set(this.goods[i], "count", good.count);
              }
              if (good.List.length > 0) {
                good.List.forEach(childitem => {
                  if (childitem.Id === item.Id) {
                    childitem.count = item.count;
                  }
                });
              }
            });
          });
        } else {
        }
        this.$nextTick(() => {
          this._initScroll();
          this._calculateHeight();
        });
      });
    },
      // 定义根据id删除数组的方法
    removeByValue: function(array, val) {
      for (var i = 0; i < array.length; i++) {
        if (array[i].Id == val) {
          array.splice(i, 1);
          break;
        }
      }
    },
    // ---------------------------------
    _initScroll() {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true
      });
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        click: true,
        probeType: 3
      });
      this.foodsScroll.on("scroll", pos => {
        this.scrollY = Math.abs(Math.round(pos.y));
      });
    },
    _calculateHeight() {
      let foodList = this.$refs.foodsWrapper.getElementsByClassName(
        "food-list-hook"
      );
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    selectMenu(index) {
      let foodList = this.$refs.foodsWrapper.getElementsByClassName(
        "food-list-hook"
      );
      let ref = foodList[index];
      this.foodsScroll.scrollToElement(ref, 300);
    },
    selectFood(food) {
      this.selectedFood = food;
      this.$refs.food.show();
    }
  },
  components: {
    shopcart,
    cartcontrol
    // food
  }
};
</script>

<style lang="less" scoped>
@import "../../common/mixin.less";
.search_box {
  width: 100%;
  height: 45px;
  background: #6585fe;
  justify-content: center;
  input {
    width: 90%;
    padding: 5px 10px;
    font-size: 14px;
    border-radius: 15px;
  }
}
.goods {
  position: absolute;
  top: 45px;
  bottom: 46px;
  width: 100%;
  max-width: 540px;
  display: flex;
  overflow: hidden;
  .menu-wrapper {
    flex: 0 0 85px;
    background: #f3f5f7;
    .menu-item {
      width: 100%;
      padding: 10px 0;
      text-align: center;
      .border-1px(rgba(7, 17, 27, 0.1));
      &.current {
        position: relative;
        background: #ccc;
        margin-top: -1px;
        z-index: 100;
      }
      .text {
        font-size: 12px;
        position: relative;
        .num {
          position: absolute;
          top: -10px;
          right: 0;
          width: 24px;
          height: 24px;
          line-height: 24px;
          text-align: center;
          border-radius: 16px;
          font-size: 9px;
          font-weight: 700;
          color: #fff;
          background: #6185f9;
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
        }
      }
    }
  }

  .foods-wrapper {
    flex: 1;
    .title {
      padding-left: 14px;
      border-left: 2px solid #d9dde1;
      font-size: 12px;
      height: 26px;
      line-height: 26px;
      color: rgb(147, 153, 159);
      background-color: #f3f5f7;
    }

    .food-item {
      display: flex;
      padding: 15px;
      // padding-bottom: 18px;
      .border-1px(rgba(7, 17, 27, 0.1));
      &:last-child:after {
        border-top: 0;
      }

      .icon {
        flex: 0 0 57px;
        margin-right: 10px;
      }

      .content {
        flex: 1;

        .name {
          margin: 2px 0 8px 0;
          height: 14px;
          line-height: 14px;
          font-size: 14px;
          color: rgb(7, 17, 27);
        }

        .description,
        .extra {
          font-size: 10px;
          line-height: 10px;
          color: rgb(147, 153, 159);
          margin-bottom: 8px;
        }

        .extra {
          .count {
            margin-right: 12px;
            line-height: 10px;
          }

          .rating {
            line-height: 10px;
          }
        }

        .price {
          .now {
            font-size: 14px;
            color: rgb(240, 20, 20);
            font-weight: 700;
            line-height: 24px;
            margin-right: 8px;
          }

          .old {
            font-size: 10px;
            text-decoration: line-through;
            color: rgb(147, 153, 159);
            font-weight: 700;
            line-height: 24px;
          }
        }

        .cart-wrapper {
          position: absolute;
          right: 0;
          bottom: 12px;
        }
      }
    }
  }
}
</style>