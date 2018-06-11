<template lang="pug">
  .contentsWrapper
    .titleSection
      .title_bg(v-bind:style="{background: color.bg, color: color.text}")
        .title_txtWrapper
          .title_txt
            .title {{ title }}
            .subTitle {{ subTitle}}
            .userSection
              .by by
              .user(v-on:click="searchContents(user)") {{userName}}
              .grade {{userGrade}}
              .divideCircle
              .date {{}}
            .tags
              template(v-for="(word, k) in keyword")
                .tag(v-bind:style="{color: color.text}")
                  .text(v-on:click="goToSearchPage(k)") {{ '#' + k }}
    .contentSection
      .content(v-html="md")
    .edit-button.i.material-icons(v-if="contentIsAuthor", v-on:click="goToEditPage") edit
</template>

<script>
import * as _ from 'lodash';
import { content } from '../firebase/firebase.api';
import eventbus from '../eventbus/eventbus';
import util from '../util/util';


export default {
  name: 'contents',
  props: {
    contentId: {
      type: String,
      required: true,
    },
  },
  computed: {
    contentIsAuthor() {
      if (_.isEmpty(this.$store.getters.getUser)) return false;
      return this.$store.getters.getUser.uid === this.authorUid;
    },
  },
  watch: {
    async contentId() {
      eventbus.emit(eventbus.Events.spinner.active);
      await this.updateScreen();
      eventbus.emit(eventbus.Events.spinner.disable);
    },
  },
  data() {
    return {
      title: '메인 타이틀',
      subTitle: '자바스크립트로 코딩할 때 지켜야 하는 규칙들',
      userName: '조성현',
      date: {
        seconds: 0,
      },
      keyword: [{ key: true }],
      userGrade: 'student',
      color: {
        bg: '#a8a8a8',
        text: '#ffffff',
      },
      md: '',
      authorUid: '',
    };
  },
  methods: {
    async updateScreen() {
      const data = await content.get(this.contentId);
      console.log(data);
      _.forEach(data, (v, k) => {
        this[k] = v;
      });
      this.authorUid = data.userId;
      this.md = util.renderMarkdown(`${this.md} `);
    },
    goToSearchPage(q) {
      this.$router.push(`/search?q=${q}`);
    },
    goToEditPage() {
      this.$router.push(`/editor/${this.contentId}`);
    },
  },
  async mounted() {
    eventbus.emit(eventbus.Events.spinner.active);
    try {
      await this.updateScreen();
    } catch (e) {
      console.error(e);
    }
    eventbus.emit(eventbus.Events.spinner.disable);
  },
};
</script>

<style lang="sass" scoped>

@import '../global'

.contentsWrapper
  .edit-button
    position: fixed
    right: 24px
    bottom: 24px
    width: 48px
    height: 48px
    border-radius: 50%
    background: $md-blue-500
    box-shadow: 0px 4px 4px 0 rgba(0, 0, 0, 0.3)
    line-height: 48px
    text-align: center
    color: #fff
    cursor: pointer
    transition: background .3s
    &:hover
      background: $md-blue-600

  width: 100%
  height: auto
  position: relative
  .titleSection
    position: absolute
    left: 0
    width: 100%
    height: 400px
    .title_bg
      width: 100%
      height: inherit
      background: #f0f
      .title_txtWrapper
        width: 700px
        height: auto
        margin: auto
        .title_txt
          width: inherit
          position: absolute
          bottom: 20px
          background: transparent
          text-align: left
          .title
            width: 100%
            font-family: 'Nanum Myeongjo', serif
            word-break: break-all
            font-size: 50px
            padding: 5px 0
          .subTitle
            width: 100%
            height: 30px
            font-family: 'NanumSquare', sans-serif
            font-size: 15px
            padding: 5px 0
          .tags
            font-family: 'Roboto Mono', monospace
            font-size: 15px
            text-align: left
            width: calc(100% - 200px)
            .tag
              display: inline-block
              cursor: pointer
              position: relative
              height: 27px
              line-height: 27px
              margin-right: 12px
              margin-bottom: 8px
              .text
                background: rgba(255, 255, 255, .5)
                padding: 0 12px
                border-radius: 18px
                display: inline-block
                vertical-align: top
                height: 100%
                line-height: 27px
                .remove-btn
                  margin-left: 8px
                  color: inherit
                  display: inline-block
                  padding-top: 1px
                  cursor: pointer
                  i
                    border-radius: 50%
                    background: rgba(0, 0, 0, .2)
                    padding: 1px
                    color: #ffffff
                    font-size: 12px
                    &:hover
                      background: rgba(0, 0, 0, .5)
        .userSection
          position: absolute
          right: 20px
          bottom: 20px
          width: auto
          height: 15px
          .by
            font-family: 'Courgette', cursive
            font-size: 13px
            color: gray
            display: inline-block
            vertical-align: top
          .user
            font-size: 13px
            display: inline-block
            vertical-align: top
            padding-left: 5px
            cursor: pointer
            &:hover
              color: darkslateblue
              font-weight: 800
          .grade
            font-size: 10px
            display: inline-block
            vertical-align: top
            padding-left: 5px
          .divideCircle
            width: 2px
            height: 2px
            display: inline-block
            vertical-align: center
            border-radius: 50%
            background: black
            margin: 4px
          .date
            display: inline-block
            vertical-align: top
            font-size: 10px
            color: gray
  .contentSection
    width: 700px
    height: auto
    margin: auto
    position: relative
    top: 400px
    font-family: 'NanumSquare', sans-serif
    .content
      padding-top: 20px
      width: inherit
      font-size: 15px
      text-align: left
      font-family: 'NanumSquare', sans-serif
      line-height: 2
      tab-size: 2
      padding-bottom: 64px


</style>
<style lang="sass">
.content
  h1
    padding-top: 12px
    line-height: 1.42

img
  width: 100%
  height: auto

.hljs
  white-space: nowrap
</style>
