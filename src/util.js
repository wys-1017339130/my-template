/* eslint-disable */
import Vue from 'vue';
import axios from 'axios';
import Qs from 'qs';
import {
  Toast
} from 'vant';
Vue.use(Toast);
var CryptoJS = require('crypto-js')

Vue.prototype.$http = axios;
const params = {
  // http://192.168.100.250/User.ashx
  baseUrl: process.env.NODE_ENV === 'development' ? 'https://d.zsfcy.cn/User.ashx' : 'https://d.zsfcy.cn/User.ashx'
}
const downAppurl = "https://bds.zsfcy.cn/#/download"
// 分享
const initShare = (_this) => {
  let json = {
    Url: window.location.href
  };
  let p = new Promise((resolve, reject) => {
    sendAjax(_this, json, "FmV5H5ShareConfig")
      .then(res => {
        resolve(res)
        _this.$nextTick(() => {
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.Value.appid, // 必填，公众号的唯一标识
            timestamp: res.Value.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.Value.noncestr, // 必填，生成签名的随机串
            signature: res.Value.signature, // 必填，签名
            jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage"] // 必填，需要使用的JS接口列表
          });
        });
      });
  })
  return p;
}
const shareInfo = (obj) => {
  wx.ready(function () {
    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
    wx.onMenuShareTimeline({
      title: obj.ShopName || "", // 分享标题
      desc: obj.desc, // 分享描述
      link: obj.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: obj.imgUrl, // 分享图标
      success: function () {
        // 用户确认分享后执行的回调函数
        Toast({
          duration: 1000,
          message: "分享成功"
        });
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
      }
    });
    wx.onMenuShareAppMessage({
      title: obj.ShopName || "", // 分享标题
      desc: obj.desc, // 分享描述
      link: obj.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: obj.imgUrl, // 分享图标
      type: "link", // 分享类型,music、video或link，不填默认为link
      success: function () {
        // 用户确认分享后执行的回调函数
        Toast({
          duration: 1000,
          message: "分享成功"
        });
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
      }
    });
  });
}
// 客户端是否微信或支付宝
const isWx = () => {
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
    return true
  } else if (ua.match(/Alipay/i) == "alipay") {
    return false
  } else {
    return Toast.loading({
      message: "请在微信浏览器内打开",
      duration: 0,
      mask: true
    });
  }
}
// 登录
const initLogin = (_this, cmd, code) => {
  let p = new Promise((resolve, reject) => {
    if (code != null && code != "" && code != undefined) {
      var json = {
        Code: code,
        yqm: ''
      };
      sendAjax(_this, json, isWx() ? cmd : cmd)
        .then(res => {
          resolve(res)
        });
    } else {
      let href = window.location.href.indexOf('?') == -1 ? window.location.href + '?type=1' : window.location.href
      if (isWx()) {
        window.location.href =
          "https://d.zsfcy.cn/HnWxAuth.html?backUrl=" +
          encodeURIComponent(href);
      } else {
        window.location.href =
          'https://d.zsfcy.cn/alauth.html?backUrl=' + encodeURIComponent(href);
      }
    }
  })
  return p;
}
// aes加密 
const encrypt = (word) => {
  var key = CryptoJS.enc.Utf8.parse('MpYJGJSvW7SCF2RA'); //  16位   10010
  var iv = CryptoJS.enc.Utf8.parse('2259007006614070')
  var encrypted = ''
  var srcs;
  if (typeof (word) === 'string') {
    srcs = CryptoJS.enc.Utf8.parse(word)
    encrypted = CryptoJS.AES.encrypt(srcs, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })
  } else if (typeof (word) === 'object') { //  对象格式的转成json字符串
    var data = JSON.stringify(word)
    srcs = CryptoJS.enc.Utf8.parse(data)
    encrypted = CryptoJS.AES.encrypt(srcs, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })
  }
  // decrypt(encrypted.toString());
  return encrypted.toString()
}

