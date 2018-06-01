import Vue from 'vue';
import Router from 'vue-router';
import Main from '../view/main';
import editor from '../view/editor';
import content from '../view/content';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main,
    },
    {
      path: '/editor',
      name: 'editor',
      component: editor,
    },
    {
      path: '/content',
      name: 'content',
      component: content,
    },
  ],
});
