import Vue from 'vue';


const eventBus = new Vue({
  methods: {
    getTime(millis) {
      const c = new Date(millis);
      return c.toLocaleDateString();
    },
  },
});
const Events = {
  editor: {
    Upload: 'onUpload',
  },
  spinner: {
    active: 'spinner.active',
    disable: 'spinner.disable',
  },
};

export default {
  Events,
  emit(type) {
    eventBus.$emit(type);
  },
  setListener(type, callback) {
    eventBus.$on(type, callback);
  },
  offListener(type) {
    eventBus.$off(type);
  },
};
