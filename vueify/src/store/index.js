import Vue from 'vue';
import Vuex from 'vuex';

import api from './api';
import deeds from './deeds';
import characters from './characters';
import utils from './utils';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules:{
    api: api,
    deeds: deeds,
    characters: characters,
    utils: utils
  }
});

export default store;
