import Vue from 'vue'
import moment from "moment";
Vue.prototype.$moment = moment;
Vue.prototype.$changenum=function(num){
  if(num==''||num==undefined){
    num=0
  }
  if(num < 1000) {
    return num;
  } else if(num < 10000){
    return (num/1000).toFixed(1)+'k';
  } else if (num >= 10000) {
    return (num/10000).toFixed(1)+'w';
  }
}

