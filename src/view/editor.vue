<template lang="pug">
  .editorWrapper
    .titleSection
      .title_bg(v-bind:class="selectedColor")
        .title_txtWrapper
          .bg_colorPicker
            template(v-for="color in colors")
              .color(v-on:click="changeBgColor(color)", v-bind:class="color")
          .title_txt
            input.title(v-model="title", placeholder="제목을 입력하세요", autofocus='true')
            input.subTitle(placeholder="소제목을 입력하세요", v-model="subTitle")
            input.subTitle(v-model="keywordModel", placeholder="키워드", v-on:keyup.13="keywordSubmit", v-on:keyup.32="keywordSubmit")
            .tags
              template(v-for="keyword in keywords")
                .tag(v-bind:class="selectedColor")
                  .text {{ '#' + keyword }}
                    .remove-btn(v-on:click="removeKeyword(keyword)")
                      i.material-icons close
    .contentSection
      .top
        //.tagSelectorSection
          .buttonWrapper
            .mdl-button.mdl-js-button(v-on:click="onTag",
            v-bind:class="{ selected : isTagMode }") 태그선택
      .bottom
        .buttonWrapper
          i.icon-button.fab.fa-github
          .icon-button.i.material-icons(v-on:click="downloadFile") cloud_download
          .icon-button.i.material-icons(v-on:click="changeMode") visibility
          .icon-button.i.material-icons.background-color-red(v-on:click="onDeleteContent") delete
      //.tagSelection(v-bind:class="{ nonVisible : !isTagMode }")
        .tagWrapper
          template(v-for="tag in tags")
            .tagBtn.mdl-button.mdl-js-button(v-on:click="changeTagSelectMode(tag)",
            v-bind:class="{ selected : tag.selected}") {{ tag.name }}
      textarea.editor(v-model="mdContents",
      placeholder="md규칙으로 작성된 내용을 입력해주세요.",
      v-on:keydown.tab.prevent="",
      v-bind:class="{ nonVisible : !isWriteMode }")
      .editor_parsed(v-html="parse",
      v-bind:class="{ nonVisible : isWriteMode }")
</template>

<script>
/* eslint-disable no-param-reassign */

import * as _ from 'lodash';
import path from 'path';
import gnb from '../components/gnb';
import eventbus from '../eventbus/eventbus';
import { auth, content } from '../firebase/firebase.api';
import util from '../util/util';
import githubApi from '../github/github.api';


require('highlightjs/styles/default.css');

