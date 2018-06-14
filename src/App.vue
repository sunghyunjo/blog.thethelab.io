<template lang="pug">
  #app(v-scroll="handleScroll")
    spinner(ref="spinner")
    gnb
    router-view
</template>

<script>
/* eslint-disable object-shorthand */

import Vue from 'vue';
import { store } from './vuex/store';
import gnb from './components/gnb';
import spinner from './components/spinner.simple';
import eventbus from './eventbus/eventbus';

Vue.directive('scroll', {
  inserted(el, binding) {
    const f = function (evt) {
      if (binding.value(evt, el)) {
        window.removeEventListener('scroll', f);
      }
    };
    window.addEventListener('scroll', f);
  },
});

export default {
  name: 'App',
  store,
  methods: {
    handleScroll() {
      eventbus.emit(eventbus.Events.gnb.scroll, window.scrollY);
    },
  },
  components: {
    gnb,
    spinner,
  },
  created() {
    eventbus.offListener(eventbus.Events.spinner.active);
    eventbus.offListener(eventbus.Events.spinner.disable);
    eventbus.offListener(eventbus.Events.spinner.message);
    eventbus.setListener(eventbus.Events.spinner.message, (message) => {
      this.$refs.spinner.setMessage(message);
    });
    eventbus.setListener(eventbus.Events.spinner.active, () => {
      this.$refs.spinner.enable();
    });
    eventbus.setListener(eventbus.Events.spinner.disable, () => {
      this.$refs.spinner.disable();
    });
  },
};
</script>

<style lang="sass">

.slide-fade-enter-active
  transition: all .2s

.slide-fade-leave-active
  transition: all .2s

.slide-fade-enter, .slide-fade-leave-to
  opacity: 0

body
  margin: 0
  min-height: 600px
  min-width: 400px

#app
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  /*font-family: 'NanumSquare', sans-serif;*
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
  margin: 0
  padding: 0
  box-sizing: border-box

.toast-style
  font-family: 'NanumSquare', sans-serif

</style>
