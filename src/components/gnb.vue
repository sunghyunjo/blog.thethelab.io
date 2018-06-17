<template lang="pug">
  .gnbWrapper(v-bind:class="getScroll")
    .gnb(v-bind:class="setGnbColor")
      i.material-icons.gnb-command.icon(v-on:click="onSideMenu") menu
      .gnb-command.title(v-on:click="changePage('/')") THETHELAB BLOG
      .flex-empty
      .gnb-command(v-bind:class="hideBtn", v-on:click="upload") UPLOAD
      .input-group(v-bind:class="changeSearchBarMode")
        i.material-icons search
        input(placeholder="search", v-model="inputKeyword", v-on:keyup="search")
    .side-nav(v-bind:class="{ visible : isClicked}")
      .side-nav-cover
        i.material-icons.closeBtn(v-on:click="onSideMenu") close
        .user-section
          .user_imgWrapper
            .user_img(v-bind:style="{background: 'url('+ getUserPhotoUrl+')'}")
          .user-name-field
            .user_name {{getUserName}}
              i.material-icons.user-info-editBtn(v-on:click="changePage('/settings')") settings
            .user_grade {{getUserGrade}}
          .user-commands
            .flex-empty
            .button(v-if='isLogin', v-on:click="onCreateDocument()") 글쓰기
            .button(v-on:click="changeStatus") {{ isLogin ? '로그아웃' : '로그인' }}
            .flex-empty
        .github-section(v-if='isLogin')
          .connect-github(v-on:click="requestGithubSign", v-if="!getIsUsableGithub")
            .text
              i.fab.fa-github
              | Connect To Github
          .connected-github( v-if="getIsUsableGithub")
            .flex-empty
            i.fab.fa-github
            .text Github Online
            .flex-empty
            i.fa.fa-sync-alt.button(v-on:click="requestGithubSign")
            //.user hello {{getGithubUser.name}}
          .til-sync-content(v-on:click="loadTilFromGithub")
            i.fa.fa-sync-alt
            .text Sync TIL Contents
        .bottomSection
          .signed-group
            .section-name - 작성글 목록 -
            .listWrapper
              template(v-for="(list, index) in getContentsList")
                .list(v-on:click="changePage('/content/' + list.contentId)") {{index+1}}. {{list.title}}
</template>

<script>
/* eslint-disable no-await-in-loop */
import Vue from 'vue';
import * as _ from 'lodash';
import uuid from 'uuid/v1';
import { auth, content } from '../firebase/firebase.api';
import eventBus from '../eventbus/eventbus';
import githubApi from '../github/github.api';
import util from '../util/util';


