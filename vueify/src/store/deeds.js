import {
  DEED_CATEGORIES
} from 'utils/constants';

import {get_url} from 'utils/urls';

export const DEEDS_LOADED = 'deeds/LOADED';
export const DEED_UPDATED = 'deed/UPDATED';
export const DEED_SELECTED = 'deed/SELECTED';
export const DEED_COMPLETED = 'deed/COMPLETED';
export const DEED_CATEGORY_SELECTED = 'deed/category/SELECTED';
export const DEED_SUBCATEGORY_SELECTED = 'deed/subcategory/SELECTED';

export const initial_state = {
  deed_selected:-1,
  category_selected: '',
  subcategory_selected: '',
  deeds: [],
  categories: Object.keys(DEED_CATEGORIES),
  subcategories: []
};

export default {
  namespaced:true,
  state:{
    ...initial_state
  },
  mutations:{
    [DEEDS_LOADED](state, deeds){
      state.deeds = deeds;
    },
    [DEED_UPDATED](state, payload){},
    [DEED_SELECTED](state, deed){
      state.deed_selected = deed;
    },
    [DEED_COMPLETED](state, payload){},
    [DEED_CATEGORY_SELECTED](state, category){
      state.category_selected = category;
      //determine all the subcategories and update their list
      let subcategories = new Set();
      state.deeds[category].forEach(deed => {
        subcategories.add(deed.Subcategory);
      });
      state.subcategories = [...subcategories];
    },
    [DEED_SUBCATEGORY_SELECTED](state, subcategory){
      state.subcategory_selected = subcategory;
    },
  },
  actions:{
    async fetch_deeds({dispatch, commit}){
      return await dispatch('api/get', {
        url: get_url('deeds'),
        options: {
          mode:'cors',
          credentials:'include',
        }
      },{root:true}).then(deeds => {
        commit(DEEDS_LOADED, deeds);
      });
    },
    select_category({commit}, category){
      commit(DEED_CATEGORY_SELECTED, category);
    },
    select_subcategory({commit}, subcategory){
      commit(DEED_SUBCATEGORY_SELECTED, subcategory);
    },
    select_deed({commit}, deed){
      commit(DEED_SELECTED, deed.Deed);
    }
  },
  getters:{
    deed_list: state => {
      if(!state.deeds[state.category_selected]) return [];
      return state.deeds[state.category_selected].filter(deed => {
        return state.subcategory_selected === deed.Subcategory;
      });
    }
  }
};
