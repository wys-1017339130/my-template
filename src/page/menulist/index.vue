<template>
  <div>
    <!-- 信息 -->
    <div class="search_box flexbox">
      <input type="text" placeholder="请输入货品名称" v-model="filterword" />
      <span @click="cancelSearch">取消</span>
    </div>
    <div class="goods" v-bind:style="{ height: computedContentHeight + 'px' }">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li
            v-for="(item,index) in goods"
            class="menu-item"
            @click="leftControlRightScroll(index,item)"
            :key="index"
          >
            <div class="menu-item-name">
              {{item.GName}}
              <span class="tip_box" v-if="item.Num>0">{{item.Num}}</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="foodsWrapper">
        <ul v-for="(child,index) in goods" :key="index">
          <li class="food-list food-list-hook">
            <h1 class="type_title"></h1>
            <ul>
              <li
                v-for="(food) in child.List"
                :key="food.Id"
                class="food-item border-bottom-1px"
                v-show="food.ValuationMethod !==1"
              >
                <!-- <div class="icon">
                  <img :src="util.formatImg(food.ImgUrl)" alt class="img" />
                  <div class="cover_shouqin_box" v-if="food.IsUp==1">
                    <img src="../../assets/yishouqing.png" width="55" height="50" />
                  </div>
                </div>-->
                <div class="content">
                  <div class="name my_text_2">{{food.GName}}</div>
                  <div class="price_box">{{food.SalePrice||0}}元/{{food.CName}}</div>
                  <!-- 控制器 -->
                  <div class="cartControl-wrapper_position">
                    <div class="cartcontrol flexbox">
                      <transition name="move">
                        <div
                          class="cart-decrease"
                          v-show="food.Num>0"
                          @click="minusCount(food,index)"
                        >
                          <img src="../../assets/jianshao.png" alt width="25" height="25" />
                        </div>
                      </transition>
                      <div class="cart-count" v-show="food.Num>0">{{food.Num}}</div>
                      <div class="cart-add" @click="addCountBefore(food,index,$event)">
                        <img src="../../assets/zengjia.png" alt width="25" height="25" />
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <!-- 底部状态栏 -->
    <div class="shopcart">
      <div class="content_car" @click="toggleList">
        <div class="content-left flexbox">
          <div class="logo-wrapper">
            <img src="../../assets/car.png" alt class="logo_box" width="30" />
            <div class="num" v-show="totalCount>0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice.toFixed(2)}}</div>
        </div>
        <!--支付按钮-->
        <div class="content-right" @click.stop.prevent="pay">
          <div class="pay" :class="payClass">{{payDesc}}</div>
        </div>
      </div>
      <div class="ball-container">
        <div v-for="(ball,num) in balls" :key="num">
          <transition
            name="drop"
            @before-enter="beforeDrop"
            @enter="dropping"
            @after-enter="afterDrop"
          >
            <div class="ball" v-show="ball.show">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
    </div>
    <!-- 购物车 -->
    <van-popup v-model="popupshow" position="bottom">
      <div class="shopcart-list">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li v-for="food in gouwuche" :key="food.Id" class="food border-1px">
              <span class="name">{{food.GName}}</span>
              <div class="price">
                <span>￥{{food.SalePrice*food.Num}}</span>
              </div>
              <!-- <div class="cartcontrol-wrapper">
                <cartcontrol :food="food"></cartcontrol>
              </div>-->
            </li>
          </ul>
        </div>
      </div>
    </van-popup>
    <!-- 搜索布局 -->
    <ul
      v-show="filterword.length>0"
      class="search_List_box"
      v-bind:style="{ height: computedContentHeight + 'px' }"
    >
      <li v-for="(item,index) in searchArr" :key="index">
        <div class="name my_text_2">{{item.GName}}</div>
        <div class="price_box">{{item.SalePrice}}元/{{item.CName}}</div>
        <div class="cartControl-wrapper_position">
          <div class="cartcontrol flexbox">
            <transition name="move">
              <div class="cart-decrease" v-show="item.Num>0" @click="minusCount(item,item.index)">
                <img src="../../assets/jianshao.png" alt width="25" height="25" />
              </div>
            </transition>
            <div class="cart-count" v-show="item.Num>0">{{item.Num}}</div>
            <div class="cart-add" @click="addCountBefore(item,item.index,$event)">
              <img src="../../assets/zengjia.png" alt width="25" height="25" />
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "menulist",
  data() {
    return {
      caiList: [],
      goods: [],
      singleShop: {
        name: "",
        price: ""
      },
      listHeight: [],
      scrollY: 0,
      goodIndex: 0, // 获取类型,名字
      value: "", // 特殊要求
      foodCount: 0,
      ShopId: "",
      TableId: "",
      //        购物车
      gouwuche: [],
      balls: [
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        }
      ],
      dropBalls: [],
      totalPrice: 0, // 购物车总价
      shopInfo: {},
      component: "", // 控制弹窗
      popupshow: false,
      code: null,
      searchArr: [],
      filterword: ""
    };
  },
  computed: {
    // 计算商品区域高度
    computedContentHeight() {
      return window.innerHeight - 46 - 45;
      //头部+底部距离
    },
    currentIndex() {
      for (let i = 0, l = this.listHeight.length; i < l; i++) {
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i + 1];
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i;
        }
      }
      return 0;
    },
    totalCount() {
      let countNum = 0;
      this.gouwuche.forEach(item => {
        countNum += Number(item.Num);
      });
      return countNum;
    },
    payDesc() {
      if (this.totalCount < 1) {
        return "还没有选择菜品";
      } else {
        return "去结算";
      }
    },
    payClass() {
      if (this.totalCount < 1) {
        return "not-enough";
      } else {
        return "enough";
      }
    }
  },
  watch: {
    filterword: function(word) {
      if (word) {
        this.goods.forEach((item, i) => {
          if (item.List) {
            item.List.filter(k => {
              if (k.GName.indexOf(word) > -1) {
                k.index = i;
                this.searchArr.push(k);
              }
            });
          }
        });
      } else {
        this.searchArr = [];
      }
    }
  },
  created() {
    this.code = this.$route.query.code;
    let typeState = this.$route.query.typeState;
    if (!typeState) {
      this.util.QbUserShopsList(this).then(data => {
        if (data.Value && data.Value.length > 1) {
          return this.$router.push({
            path: "/userShoplist",
            query: { name: "menulist" }
          });
        } else {
          this.initPage();
        }
      });
    } else {
      this.initPage();
    }
  },
  mounted() {
    // 窗口大小改变，改变商品列高度
    window.addEventListener("resize", this.watchHei, false);
  },
  methods: {
    initPage() {
      this.ScV7GetUserOpenId();
      this.ScV7Goods();
    },
    cancelSearch() {
      this.filterword = "";
      this.searchArr = [];
    },
    // 获取openid
    ScV7GetUserOpenId() {
      this.util.initLogin(this, "ScV7GetUserOpenId", this.code).then(res => {
        if (res.State == 0) {
          sessionStorage.setItem("id", res.Value);
        }
      });
    },
    toggleList() {
      if (!this.totalCount) {
        return;
      }
      // this.popupshow = !this.popupshow;
    },
    hideList() {
      this.popupshow = true;
    },
    empty() {
      this.gouwuche.forEach(food => {
        food.Num = 0;
      });
    },
    ScV7Goods() {
      var json = {};
      this.util.sendAjax(this, json, "ScV7Goods").then(res => {
        this.goods = res.Value;
        this.caiList = res.Value[0].List;
        // 获取购物车缓存数据
        var arr = JSON.parse(window.sessionStorage.getItem("cart")) || [];
        var goods = this.goods;
        if (arr.length > 0) {
          this.gouwuche = arr;
          arr.forEach(item => {
            goods.forEach(child => {
              if (item.TypeId == child.Id) {
                child.Num += item.Num * 1;
              }
              if (child.List.length > 0) {
                child.List.forEach(childitem => {
                  if (childitem.Id == item.Id) {
                    childitem.Num = item.Num;
                  }
                });
              }
            });
          });
          this.getTotalPrice();
          this.getBigclass();
        } else {
          this.totalPrice = 0;
        }
        this.$nextTick(() => {
          this.rightControlLeftClass();
        });
      });
    },
    // 减少
    minusCount: function(food, index) {
      var that = this;
      var id = food.Id;
      var parentIndex = index; //父级index
      var arr = JSON.parse(window.sessionStorage.getItem("cart")) || [];
      var foodList = that.goods[parentIndex].List;
      for (var i in foodList) {
        if (foodList[i].Id == id) {
          foodList[i].Num -= 1;
          if (foodList[i].Num <= 0) {
            foodList[i].Num = 0;
          }
          if (arr.length > 0) {
            for (var j in arr) {
              if (arr[j].Id == id) {
                arr[j].Num -= 1;
                if (arr[j].Num <= 0) {
                  that.removeByValue(arr, id);
                }
                if (arr.length <= 0) {
                  this.foodList = foodList;
                  this.gouwuche = [];
                }
                window.sessionStorage.setItem("cart", JSON.stringify(arr));
              }
            }
          }
        }
      }
      that.goods[parentIndex].List = foodList;
      this.gouwuche = arr;
      this.getTotalPrice();
      this.getBigclass();
    },
    // 增加
    addCountBefore(food, pindex, event) {
      this.addCount(food.Id, pindex, 0);
      this.dropball(event.target);
    },
    addCount: function(id, parentIndex, num) {
      console.log(id, "父级index---------" + parentIndex, num);
      var that = this;
      var arr = JSON.parse(window.sessionStorage.getItem("cart")) || [];
      var foodList = that.goods[parentIndex].List;
      var f = false;
      for (var i in foodList) {
        // 遍历菜单找到被点击的菜品，数量加1
        if (foodList[i].Id == id) {
          if (!foodList[i].Num) {
            foodList[i].Num = 1;
          } else if (num == 0) {
            foodList[i].Num += 1;
          } else {
            foodList[i].Num = num;
          }
          var menu = foodList[i];
          if (arr.length > 0) {
            for (var j in arr) {
              // 遍历购物车找到被点击的菜品，数量加1
              if (arr[j].Id == id) {
                if (num == 1) {
                  arr[j].Num = 1;
                } else if (num == 0) {
                  arr[j].Num += 1;
                } else {
                  arr[j].Num = num;
                }
                f = true;
                window.sessionStorage.setItem("cart", JSON.stringify(arr));
                break;
              }
            }
            if (!f) {
              arr.push(menu);
            }
          } else {
            arr.push(menu);
          }
          window.sessionStorage.setItem("cart", JSON.stringify(arr));
        }
      }
      that.goods[parentIndex].List = foodList;
      that.gouwuche = arr;
      this.getTotalPrice();
      this.getBigclass();
    },
    // 计算大类添加数量
    getBigclass() {
      var goods = this.goods;
      var cartList = this.gouwuche;
      if (cartList.length > 0) {
        cartList.forEach((food, index) => {
          goods.forEach(j => {
            if (index == 0) {
              j.Num = 0;
            }
            if (j.List) {
              j.List.forEach(k => {
                if (food.Id == k.Id) {
                  j.Num += food.Num * 1;
                }
              });
            } else {
              j.Num = 0;
            }
          });
        });
      } else {
        goods.forEach(j => {
          j.Num = 0;
        });
      }
    },
    // 获取购物车总价
    getTotalPrice: function() {
      var cartList = this.gouwuche; // 获取购物车列表
      var pricenum = 0;
      cartList.forEach(item => {
        pricenum += item.Num * item.SalePrice;
      });
      this.totalPrice = pricenum;
    },

    dropball(el) {
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i];
        if (!ball.show) {
          ball.show = true;
          ball.el = el;
          this.dropBalls.push(ball);
          return;
        }
      }
    },
    pay() {
      console.log(this.totalCount);
      if (!this.totalCount) {
        return this.$toast({
          duration: 2000,
          message: "您好像还没有点菜"
        });
      } else {
        this.$router.push("orderSure");
      }
    },
    beforeDrop(el) {
      let count = this.balls.length;
      while (count--) {
        let ball = this.balls[count];
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect();
          let x = rect.left - 32;
          let y = -(window.innerHeight - rect.top - 22);
          el.style.display = "";
          el.style.webkitTransform = `translate3d(0,${y}px,0)`;
          el.style.transform = `translate3d(0,${y}px,0)`;
          let inner = el.getElementsByClassName("inner-hook")[0];
          inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
          inner.style.transform = `translate3d(${x}px,0,0)`;
        }
      }
    },
    dropping(el, done) {
      /* eslint-disable no-unused-vars */
      let rf = el.offsetHeight;
      this.$nextTick(() => {
        el.style.webkitTransform = "translate3d(0,0,0)";
        el.style.transform = "translate3d(0,0,0)";
        let inner = el.getElementsByClassName("inner-hook")[0];
        inner.style.webkitTransform = "translate3d(0,0,0)";
        inner.style.transform = "translate3d(0,0,0)";
        el.addEventListener("transitionend", done);
      });
    },
    afterDrop(el) {
      let ball = this.dropBalls.shift();
      if (ball) {
        ball.show = false;
        el.style.display = "none";
      }
    },
    _calculateHeight() {
      let foodList = this.$refs.foodsWrapper.getElementsByClassName(
        "food-list-hook"
      );
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0, l = foodList.length; i < l; i++) {
        let item = foodList[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    drop(target) {
      //  体验优化，异步执行下落动画
      this.$nextTick(() => {
        this.$refs.shopcart.drop(target);
      });
    },
    goTo: function(target) {
      var timer = "";
      var scrollT =
        document.body.scrollTop || document.documentElement.scrollTop;
      if (scrollT > target) {
        timer = setInterval(function() {
          var scrollT =
            document.body.scrollTop || document.documentElement.scrollTop;
          var step = Math.floor(-scrollT / 6);
          document.documentElement.scrollTop = document.body.scrollTop =
            step + scrollT;
          if (scrollT <= target) {
            document.body.scrollTop = document.documentElement.scrollTop = target;
            clearTimeout(timer);
          }
        }, 20);
      } else if (scrollT == 0) {
        timer = setInterval(function() {
          var scrollT =
            document.body.scrollTop || document.documentElement.scrollTop;
          var step = Math.floor((300 / 3) * 0.7);
          document.documentElement.scrollTop = document.body.scrollTop =
            step + scrollT;
          if (scrollT >= target) {
            document.body.scrollTop = document.documentElement.scrollTop = target;
            clearTimeout(timer);
          }
        }, 20);
      } else if (scrollT < target) {
        timer = setInterval(function() {
          var scrollT =
            document.body.scrollTop || document.documentElement.scrollTop;
          var step = Math.floor(scrollT / 6);
          document.documentElement.scrollTop = document.body.scrollTop =
            step + scrollT;
          if (scrollT >= target) {
            document.body.scrollTop = document.documentElement.scrollTop = target;
            clearTimeout(timer);
          }
        }, 20);
      } else if (target == scrollT) {
        return false;
      }
    },
    // 监控网页的resize来改变商品列表的高度
    watchHei() {
      clearTimeout(heightTimer); // 节流
      var heightTimer = setTimeout(() => {
        this.computedContentHeight =
          window.innerHeight - (window.innerWidth / 10) * 4.2;
      }, 100);
    },
    // 右列表控制左列表样式
    rightControlLeftClass() {
      // 左目录列表
      var leftUl = this.$refs.menuWrapper;
      // 左目录的所有li
      var leftLI = leftUl.getElementsByTagName("li");
      // 右商品列表
      var rightUl = this.$refs.foodsWrapper;
      var ti = rightUl.querySelectorAll(".type_title");
      // 定义当前滚动到的index值
      var asIndex = 0;
      // ↓ BUG（魅族自带浏览器 + UC无效果scroll不执行，安卓端chrome火狐正常 IOS 10.2正常)
      // 原因 某些浏览器不支持 forEach (UC,魅族自带,微信等) 改用 for 循环
      rightUl.addEventListener(
        "scroll",
        () => {
          // 当前scrollTop
          var thisST = rightUl.scrollTop;
          // console.log('滚动条上去高度', this.scrollTop)
          // 算每个标题offsetTop来决定当前asIndex
          /* ti.forEach(function (e, i) {
             // console.log(e.offsetTop)
             if (thisST >= e.offsetTop) {
             // console.log(i)
             asIndex = i;
             }
             }); */
          for (var i = 0; i < ti.length; i++) {
            if (thisST >= ti[i].offsetTop) {
              // console.log(i)
              asIndex = i;
            }
          }
          // 给左目录列表所有的li去掉激活样式
          for (var j = 0, x = leftLI.length; j < x; j++) {
            leftLI[j].classList.remove("current");
          }
          // 当前滚动到的li加激活样式
          leftLI[asIndex].classList.add("current");
        },
        false
      );
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
    // 左列表点击控制右列表滚动
    leftControlRightScroll(index) {
      /**
       * [scrollMove 右侧Ul滚动，以当前scrollTop与目标的差值/10为滚动距离，滚动过远的话会有点生硬]
       * @param  {[DOM]} ele    [目标元素ul]
       * @param  {[Number]} target [滚动到的位置]
       * @return {[void]}        [description]
       */
      var scrollMove = (ele, target) => {
        // 根据当前scrollTop与目标点距离算出单次改变量
        var vector = Math.round((target - ele.scrollTop) / 10);
        var scrollTimer = setInterval(() => {
          ele.scrollTop += vector;
          // 超出目标点后 或者 已经滚动到底清空定时器
          // 上滑(scrollTop>=目标点 且 vector为正) 或 下滑(scrollTop <= 目标点 且 vector为负)或 滑到最底
          if (
            (ele.scrollTop >= target && vector > 0) ||
            (ele.scrollTop <= target && vector < 0) ||
            ele.scrollTop + ele.clientHeight + 1 >= ele.scrollHeight
          ) {
            // +1 正确激活当前左栏状态
            ele.scrollTop = target + 1;
            clearInterval(scrollTimer);
          }
        }, 1000 / 100);
      };
      var rightUl_ = this.$refs.foodsWrapper;
      // 右列表应该滚动到的标题的offsetTop
      var rightTo_ = rightUl_.querySelectorAll(".type_title")[index].offsetTop;
      scrollMove(rightUl_, rightTo_);
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../common/mixin.less";
.search_List_box {
  background: #fff;
  position: absolute;
  width: 100%;
  top: 46px;
  left: 0;
  z-index: 10;
  -webkit-overflow-scrolling: touch;
  overflow-y: auto;
  transition: all 0.3s ease;
  li {
    position: relative;
    font-size: 14px;
    padding: 10px;
  }
  .cartControl-wrapper_position {
    bottom: 3px;
  }
}
.border-bottom-1px {
  border-bottom: 0.5px solid #f5f5f5;
}
.search_box {
  width: 100%;
  height: 45px;
  background: #6585fe;
  justify-content: center;
  input {
    width: 85%;
    padding: 5px 10px;
    font-size: 14px;
    border-radius: 15px;
  }
  span {
    font-size: 16px;
    color: #fff;
    padding-left: 5px;
  }
}
.cartcontrol_box {
  justify-content: space-between;
}
.goods {
  display: flex;
  flex-wrap: nowrap;
  position: absolute;
  top: 45px;
  bottom: 81px;
  width: 100%;
}

.menu-wrapper {
  width: 23%;
  -webkit-overflow-scrolling: touch;
  overflow-y: auto;
  background-color: #f7f8f9;

  .menu-item {
    display: table;
    width: 100%;
    box-sizing: border-box;
  }
}

.menu-item-name {
  width: 80%;
  margin: 0 auto;
  padding: 15px 0;
  height: 100%;
  font-size: 14px;
  border-top: 0.5px solid rgba(7, 17, 27, 0.1);
  position: relative;

  .tip_box {
    position: absolute;
    top: 2px;
    right: -5px;
    width: 1rem;
    height: 1rem;
    text-align: center;
    font-size: 0.7rem;
    border-radius: 50%;
    color: white;
    background-color: @bgColor;
  }
}

.memberPrice_box {
  color: @fontColor;
  font-size: 0.8rem;
  width: 100%;
}

.icon {
  flex-shrink: 0;
  width: 4rem;
  height: 4rem;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  position: relative;

  .img {
    width: 100%;
    height: 100%;
  }
}

&.current {
  position: relative;
  z-index: 10;
  margin-top: -1px;
  background: #fff;
  border-left: 3px solid @newColor;

  .text {
    color: #00a0dc;
  }
}

.foods-wrapper {
  -webkit-overflow-scrolling: touch;
  overflow-y: auto;
  width: 77%;
  padding-left: 0.5rem;
  box-sizing: border-box;
  background: #fff;

  .title {
    font-size: 0.8rem;
    padding: 0.5rem 0.3rem 0.5rem;
    color: #333333;
    font-weight: 400;
    font-stretch: normal;
    letter-spacing: 0;
  }

  .food-item {
    display: flex;
    padding: 10px 0;
    position: relative;

    &:last-child {
      border: none;
      margin-bottom: 0;
    }
  }
}

.content {
  flex: auto;
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: flex-start;
  padding: 0 0 5px 0.3rem;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 0rem;
  position: relative;
}

.name {
  width: 70%;
  font-weight: 600;
  word-wrap: break-word;
}

.cartControl-wrapper_position {
  position: absolute;
  right: 0;
  bottom: -1px;
}

.price_box {
  color: #333;
  font-weight: 400;
  letter-spacing: 1px;
}

.cover_shouqin_box {
  display: -moz-box;
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -moz-box-align: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
  -moz-box-pack: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
}

.t_title {
  width: 100%;
  text-align: center;
  font-weight: 700;
  font-size: 18px;
  background: white;
  padding-top: 0.3rem;
}

.tast_box {
  width: 100%;
  padding: 0 0.5rem 1rem;

  li {
    display: flex;
    align-items: center;
    border-bottom: solid 1px #d7d7d7;
    padding: 0.5rem 0;
  }
}

.singleShop_box {
  display: -moz-box;
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -moz-box-align: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
  -moz-box-pack: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: flex-start;
  font-size: 0.8rem;
  .t_price {
    text-align: center;
    color: @newColor;
  }
  span {
    width: 30%;
    word-wrap: break-word;
  }

  span:last-child {
    width: 35%;
    text-align: right;
  }
}

.btn_box_pup {
  width: 100%;
  height: 3rem;
  color: white;
  display: flex;
  align-items: center;

  span {
    line-height: 3rem;
    flex: 1;
    text-align: center;
  }
}

/* 口味 */
.list_box {
  width: 100%;
  font-size: 0.7rem;

  .t_name {
    width: 20%;
  }

  .child_list_box {
    flex: 1;
    display: -moz-box;
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -moz-box-align: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
    -moz-box-pack: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: flex-start;
    justify-content: flex-start;
    flex-wrap: wrap;
    span {
      border: 0.5px solid @newBgcolor;
      border-radius: 1rem;
      margin: 0 0.5rem 0.2rem 0;
      padding: 2px 0.5rem;
      color: @fontColor;
      font-size: 0.7rem;
    }
  }
}

.ask_box {
  width: 70%;
  font-size: 0.7rem;
  margin-left: 10px;
  border-radius: 15px;
  border: 0.5px solid #999999;
  padding: 0.2rem 0.5rem;
}

.t_name {
  color: #333333;
  font-size: 0.8rem;
  font-weight: 400;
}

.chenk_box_f {
}

.cube-checkbox_checked .cube-checkbox-ui i {
  color: @fontColor;
}

.active_index {
  background-color: @bgColor;
  border: none;
  color: white !important;
}

.UserHeader li {
  position: absolute;
  top: 0.3rem;
  right: 0.3rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  overflow: hidden;
  float: right;
  margin-left: 0.4rem;
}

.UserHeader li img {
  width: 100%;
  height: 100%;
}

.kong_box_head {
  height: 2rem;
  width: 2rem;
}

.cartcontrol {
  font-size: 0;

  .cart-decrease {
    display: inline-block;
    padding: 6px;
    transition: all 0.4s linear;

    &.move-enter-active {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }

    .inner {
      display: inline-block;
      line-height: 24px;
      font-size: 24px;
      color: rgb(0, 160, 220);
      transition: all 0.4s linear;
      transform: rotate(0);
    }

    &.move-enter,
    &.move-leave-to {
      opacity: 0;
      transform: translate3d(24px, 0, 0);

      .inner {
        transform: rotate(180deg);
      }
    }
  }

  .cart-count {
    display: inline-block;
    vertical-align: top;
    padding: 4px 5px 0;
    text-align: center;
    font-size: 1rem;
    color: rgb(147, 153, 159);
  }

  .cart-add {
    display: inline-block;
    padding: 6px;
    line-height: 24px;
    font-size: 2rem;
    color: #ff9e2c;
  }
}

.shopcart {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 50;
  width: 100%;
  height: 48px;

  .content_car {
    display: flex;
    height: 100%;
    background: #141d27;
    font-size: 0;
    color: rgba(255, 255, 255, 0.4);

    .content-left {
      flex: 1;
      .logo-wrapper {
        display: inline-block;
        vertical-align: middle;
        position: relative;
        box-sizing: border-box;

        .logo_box {
          margin-left: 20px;
          &.highlight {
            background: rgb(0, 160, 220);
          }
        }
        .num {
          position: absolute;
          top: -10px;
          right: -15px;
          width: 24px;
          height: 20px;
          line-height: 20px;
          text-align: center;
          border-radius: 16px;
          font-size: 9px;
          font-weight: 700;
          color: #fff;
          background: @bgColor;
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
        }
      }

      .price {
        display: inline-block;
        line-height: 24px;
        padding-left: 20px;
        box-sizing: border-box;
        font-size: 16px;
        font-weight: 700;
        &.highlight {
          color: #fff;
        }
      }

      .desc {
        display: inline-block;
        vertical-align: top;
        margin: 12px 0 0 12px;
        line-height: 24px;
        font-size: 10px;
      }
    }

    .content-right {
      flex-shrink: 0;
      width: 50%;

      .pay {
        height: 48px;
        line-height: 48px;
        text-align: center;
        font-size: 0.8rem;
        letter-spacing: 0.5px;
        transition: all 0.5s;

        &.not-enough {
          color: #fff;
          background: #aaa;
        }
        &.enough {
          background-color: @bgColor;
          color: #fff;
        }
      }
    }
  }

  .ball-container {
    .ball {
      position: fixed;
      left: 32px;
      bottom: 22px;
      z-index: 200;
      transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);

      .inner {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #ff9e2c;
        transition: all 0.4s linear;
      }
    }
  }

  .shopcart-list {
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    width: 100%;
    transform: translate3d(0, -100%, 0);

    &.fold-enter-active,
    &.fold-leave-active {
      transition: all 0.5s;
    }

    &.fold-enter,
    &.fold-leave-active {
      transform: translate3d(0, 0, 0);
    }

    .list-header {
      height: 40px;
      line-height: 40px;
      padding: 0 18px;
      background: #f3f5f7;
      border-bottom: 1px solid rgba(7, 17, 27, 0.1);

      .title {
        float: left;
        font-size: 14px;
        color: rgb(7, 17, 27);
      }

      .empty {
        float: right;
        font-size: 12px;
        color: @newColor;
      }
    }

    .list-content {
      padding: 0 18px;
      max-height: 217px;
      overflow: hidden;
      background: #fff;

      .food {
        position: relative;
        padding: 12px 0;
        box-sizing: border-box;
        border-bottom: 1px solid rgba(7, 17, 27, 0.1);

        .name {
          line-height: 24px;
          font-size: 14px;
          color: rgb(7, 17, 27);
        }

        .price {
          position: absolute;
          left: 40%;
          bottom: 12px;
          line-height: 24px;
          font-size: 14px;
          font-weight: 700;
          color: @newColor;
        }

        .cartcontrol-wrapper {
          position: absolute;
          right: 0;
          bottom: 6px;
        }
      }
    }
  }
}

.type_title {
  width: 100%;
}
// 购物车
.shopcart-list {
  width: 100%;
  .list-header {
    height: 40px;
    line-height: 40px;
    padding: 0 18px;
    background: #f3f5f7;
    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
    .title {
      font-size: 14px;
      float: left;
      color: rgb(7, 17, 27);
    }
    .empty {
      float: right;
      font-size: 12px;
      color: rgb(0, 160, 220);
    }
  }
  .list-content {
    padding: 0 18px;
    max-height: 217px;
    background: #fff;
    overflow: hidden;
    .food {
      position: relative;
      padding: 12px 0;
      box-sizing: border-box;
      .border-1px(rgba(7, 17, 27, 0.1));
      &:last-child:after {
        border-top: 0;
      }
      .name {
        font-size: 14px;
        color: rgb(7, 17, 27);
      }
      .price {
        position: absolute;
        right: 90px;
        bottom: 12px;
        font-size: 14px;
        font-weight: 700;
        color: rgb(240, 20, 20);
      }
      .cartcontrol-wrapper {
        position: absolute;
        right: 0;
        bottom: 12px;
      }
    }
  }
}
</style>