export default {
  name: 'gnb',
  data() {
    return {
      isClicked: false,
      isBlackMode: false,
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
      scrollY: 0,
      inputKeyword: '',
    };
  },
  computed: {
    getContentsList() {
      return this.contentList;
    },
    getScroll() {
      if (this.scrollY > 50) return 'scrolled';
      return '';
    },
    setGnbColor() {
      const currentPath = this.$route.path.split('/')[1];
      if (currentPath === 'settings' || currentPath === 'search') {
        return 'black';
      }
      return 'white';
    },
    changeSearchBarMode() {
      const currentPath = this.$route.path.split('/')[1];
      if (currentPath === '' || currentPath === 'editor') {
        return 'hide';
      }
      return '';
    },
    hideBtn() {
      const currentPath = this.$route.path.split('/')[1];
      if (currentPath !== 'editor') {
        return 'hide';
      }
      return '';
    },
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
    getIsUsableGithub() {
      return !_.isEmpty(this.$store.getters.getGithubUser);
    },
    getGithubUser() {
      return this.$store.getters.getGithubUser;
    },
    isLogin() {
      return !_.isEmpty(this.$store.getters.getUser);
    },
    getUserPhotoUrl() {
      if (this.$store.state.user.photoURL === undefined) {
        return 'http://sloangroup.ca/wp-content/uploads/2013/06/user.jpg';
      }
      return this.$store.state.user.photoURL;
    },
  },
  methods: {
    search(evt) {
      if (evt.keyCode === 13) {
        this.$router.push(`/search?q=${this.inputKeyword}`);
        this.inputKeyword = '';
      }
    },
    requestGithubSign() {
      this.$router.push('/auth/github/sign');
    },
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
      eventBus.emit(eventBus.Events.spinner.active);
      try {
        if (this.isLogin) {
          await auth.signOut();
        } else {
          await auth.signIn();
        }
      } catch (e) {
        console.error(e);
      }
      eventBus.emit(eventBus.Events.spinner.disable);
    },
    onCreateDocument() {
      this.$router.push({ path: `/editor/${uuid()}` });
    },
    connectToGithub() {

    },
    async loadTilFromGithub() {
      eventBus.emit(eventBus.Events.spinner.active);

      const user = this.$store.getters.getUser;
      const githubUser = this.$store.getters.getGithubUser;
      const ret = await githubApi.getRepoFiles(githubUser.login, 'TIL');
      // const mds = _.filter(ret.data, d => d.path.endsWith('.md'));
      const mds = [];

      async function getFolderContent(folder) {
        eventBus.emit(eventBus.Events.spinner.message, `폴더 <b>${folder.name}</b>를 읽고 있어요.<br>총 <b>${mds.length}개</b>의 md파일을 읽었어요.`);
        const folderContent = await githubApi.getFolderContents(githubUser.login, 'TIL', folder.path);
        if (folder.name.indexOf('rx') !== -1) return;
        console.log('load folder ', folder.name, folderContent);
        for (let i = 0; i < folderContent.data.length; i += 1) {
          const d = folderContent.data[i];
          if (d.type === 'dir') {
            await getFolderContent(d);
          } else if (d.name.endsWith('.md')) {
            mds.push(d);
          }
        }
      }

      for (let i = 0; i < ret.data.length; i += 1) {
        const d = ret.data[i];
        if (d.type === 'dir') {
          await getFolderContent(d);
        } else if (d.name.endsWith('.md')) {
          mds.push(d);
        }
      }

      eventBus.emit(eventBus.Events.spinner.message, `<b>${mds.length}개</b>의 MD파일을 데이터베이스로 전송중이에요`);
      const colors = ['bgGray', 'bgYellow', 'bgPink', 'bgBlue', 'bgGreen', 'bgPurple', 'bgSky'];
      const promises = _.map(mds, async (md) => {
        const mdContent = (await githubApi.getContent(githubUser.login, 'TIL', md.path)).data;
        const idx = Math.floor(Math.random() * colors.length);
        console.log(colors, idx);
        return content.create(user, mdContent.sha, {
          md: util.decode(mdContent.content),
          keyword: _.map(mdContent.name.replace('.md', '').match(/[a-z]+/gi), k => k.toLowerCase()),
          title: mdContent.name.replace('.md', ''),
          subTitle: '',
          color: colors[idx],
        });
      });
      try {
        const promisesResult = await Promise.all(promises);
        eventBus.emit(eventBus.Events.spinner.message, `${user.displayName} 님의 글을 로드하고 있어요.`);
        this.contentList = await content.getUserContent(user.uid);
        eventBus.emit(eventBus.Events.spinner.disable);
        console.log(promisesResult, 'promise result');
      } catch (e) {
        eventBus.emit(eventBus.Events.spinner.disable);
      }
    },
  },
  created() {
    eventBus.setListener(eventBus.Events.gnb.scroll, (scrollY) => {
      this.scrollY = scrollY;
    });
    eventBus.setListener(eventBus.Events.gnb.update, async () => {
      this.contentList = await content.getUserContent(this.$store.getters.getUser.uid);
    });
  },
  mounted() {
    eventBus.emit(eventBus.Events.spinner.active);
    this.inputKeyword = '';
    auth.addStateChangeListener('gnb', async (user) => {
      console.log('gnb', user, 'is empty : ', _.isEmpty(user));
      if (_.isNil(user) || _.isEmpty(user)) {
        eventBus.emit(eventBus.Events.spinner.disable);
        this.contentList = [];
        return;
      }
      eventBus.emit(eventBus.Events.spinner.active);
      this.contentList = await content.getUserContent(user.uid);
      if (!_.isNil(user.githubAccessToken)) {
        githubApi.setToken(user.githubAccessToken);
        try {
          const githubUser = await githubApi.getUser();
          this.$store.commit('setGithubUser', githubUser);
        } catch (e) {
          // Auth Failed!!
        }
      }
      eventBus.emit(eventBus.Events.spinner.disable);
    });
  },
};
</script>

