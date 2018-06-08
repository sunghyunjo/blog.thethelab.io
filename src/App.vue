<template lang="pug">
  #app
    spinner(ref="spinner")
    gnb
    router-view
</template>

<script>

import { store } from './vuex/store';
import gnb from './components/gnb';
import spinner from './components/spinner.simple';
import eventbus from './eventbus/eventbus';


export default {
  name: 'App',
  store,
  methods: {},
  components: {
    gnb,
    spinner,
  },
  created() {
    window.removeEventListener('scroll', this.scroll);
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
  method: {
    scroll() {
      console.log('event');
    },
  },
};
</script>

<style>

.slide-fade-enter-active {
  transition: all .2s;
}

.slide-fade-leave-active {
  transition: all .2s;
}

.slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active below version 2.1.8 */
{
  opacity: 0;
}

body {
  margin: 0;
  min-height: 600px;
  min-width: 400px;
}

/**::-webkit-scrollbar-track {*/
/*background-color: rgba(255, 255, 255, 0);*/
/*width : 6px;*/
/*}*/

/**::-webkit-scrollbar {*/
/*width: 10px;*/
/*background: rgba(255, 255, 255, 0);*/
/*}*/

/**::-webkit-scrollbar-thumb {*/
/*border-radius: 3px;*/
/*background-color: #333;*/
/*}*/

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  /*font-family: 'NanumSquare', sans-serif;*/
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
