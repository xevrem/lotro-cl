import Vue from 'vue';
import AppView from 'components/app/View.vue';
import store from 'store';

new Vue({
  el:'#root',
  store,
  components:{
    AppView
  },
  render: h => h(AppView)
});