export default {
  name: 'editor',
  props: {
    contentId: {
      type: String,
      required: true,
    },
  },
  components: {
    gnb,
  },
  computed: {
    parse() {
      return util.renderMarkdown(this.mdContents);
    },
  },
  data() {
    return {
      tags: [
        { name: 'Java', selected: false },
        { name: 'iOS', selected: false },
        { name: 'Android', selected: false },
        { name: 'javascript', selected: false },
        { name: 'HTML', selected: false },
        { name: 'CSS', selected: false },
        { name: 'C', selected: false },
        { name: 'C++', selected: false },
        { name: 'Unity', selected: false },
        { name: 'NodeJS', selected: false },
        { name: 'Network', selected: false },
        { name: 'OS', selected: false },
        { name: 'Data Structure', selected: false },
        { name: 'jQuery', selected: false },
        { name: 'Firebase', selected: false },
        { name: 'Kotlin', selected: false },
        { name: 'Algorithm', selected: false },
      ],
      isWriteMode: true, // 작성하기모드
      mdContents: '',
      isTagMode: false,
      nextMode: '미리보기',
      colors: [
        'bgGray',
        'bgYellow',
        'bgPink',
        'bgBlue',
        'bgGreen',
        'bgPurple',
        'bgSky',
      ],
      selectedColor: 'bgGray',
      subTitle: '',
      title: '',
      keywordModel: '',
      keywords: [],
    };
  },
  methods: {
    keywordSubmit() {
      console.log(this.keywords, 'keyword');
      if (this.keywords.length > 6) return;
      const keyword = this.keywordModel.replace(/ /gi, '');
      if (_.isEmpty(keyword)) return;
      if (_.some(this.keywords, k => k === keyword)) return;
      this.keywords.push(keyword);
      this.keywordModel = '';
    },
    removeKeyword(keyword) {
      this.keywords = _.filter(this.keywords, k => k !== keyword);
    },
    changeMode() {
      this.isWriteMode = !this.isWriteMode;
    },
    onTag() {
      this.isTagMode = !this.isTagMode;
      return this.isTagMode;
    },
    async onDeleteContent() {
      eventbus.emit(eventbus.Events.spinner.active);
      eventbus.emit(eventbus.Events.spinner.message, `<b>${this.title}</b> 를 삭제하고 있습니다.`);
      try {
        await content.delete(this.$store.getters.getUser, this.contentId);
        this.$router.push('/');
        this.$toasted.show(`컨텐츠 ${this.title}가 삭제 되었습니다.`);
      } catch (e) {
        console.error(e);
      }
      eventbus.emit(eventbus.Events.spinner.disable);
    },
    changeTagSelectMode(tag) {
      tag.selected = !tag.selected;
      this.$store.commit('setTag', this.tags);
    },
    downloadFile() {
      var element = document.createElement('a');
      element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(this.mdContents)}`);
      element.setAttribute('download', `${this.title}.md`);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element)
    },
    getSelectedTags() {
      return _.filter(this.tags, tag => tag.selected);
    },
    changeBgColor(color) {
      this.selectedColor = color;
    },
  },
  created() {
    eventbus.offListener(eventbus.Events.editor.Upload);
    eventbus.setListener(eventbus.Events.editor.Upload, async () => {
      eventbus.emit(eventbus.Events.spinner.active);
      const user = this.$store.getters.getUser;
      const data = {
        md: this.mdContents,
        subTitle: this.subTitle,
        title: this.title,
        keyword: this.keywords,
        color: this.selectedColor,
      };
      // const githubUser = this.$store.getters.getGithubUser;
      // if (!_.isEmpty(githubUser)) {
      //   let pathJoined = path.join(this.githubPath, this.title);
      //   if (pathJoined.startsWith('/')) pathJoined = pathJoined.replace('/', '');
      //   await githubApi.createRepoFile(githubUser.name, 'TIL', pathJoined, this.mdContents);
      // }
      await content.create(user, this.contentId, data);
      this.$toasted.show(`컨텐츠 ${this.title}이 성공적으로 업로드 되었습니다.`);
      this.$router.push({ path: `/content/${this.contentId}` });
    });
  },
  async mounted() {
    eventbus.emit(eventbus.Events.spinner.active);
    try {
      const ret = await content.get(this.contentId);
      console.log(ret);
      if (_.isEmpty(ret.keyword)) ret.keyword = [];
      this.title = ret.title;
      this.subTitle = ret.subTitle;
      this.selectedColor = ret.color;
      this.keywords = ret.keyword;
      this.mdContents = ret.md;
    } catch (e) {
      console.log('empty content, so create new one');
    }
    eventbus.emit(eventbus.Events.spinner.disable);
  },
};
</script>

<style lang="sass" scoped>
@import '../global'

textarea, input
  resize: none
  border: none
  background: transparent
  &:focus
    outline: none

input
  color: white
  caret-color: white

.editorWrapper
  width: 100%
  min-height: 100vh
  height: auto
  .titleSection
    position: absolute
    left: 0
    width: 100%
    height: 400px
    .title_bg
      width: 100%
      height: inherit
      transition: background .3s
      .title_txtWrapper
        width: 700px
        height: auto
        margin: auto
        .bg_colorPicker
          position: absolute
          top: 50px
          left: 45%
          .color
            box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.5)
            cursor: pointer
            margin: 0px 6px
            display: inline-block
            vertical-align: top
            width: 10px
            height: 10px
            border-radius: 50%
            transition: transform .1s
            &.bgGray
              background: #888888
              color: white
            &.bgYellow
              background: #e7b62f
              color: brown
            &.bgPink
              background: #ff908e
              color: skyblue
            &.bgBlue
              background: #215dbe
              color: rosybrown
            &.bgGreen
              background: #009738
              color: deepPink
            &.bgPurple
              background: #863c97
              color: white
            &.bgSky
              background: #6ea8a8
              color: white
            &:hover
              transform: scale(2)
        .title_txt
          width: inherit
          position: absolute
          bottom: 20px
          background: transparent
          .title
            width: 100%
            height: 60px
            font-family: 'Nanum Myeongjo', serif
            font-size: 50px
            padding: 5px 0
            &::placeholder
              color: white
              opacity: .8
          .subTitle
            width: 100%
            height: 30px
            font-family: 'NanumSquare', sans-serif
            font-size: 15px
            padding: 5px 0
            &::placeholder
              color: white
              opacity: .7
          .tags
            width: inherit
            font-family: 'Roboto Mono', monospace
            font-size: 15px
            text-align: left
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
  .contentSection
    width: 700px
    height: auto
    margin: auto
    position: relative
    top: 400px
    font-family: 'NanumSquare', sans-serif
    .bottom
      right: 0
      position: fixed
      bottom: 0
      .buttonWrapper
        padding: 24px
        .icon-button
          display: block
          height: 48px
          line-height: 48px
          text-align: center
          width: 48px
          border-radius: 50%
          background: $md-grey-100
          cursor: pointer
          color: #444
          margin: 12px 0 8px
          box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.35)
          transition: background .3s
          &.fab
            color: #aaa
            font-size: 20px
          &:hover
            background: $md-grey-200
          &.background-color-red
            color: #fff
            background-color: $md-red-600
            &:hover
              background-color: $md-red-700
    .top
      position: relative
      height: 50px
      padding: 20px 0 0 0
      .tagSelectorWrapper
        width: auto
        position: absolute
        display: inline-block
        vertical-align: top
        left: 0
        border-bottom: 1px solid gray
      .buttonSection
        right: 0
      .tagSelectorSection
        left: 0
      .buttonSection, .tagSelectorSection
        position: absolute
        display: inline-block
        vertical-align: top
    .tagSelection
      width: auto
      height: auto
      .tagBtn
        border-radius: 20px
        font-family: 'Roboto Mono', monospace
        text-transform: none
        margin: 3px
    .editor, .editor_parsed
      border-top: 1px dotted #d0d0d0
      padding-top: 20px
      width: inherit
      height: 500px
      font-size: 15px
      text-align: left
      font-family: 'NanumSquare', sans-serif

  .selected
    background: #e6e6e6
  .nonVisible
    display: none
  .selectColor
    border: 1px solid white
    transform: scale(1.5)
</style>
