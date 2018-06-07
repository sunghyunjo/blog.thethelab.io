<template lang="pug">
  .gnbWrapper
    .gnb
      i.material-icons.gnb-command.icon(v-on:click="onSideMenu") menu
      .gnb-command.title(v-on:click="changePage('/')") THETHELAB BLOG
      .flex-empty
      .gnb-command(v-on:click="upload") UPLOAD
    .side-nav(v-bind:class="{ visible : isClicked}")
      .side-nav-cover
        i.material-icons.closeBtn(v-on:click="onSideMenu") close
        .userSection
          .user_imgWrapper
            .user_img(v-bind:style="{background: 'url('+ getUserPhotoUrl+')'}")
          .user-name-field
            .user_name {{getUserName}}
            .user_grade {{getUserGrade}}
          .user-commands
            .flex-empty
            .button(v-if='isLogin', v-on:click="onCreateDocument()") 글쓰기
            .button(v-on:click="changeStatus") {{ isLogin ? '로그아웃' : '로그인' }}
            .flex-empty
        .bottomSection
          .title - 작성글 목록 -
          .listWrapper
            template(v-for="list in contentList")
              .list(v-on:click="changePage('/content/' + list.contentId)") {{list.title}}
</template>

<script>
import * as _ from 'lodash';
import uuid from 'uuid/v1';
import { auth, content } from '../firebase/firebase.api';
import eventBus from '../eventbus/eventbus';

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
      contentList: [],
      mode: 'home',
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
      }
      return this.$store.state.user.photoURL;
    },
  },
  methods: {
    onSideMenu() {
      this.isClicked = !this.isClicked;
      return this.isClicked;
    },
    upload() {
      eventBus.emit(eventBus.Events.editor.Upload);
    },
    changePage(path) {
      this.$router.push({ path });
    },
    async changeStatus() {
      if (this.isLogin) {
        await auth.signOut();
      } else {
        await auth.signIn();
      }
    },
    onCreateDocument() {
      this.$router.push({ path: `/editor/${uuid()}` });
    },
  },
  mounted() {
    auth.addStateChangeListener('login', async (user) => {
      console.log(user);
      if (_.isNil(user)) {
        this.isLogin = false;
        this.contentList = [];
      } else {
        this.isLogin = true;
        this.contentList = await content.getUserContent(user.uid);
      }
      console.log('로그인상태:', this.isLogin);
    });
  },
};
</script>

<style lang="sass" scoped>
.flex-empty
  flex: 1

.flex-space
  width: 16px

.font[family="dokdo"]
  font-family: 'East Sea Dokdo', cursive

.gnbWrapper
  position: fixed
  top: 0
  left: 0
  z-index: 100
  width: 100vw
  height: 50px
  background: transparent
  line-height: 50px
  .gnb
    width: 100%
    position: fixed
    display: flex
    .gnb-command
      transition: transform .3s
      &.title
        padding: 0 !important
        font-size: 16px
        line-height: 50px
      cursor: pointer
      height: 100%
      padding: 0 8px
      color: #fff
      &:hover
        font-weight: 900
      &.icon
        line-height: 50px
        width: 50px
  .side-nav
    &.visible
      width: 250px
      opacity: 1
    height: 100vh
    overflow-x: hidden
    white-space: nowrap
    background: white
    border-right: solid 1px #ccc
    position: fixed
    transition: width .3s, opacity .3s
    opacity: 0
    width: 0
    .side-nav-cover
      width: 250px
      height: 100%
      .closeBtn
        position: absolute
        right: 10px
        top: 10px
        cursor: pointer
        &:hover
          background: #e9e9e9
      .userSection
        width: 100%
        height: 250px
        text-align: center
        background: #f6f6f6
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
            box-shadow: 0 0 3px 2px rgba(0, 0, 0, 0.15)
        .user-name-field
          .user_name
            width: 100%
            font-size: 18px
            line-height: 28px
          .user_grade
            width: 100%
            font-size: 14px
            line-height: 18px
        .user-commands
          padding: 20px
          display: flex
          .button
            font-size: 14px
            color: #444
            border-radius: 18px
            background: #fff
            height: 36px
            line-height: 36px
            padding: 0 24px
            margin: 4px
            width: auto
            cursor: pointer
            box-shadow: 0 0 3px 0px rgba(0, 0, 0, 0.3)
            transition: box-shadow .3s
          .writeBtn
            &.nonVisible
              display: none
      .bottomSection
        overflow-y: auto
        overflow-x: hidden
        height: calc(100vh - 300px)
        white-space: nowrap
        border-top: solid 1px #ddd
        .title
          font-size: 12px
          font-weight: 500
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