function time_range(beginTime, endTime) {
  var strb = beginTime.split(":");
  if (strb.length != 2) {
    return false;

  }

  var stre = endTime.split(":");
  if (stre.length != 2) {
    return false;

  }

  var b = new Date();
  var e = new Date();
  var n = new Date();

  b.setHours(strb[0]);
  b.setMinutes(strb[1]);
  e.setHours(stre[0]);
  e.setMinutes(stre[1]);

  if (n.getTime() - b.getTime() > 0 && n.getTime() - e.getTime() < 0) {
    return true;
  } else {
    console.log("当前时间是：" + n.getHours() + ":" + n.getMinutes() + "，不在该时间范围内！");
    return false;
  }
}
const QbUserShopsList = (_this) => {
  let p = new Promise((resolve, reject) => {
    let json = {};
    sendAjax(_this, json, "QbUserShopsList").then(res => {
      resolve(res)
    });
  })
  return p;
}
const sendAjax = (_this, post, i) => {
  let toast = null;
  if (!post.noload) {
    toast = Toast.loading({
      mask: true,
      duration: 3000,
      message: '加载中...'
    });
  }
  var json = {
    p: post,
    cmd: i,
    unix: Math.round(new Date().getTime() / 1000)
  }
  console.log(json)
  var keyvalue = encrypt(JSON.stringify(json))
  var data = {
    key: keyvalue,
    tag: 10010,
    guid: window.localStorage.getItem('Guid'),
    version: 153
  }
  const p = new Promise((resolve, reject) => {
    _this.$http.post(params.baseUrl, Qs.stringify(data), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(res => {
        if (!post.noload) {
          toast.clear();
        }
        var arr = ['ScV7GetUserOpenId'];
        console.log(res.data)
        switch (res.data.State) {
          case 0:
            resolve(res.data)
            break;
          case 3:
            Toast({
              message: res.data.Msg
            })
            window.localStorage.removeItem('Guid');
            _this.$router.push("/login");
            break
          case 5:
            resolve(res.data)
            break;
          case 1:
            if (arr.indexOf(i) > -1) {
              resolve(res.data);
            } else {
              Toast({
                message: res.data.Msg
              })
            }
            break;
          default:
            Toast({
              message: 'State:' + res.data.State + '---------' + res.data.Msg
            })
            break
        }
      },
      err => {
        alert(err)
        reject(err)
      }
    )
  })
  return p
}

const imgUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAYAAAA9zQYyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTM1QkNENTRCQUYyMTFFOEJGMDNEMjhENjBCREUwMTkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NTM1QkNENTVCQUYyMTFFOEJGMDNEMjhENjBCREUwMTkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1MzVCQ0Q1MkJBRjIxMUU4QkYwM0QyOEQ2MEJERTAxOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1MzVCQ0Q1M0JBRjIxMUU4QkYwM0QyOEQ2MEJERTAxOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhVrEzEAAAd2SURBVHja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'
const formatImg = (imgpath) => {
  if (imgpath) {
    return imgpath;
  } else {
    return imgUrl
  }
}
// 加法
function add(a, b) {
  var c, d, e;
  try {
    c = a.toString().split(".")[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split(".")[1].length;
  } catch (f) {
    d = 0;
  }
  return e = Math.pow(10, Math.max(c, d)), (mul(a, e) + mul(b, e)) / e;
}
// 减
function sub(a, b) {
  var c, d, e;
  try {
    c = a.toString().split(".")[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split(".")[1].length;
  } catch (f) {
    d = 0;
  }
  return e = Math.pow(10, Math.max(c, d)), (mul(a, e) - mul(b, e)) / e;
}
// 乘
function mul(a, b) {
  if (!a) {
    a = 0;
  }
  var c = 0,
    d = a.toString(),
    e = b.toString();
  try {
    c += d.split(".")[1].length;
  } catch (f) {}
  try {
    c += e.split(".")[1].length;
  } catch (f) {}
  return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}
// 除法
function div(a, b) {
  var c, d, e = 0,
    f = 0;
  try {
    e = a.toString().split(".")[1].length;
  } catch (g) {}
  try {
    f = b.toString().split(".")[1].length;
  } catch (g) {}
  return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), mul(c / d, Math.pow(10, f - e));
}
let timeout = null;

function debounce(fn, wait) {
  if (timeout !== null) clearTimeout(timeout)
  timeout = setTimeout(fn, wait)
}

function setCookie(key, value) {
  window.sessionStorage.setItem(key, JSON.stringify(value));
}

function getCookie(key) {
  var value = window.sessionStorage.getItem(key);
  if (value) {
    return JSON.parse(value);
  } else {
    return null
  }

}
/**
 * 时间格式方法
 * 
 * @param {any} timeStamp  时间戳，秒级/毫秒级
 * @param {any} type 格式化时间类型，默认  Y-M-D H:I:S
 * @returns {string} formatTime 格式化后的时间 例如： 2017-05-05 12:09:22
 */
function getLocalTime(timeStamp, type = 'Y-M-D H:I:S', auto = false) {
  let time = (timeStamp + '').length === 10 ? new Date(parseInt(timeStamp) * 1000) : new Date(parseInt(timeStamp));
  let _year = time.getFullYear();
  let _month = (time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : (time.getMonth() + 1);
  let _date = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
  let _hours = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
  let _minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
  let _secconds = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
  let formatTime = '';
  let distinctTime = new Date().getTime() - time.getTime();

  if (auto) {
    if (distinctTime <= (1 * 60 * 1000)) {
      // console.log('一分钟以内，以秒数计算');
      let _s = Math.floor((distinctTime / 1000) % 60);
      formatTime = _s + '秒前';
    } else if (distinctTime <= (1 * 3600 * 1000)) {
      // console.log('一小时以内,以分钟计算');
      let _m = Math.floor((distinctTime / (60 * 1000)) % 60);
      formatTime = _m + '分钟前';
    } else if (distinctTime <= (24 * 3600 * 1000)) {
      // console.log('一天以内，以小时计算');
      let _h = Math.floor((distinctTime / (60 * 60 * 1000)) % 24);
      formatTime = _h + '小时前';
    } else if (distinctTime <= (30 * 24 * 3600 * 1000)) {
      let _d = Math.floor((distinctTime / (24 * 60 * 60 * 1000)) % 30);
      formatTime = _d + '天前';
      // console.log('30天以内,以天数计算');
    } else {
      // 30天以外只显示年月日
      formatTime = _year + '-' + _month + '-' + _date;
    }
  } else {

    switch (type) {
      case 'Y-M-D H:I:S':
        formatTime = _year + '-' + _month + '-' + _date + ' ' + _hours + ':' + _minutes + ':' + _secconds;
        break;
      case 'Y-M-D H:I:S zh':
        formatTime = _year + '年' + _month + '月' + _date + '日  ' + _hours + ':' + _minutes + ':' + _secconds;
        break;
      case 'Y-M-D H:I':
        formatTime = _year + '-' + _month + '-' + _date + ' ' + _hours + ':' + _minutes;
        break;
      case 'Y-M-D H':
        formatTime = _year + '-' + _month + '-' + _date + ' ' + _hours;
        break;
      case 'Y-M-D':
        formatTime = _year + '-' + _month + '-' + _date;
        break;
      case 'Y-M-D zh':
        formatTime = _year + '年' + _month + '月' + _date + '日';
        break;
      case 'Y-M':
        formatTime = _year + '-' + _month;
        break;
      case 'Y':
        formatTime = _year;
        break;
      case 'M':
        formatTime = _month;
        break;
      case 'D':
        formatTime = _date;
        break;
      case 'H':
        formatTime = _hours;
        break;
      case 'I':
        formatTime = _minutes;
        break;
      case 'S':
        formatTime = _secconds;
        break;
      default:
        formatTime = _year + '-' + _month + '-' + _date + ' ' + _hours + ':' + _minutes + ':' + _secconds;
        break;
    }
  }
  // 返回格式化的日期字符串
  return formatTime.split(' ')[0];
}
const charToHtml = (str) => {
  if (str) {
    str = str.replace(/&amp;/g, '&');
    str = str.replace(/&lt;/g, '<');
    str = str.replace(/&gt;/g, '>');
    str = str.replace(/&quot;/g, '"');
    str = str.replace(/&#039;/g, ' ');
  }
  return str;
}
export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }

  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes()
  }

  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}

function thousands(num) {
  if (num) {
    var str = num.toString();
    var reg = str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
    return str.replace(reg, "$1,");
  }
}
export default {
  sendAjax: sendAjax,
  QbUserShopsList: QbUserShopsList,
  initLogin: initLogin,
  initShare: initShare,
  shareInfo: shareInfo,
  formatImg: formatImg,
  charToHtml: charToHtml,
  add: add,
  sub: sub,
  mul: mul,
  div: div,
  time_range: time_range,
  debounce: debounce,
  setCookie: setCookie,
  getCookie: getCookie,
  getLocalTime: getLocalTime,
  imgUrl: imgUrl,
  isWx: isWx,
  downAppurl: downAppurl,
  thousands: thousands
}
