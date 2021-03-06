import Vue from 'vue';
import Router from 'vue-router';
import Main from '../view/main';
import editor from '../view/editor';
import content from '../view/content';
import user from '../view/user';
import search from '../view/search';
import settings from '../view/settings';
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
      path: '/user/:userId',
      name: 'user',
      props: true,
      component: user,
    },
    {
      path: '/search',
      name: 'search',
      props: true,
      component: search,
    },
    {
      path: '/settings',
      name: 'settings',
      props: true,
      component: settings,
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
