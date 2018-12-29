import {
  ACTION_TYPES,
  DEED_CATEGORIES
} from 'utils/constants';

const initial_state = {
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
    [ACTION_TYPES.DEED_UPDATED](state, payload){},
    [ACTION_TYPES.DEED_SELECTED](state, payload){},
    [ACTION_TYPES.DEED_COMPLETED](state, payload){},
    [ACTION_TYPES.DEED_CATEGORY_CHANGED](state, payload){},
    [ACTION_TYPES.DEED_SUBCATEGORY_CHANGED](state, payload){},
  },
  actions:{

  },
  getters:{

  }
};
