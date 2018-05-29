<template lang="pug">
  #app
    gnb
    router-view
</template>

<script>

import { store } from './vuex/store';
import gnb from './components/gnb';

export default {
  name: 'App',
  store,
  methods: {},
  components: {
    gnb,
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
