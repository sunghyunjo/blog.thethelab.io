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
    message: 'spinner.message',
  },
  gnb: {
    scroll: 'gnb.scroll',
    update: 'gnb.update',
  },
  user: {
    updateGrade: 'user.updateGrade',
  },
};

export default {
  Events,
  emit(type, d) {
    eventBus.$emit(type, d);
  },
  setListener(type, callback) {
    eventBus.$on(type, callback);
  },
  offListener(type) {
    eventBus.$off(type);
  },
};
