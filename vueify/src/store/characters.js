import {ACTION_TYPES} from 'utils/constants';

const initial_state = {
  characters:[],
  character_selected:-1
};

export default {
  namespaced:true,
  state:{
    ...initial_state
  },
  mutations:{
    [ACTION_TYPES.CHARACTER_ADDED](state, payload){},
    [ACTION_TYPES.CHARACTER_DELETED](state, payload){},
    [ACTION_TYPES.CHARACTER_SELECTED](state, payload){},
    [ACTION_TYPES.CHARACTER_UPDATED](state, payload){}
  },
  actions:{

  },
  getters:{

  }
};
