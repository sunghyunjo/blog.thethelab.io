import Vue from 'vue';
import Router from 'vue-router';
import Main from '../view/main';
import editor from '../view/editor';
import content from '../view/content';
import githubAuthSign from '../view/auth/github.sign';
import githubAuthRedirect from '../view/auth/github.redirect';

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
      path: '/editor/:contentId',
      name: 'editor',
      props: true,
      component: editor,
    },
    {
      path: '/content/:contentId',
      name: 'content',
      props: true,
      component: content,
    },
    {
      path: '/auth/github/sign',
      name: 'auth',
      props: true,
      component: githubAuthSign,
    },
    {
      path: '/auth/github/redirect',
      name: 'auth',
      props: true,
      component: githubAuthRedirect,
    },
  ],
});