<style lang="sass" scoped>
@import '../global'

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
  background: rgba(255, 255, 255, 0)
  line-height: 50px
  &.scrolled
    .gnb
      background: rgba(255, 255, 255, 0.93)
      border-bottom: solid 1px #eee
      .gnb-command
        color: black !important
  .gnb
    width: 100%
    position: fixed
    display: flex
    transition: background .1s
    .input-group
      position: absolute
      top: 0
      left: calc(50% - 140px)
      &.hide
        display: none
      i.material-icons
        position: absolute
        left: 0
        top: 0
        height: 50px
        width: 40px
        margin-left: 4px
        text-align: center
        line-height: 50px
        font-size: 20px
      input
        &::placeholder
          font-style: italic
          color: #777
        color: #333
        padding-left: 40px
        font-size: 16px
        height: 32px
        border-radius: 16px
        outline: none
        border: solid 1px #ddd
        width: 280px
    &.black
      background: #fff
      border-bottom: solid 1px #eee
      .gnb-command
        color: black
    &.white
      .gnb-command
        color: white
    .gnb-command
      transition: transform .3s, opacity .3s
      &.hide
        display: none
      &.title
        padding: 0 !important
        font-size: 16px
        line-height: 50px
        font-weight: 900
      cursor: pointer
      height: 100%
      padding: 0 8px
      color: #fff
      opacity: 0.8
      &:hover
        font-weight: 900
        opacity: 1
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
    border-right: solid 1px rgba(0, 0, 0, 0.2)
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
      .side-nav-section
        width: 100%
      .user-section
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
            padding-left: 10px
            .user-info-editBtn
              padding-left: 5px
              font-size: 12px
              color: #bebebe
              cursor: pointer
              &:hover
                color: #0d47a1
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
      .github-section
        border-top: solid 1px #ddd
        .til-sync-content
          cursor: pointer
          background: #fafafa
          color: #666
          position: absolute
          width: 100%
          bottom: 1px
          left: 0
          justify-content: center
          align-items: center
          height: 30px
          font-size: 14px
          line-height: 30px
          display: flex
          border-top: solid 1px #ddd
          overflow: hidden
          transition: background .3s
          &:hover
            background: #eee
            i.fa
              transform: rotate(180deg)
              color: $md-blue-500
          .text
            width: auto
            font-weight: 600
            line-height: inherit
            padding-left: 8px
          i.fa
            transition: transform 0.5s, color .3s
            transform: rotate(0deg)
            text-align: center
        .connect-github, .connected-github
          font-size: 14px
          align-content: center
          color: #666
          display: flex
          justify-content: center
          align-items: center
          height: 40px
          line-height: 40px
          .text
            width: auto
            font-weight: 500
            line-height: inherit
          i.fa.button
            width: 40px
            text-align: center
            height: 100%
            border-left: solid 1px #ddd
            line-height: inherit
            cursor: pointer
            transition: background .2s
            &:hover
              background: #f0f0f0
            color: #555
          i.fab
            line-height: inherit
            display: inline-block
            vertical-align: top
            width: auto
            font-size: 20px
            padding-right: 12px
        .connected-github
          color: $md-green-600
          .user
            line-height: 20px
        .connect-github
          cursor: pointer
          &:hover
            background: #fafafa
            color: #333

      .bottomSection
        height: calc(100vh - 320px)
        overflow-y: auto
        overflow-x: hidden
        white-space: nowrap
        border-top: solid 1px #ddd
        .section-name
          font-size: 12px
          font-weight: 500
        .listWrapper
          .title
            font-size: 12px
            font-weight: 500
          .list
            &:first-child
              border-top: solid 1px #eee
            text-align: left
            line-height: 1.4
            padding: 12px
            word-break: break-all
            font-size: 15px
            white-space: normal
            border-bottom: solid 1px #eee
            width: 100%
            cursor: pointer
            &:hover
              background: #f0f0f0
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
