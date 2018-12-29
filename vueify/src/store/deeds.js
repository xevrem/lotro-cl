import {
  DEED_CATEGORIES
} from 'utils/constants';

import {get_url} from 'utils/urls';

export const DEEDS_LOADED = 'deeds/LOADED';
export const DEED_UPDATED = 'deed/UPDATED';
export const DEED_SELECTED = 'deed/SELECTED';
export const DEED_COMPLETED = 'deed/COMPLETED';
export const DEED_CATEGORY_CHANGED = 'deed/category/CHANGED';
export const DEED_SUBCATEGORY_CHANGED = 'deed/subcategory/CHANGED';

export const initial_state = {
  deed_selected:-1,
  deed_category_selected: 0,
  deed_subcategory_selected: '',
  deed_subcategories: null,
  deeds: [],
  deed_categories: Object.keys(DEED_CATEGORIES),
};

export default {
  namespaced:true,
  state:{
    ...initial_state
  },
  mutations:{
    [DEEDS_LOADED](state, payload){
      state.deeds = payload;
    },
    [DEED_UPDATED](state, payload){},
    [DEED_SELECTED](state, payload){},
    [DEED_COMPLETED](state, payload){},
    [DEED_CATEGORY_CHANGED](state, payload){},
    [DEED_SUBCATEGORY_CHANGED](state, payload){},
  },
  actions:{
    fetch_deeds({dispatch, commit}){
      return dispatch('api/get', {
        url: get_url('deeds'),
        options: {
          mode:'cors',
          credentials:'include',
        }
      },{root:true}).then(data => {
        commit(DEEDS_LOADED, data);
      });
    },
  },
  getters:{

  }
};
