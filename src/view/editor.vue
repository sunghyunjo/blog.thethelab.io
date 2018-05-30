<template lang="pug">
  .editorWrapper
    .titleSection
      .title_bg(v-bind:style="{background: bgColor}")
        .title_txtWrapper
          .bg_colorPicker
            template(v-for="color in colors")
              .color(v-bind:style="{ background : color.bg }",
              v-on:click="changeBgColor(color)"
              v-bind:class="{selectColor : color.selected}")
          .title_txt
            input.title(placeholder="제목을 입력하세요", autofocus='true')
            input.subTitle(placeholder="소제목을 입력하세요")
            .tags
              template(v-for="tag in tags")
                .tag(v-if="tag.selected"
                v-bind:style="{color: txtColor}") {{ '#' + tag.name }}
    .contentSection
      .top
        .tagSelectorSection
          .buttonWrapper
            .mdl-button.mdl-js-button(v-on:click="onTag",
            v-bind:class="{ selected : isTagMode }") 태그선택
        .buttonSection
          .buttonWrapper
            .mdl-button.mdl-js-button(v-on:click="changeMode") {{ nextMode }}
      .tagSelection(v-bind:class="{ nonVisible : !isTagMode }")
        .tag
          template(v-for="tag in tags")
            .tagBtn.mdl-button.mdl-js-button(v-on:click="changeTagSelectMode(tag)",
            v-bind:class="{ selected : tag.selected}") {{ tag.name }}
      textarea.editor(v-model="inputMarked",
                      placeholder="md규칙으로 작성된 내용을 입력해주세요.",
                      v-bind:class="{ nonVisible : !isWriteMode }")
      .editor_parsed(v-html="parse",
                    v-bind:class="{ nonVisible : isWriteMode }")
</template>

<script>
/* eslint-disable no-param-reassign */

import marked from 'marked';
import gnb from '../components/gnb';

export default {
  name: 'editor',
  components: {
    gnb,
  },
  computed: {
    parse() {
      return marked(this.inputMarked);
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
      inputMarked: '',
      isTagMode: false,
      nextMode: '미리보기',
      colors: [
        { bg: '#e7b62f', text: '#7C4108', selected: false },
        { bg: '#ff908e', text: '#a2e5ff', selected: false },
        { bg: '#215dbe', text: '#e5901f', selected: false },
        { bg: '#009738', text: '#ff9388', selected: false },
        { bg: '#863c97', text: '#ffffff', selected: false },
      ],
      bgColor: '#a8a8a8',
      txtColor: '#ffffff',
    };
  },
  methods: {
    changeMode() {
      this.isWriteMode = !this.isWriteMode;
      if (this.isWriteMode) {
        this.nextMode = '미리보기';
      } else {
        this.nextMode = '작성하기';
      }
    },
    onTag() {
      this.isTagMode = !this.isTagMode;
      return this.isTagMode;
    },
    changeTagSelectMode(tag) {
      tag.selected = !tag.selected;
    },
    changeBgColor(color) {
      _.forEach(this.colors, (c) => {
        if (c.selected) {
          c.selected = false;
        }
      });
      color.selected = !color.selected;
      this.bgColor = color.bg;
      this.txtColor = color.text;
    },
  },
};
</script>

<style lang="sass" scoped>
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
            cursor: pointer
            margin: 0px 6px
            display: inline-block
            vertical-align: top
            width: 10px
            height: 10px
            border-radius: 50%
            background: red
            transition: transform .1s
            &:hover
              transform: scale(2)
        .title_txt
          position: absolute
          bottom: 20px
          background: transparent
          .title
            width: 100%
            height: 50px
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
            width: 100%
            height: 50px
            font-family: 'Roboto Mono', monospace
            font-size: 15px
            text-align: left
            .tag
              display: inline-block
              padding: 0 5px

  .contentSection
    width: 700px
    height: auto
    margin: auto
    position: relative
    top: 400px
    font-family: 'NanumSquare', sans-serif
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
        .buttonWrapper
          display: inline-block
          vertical-align: top
          padding: 0 5px
          .mdl-button
            border: .5px solid #bebebe
            border-radius: 20px
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
