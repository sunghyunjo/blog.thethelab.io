/* eslint-disable import/prefer-default-export */
import Vuex from 'vuex';
import Vue from 'vue';
import _ from 'lodash';

Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    user: {},
    md: '',
    title: '',
    tags: [],
    bgColor: '#a8a8a8',
    txtColor: '#ffffff',
  },
  /** 반드시 동기여야 한다.
   * method 이름이 문자열 이므로 상수로 빼둘 필요가 있다.
   * call by : store.commit('method', arg)
   */
  mutations: {
    setMdData(state, data) {
      state.md = data;
    },
    setTitle(state, data) {
      state.title = data;
    },
    setUser(state, data) {
      state.user = data;
    },
    setTag(state, data) {
      _.forEach(data, (d) => {
        if (d.selected) {
          state.tags.push(d.name);
        }
      });
    },
    setColor(state, data) {
      state.bgColor = data[0];
      state.txtColor = data[1];
    },
    upload(state) {
      console.log(state);
    },
  },

  /** 비동기가 포함 될 수 있다
   * method 이름이 문자열 이므로 상수로 빼둘 필요가 있다.
   * call by : sotre.dispatch('method', arg)
   */
  actions: {
  },
  getters: {
    getCount: state => state.count,
    getUser: state => state.user,
  },
});

export { store };
