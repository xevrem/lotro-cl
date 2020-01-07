
import {ACTION_TYPES} from 'utils/constants';

const API_GET_REQUEST = 'api/get/REQUEST';
const API_GET_SUCCESS = 'api/get/SUCCESS';
const API_GET_FAILURE = 'api/get/FAILURE';

const API_PUT_REQUEST = 'api/put/REQUEST';
const API_PUT_SUCCESS = 'api/put/SUCCESS';
const API_PUT_FAILURE = 'api/put/FAILURE';



const initial_state = {

};

export default {
  namespaced:true,
  state:{
    ...initial_state
  },
  mutations:{
    [API_GET_REQUEST](state, payload){
      state.params = payload;
    },
    [API_GET_SUCCESS](state, payload){
      state.response = payload;
    },
    [API_GET_FAILURE](state, params, payload){
      console.info('API_GET_FAILURE', state, params, payload);
      state.params = params;
      state.response = payload;
    }
  },
  actions:{
    get({ commit }, params){
      commit(API_GET_REQUEST, params);
      return fetch(params.url, {
        method: 'GET',
        ...params.options
      }).then(response => {
        return response.json();
      }).then(json => {
        commit(API_GET_SUCCESS, json);
        return json;
      }).catch(error=> {
        commit(API_GET_FAILURE, params, error.toString());
      });
    },
  },
  // getters:{

  // }
};
