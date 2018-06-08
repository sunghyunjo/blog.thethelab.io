/* eslint-disable import/prefer-default-export */
import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    user: {},
    githubUser: {},
  },
  /** 반드시 동기여야 한다.
   * method 이름이 문자열 이므로 상수로 빼둘 필요가 있다.
   * call by : store.commit('method', arg)
   */
  mutations: {
    setUser(state, data) {
      state.user = data;
    },
    setGithubUser(state, data) {
      state.githubUser = data;
    },
  },
  /** 비동기가 포함 될 수 있다
   * method 이름이 문자열 이므로 상수로 빼둘 필요가 있다.
   * call by : sotre.dispatch('method', arg)
   */
  actions: {},
  getters: {
    getCount: state => state.count,
    getUser(state) {
      console.log('getUser:', state.user);
      return state.user;
    },
    getGithubUser(state) {
      return state.githubUser;
    },
  },
});

export { store };
