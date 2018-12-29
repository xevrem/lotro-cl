import {ACTION_TYPES} from 'utils/constants';

const initial_state = {
  initialized: false,
  show_menu_modal: false,
  width: window.innerWidth,
  height: window.innerHeight,
};

export default {
  namespaced:true,
  state:{
    ...initial_state
  },
  mutations:{
    [ACTION_TYPES.INITIALIZATION](state, payload){},
    [ACTION_TYPES.INITIALIZATION_DONE](state, payload){},
    [ACTION_TYPES.WINDOW_RESIZE](state, payload){
      state.height = payload.height;
      state.width = payload.width;
    },
    [ACTION_TYPES.MENU_UPDATE](state, payload){
      console.log(payload);
      state.show_menu_modal = payload;
    }
  },
  actions:{
    toggle_menu({commit, state}){
      commit(ACTION_TYPES.MENU_UPDATE, !state.show_menu_modal);
    }
  },
  getters:{

  }
};
