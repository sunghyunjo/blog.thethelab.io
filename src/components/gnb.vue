<template lang="pug">
  .gnbWrapper
    .gnb
      .gnb_menuIcon
        i.material-icons.menuBtn(v-on:click="onSideMenu") menu
      .gnb_saveBtn
        .mdl-button.mdl-js-button(v-on:click="upload") UPLOAD
    .userInfo(v-bind:style="[isClicked ? visible : nonVisible]")
      i.material-icons.closeBtn(v-on:click="onSideMenu") close
      .userSection
        .user_imgWrapper
          .user_img(v-bind:style="{background: 'url('+ getUserPhotoUrl+')'}")
        .user
          .user_name {{getUserName}}
          .user_grade {{getUserGrade}}
        .btnByLoginWrapper
          .mdl-button.mdl-js-button.mdl-button--primary.writeBtn(v-on:click="changePage('editor')",
          v-bind:class="{nonVisible : !isLogin}") 글쓰기
          .mdl-button.mdl-js-button.mdl-button--primary.signInOutBtn(v-on:click="changeStatus").
            {{ signStatus }}
      .home
        i.material-icons.home_icon home
        .home_txt(v-on:click="changePage('/')") 블로그 홈으로 가기
      .bottomSection
        .title < Contents List >
        .listWrapper
          template(v-for="list in lists")
            .list(v-on:click="changePage('content')") {{list}}
</template>

<script>
import { auth } from '../firebase/firebase.api';

export default {
  name: 'gnb',
  data() {
    return {
      isClicked: false,
      visible: {
        visibility: 'visible',
        opacity: 1,
        width: '250px',
      },
      nonVisible: {
        visibility: 'hidden',
        opacity: 0,
        width: '0',
      },
      lists: ['자바스크립트 좋은 코드 만들기',
        '자바스크립트 나쁜 코드 만들기',
        '자바스크립트 좋은 코드 만들기',
        '자바스크립트 나쁜 코드 만들기',
        '자바스크립트 좋은 코드 만들기',
        '자바스크립트 나쁜 코드 만들기',
        '자바스크립트 좋은 코드 만들기',
        '자바스크립트 나쁜 코드 만들기',
        '자바스크립트 좋은 코드 만들기',
        '자바스크립트 나쁜 코드 만들기',
        '자바스크립트 좋은 코드 만들기',
        '자바스크립트 나쁜 코드 만들기'],
      mode: 'home',
      signStatus: '로그인',
      isLogin: false,
    };
  },
  computed: {
    getUserName() {
      if (this.$store.state.user.displayName === undefined) {
        return 'Guest';
      }
      return this.$store.state.user.displayName;
    },
    getUserGrade() {
      if (this.$store.state.user.grade === undefined) {
        return '로그인 하세요';
      }
      return this.$store.state.user.grade;
    },
    getUserPhotoUrl() {
      if (this.$store.state.user.photoURL === undefined) {
        return 'http://sloangroup.ca/wp-content/uploads/2013/06/user.jpg';
      } return this.$store.state.user.photoURL;
    },
  },
  methods: {
    onSideMenu() {
      this.isClicked = !this.isClicked;
      return this.isClicked;
    },
    upload() {
      console.log('upload');
    },
    changePage(page) {
      this.$router.push(page);
    },
    async changeStatus() {
      console.log(this.isLogin, this.signStatus);
      if (this.isLogin) {
        await auth.signOut();
        this.isLogin = false;
        this.signStatus = '로그인';
      } else {
        await auth.signIn();
        this.isLogin = true;
        this.signStatus = '로그아웃';
      }
    },
  },
  mounted() {
    auth.addStateChangeListener('login', (user) => {
      console.log('alloc', user);
    });
  },
};
</script>

<style lang="sass" scoped>
  .gnbWrapper
    position: fixed
    top: 0
    left: 0
    z-index: 100
    width: 100vw
    height: 50px
    background: transparent
    line-height: 50px
    &.isScroll
      .gnb
        .gnb_menuIcon, .gnb_saveBtn
          color: black
        .gnb_menuIcon
          .menuBtn
            &:hover
              color: darkslateblue
    .gnb
      .gnb_menuIcon, .gnb_saveBtn
        display: inline-block
        vertical-align: top
        position: absolute
        color: white
      .gnb_saveBtn
        right: 10px
        height: 50px
        .mdl-js-button
          color: white
      .gnb_menuIcon
        left: 20px
        padding: 6.5px 0
        width: 50px
        .menuBtn
          &:hover
            color: black
            cursor: pointer
    .userInfo
      width: 250px
      height: 100vh
      background: white
      position: relative
      transition: visibility .1s, opacity .1s, width .4s
      box-shadow: 0 0 5px #bfbfbf
      .closeBtn
        position: absolute
        right: 10px
        top: 10px
        cursor: pointer
        &:hover
          background : #e9e9e9
      .userSection
        width: 100%
        height: 250px
        text-align: center
        background: #eaeaea
        .user_imgWrapper
          width: 100%
          padding: 50px 0 10px 0
          .user_img
            background-size: contain !important
            background-repeat: no-repeat
            width: 70px
            margin: auto
            height: 70px
            border-radius: 50%
        .user
          .user_name
            width: 100%
            height: 20px
            font-size: 20px
          .user_grade
            width: 100%
            height: 15px
            font-size: 12px
        .btnByLoginWrapper
          padding: 20px
          .writeBtn
            &.nonVisible
              display: none
      .bottomSection
        overflow-y: auto
        overflow-x: hidden
        height: calc(100vh - 300px)
        white-space: nowrap
        .title
          font-size: 15px
          font-weight: bold
        .list, .home
          height: 40px
          line-height: 40px
          cursor: pointer
          &:hover
            color: darkslateblue
      .home
        line-height: 50px
        height: 50px
        background: #f0f0f0
        cursor: pointer
        .home_icon
          height: 50px
          font-size: 20px
          vertical-align: center
          line-height: 50px
          padding: 0 10px 0 0
          color: #898989
          &:hover
            color: darkslateblue
        .home_txt
          display: inline-block
          vertical-align: top


</style>
