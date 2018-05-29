<template lang="pug">
  .editorWrapper
    .titleSection
      .title_bg
        .title_txtWrapper
          .bg_colorPicker
            .color(v-on:click="changeBgColor")
            .color(v-on:click="changeBgColor")
            .color(v-on:click="changeBgColor")
            .color(v-on:click="changeBgColor")
            .color(v-on:click="changeBgColor")
          .title_txt
            input.title(placeholder="제목을 입력하세요", autofocus='true')
            input.subTitle(placeholder="소제목을 입력하세요")
            .tags#tags
    .contentSection
      .top
        .tagSelectorSection
          .buttonWrapper
            .mdl-button.mdl-js-button(v-on:click="onTag",
            v-bind:style="[isTagMode ? selectedStyle : nonSelectedStyle]") 태그선택
        .buttonSection
          .buttonWrapper
            .mdl-button.mdl-js-button(v-on:click="editMode"
            v-bind:style="[isEditMode ? selectedStyle : nonSelectedStyle]") 작성모드
          .buttonWrapper
            .mdl-button.mdl-js-button(v-on:click="previewMode"
            v-bind:style="[!isEditMode ? selectedStyle : nonSelectedStyle]") 미리보기
      .tagSelection(v-bind:style="[isTagMode ? visible : nonVisible ]")
        .tagBtn.mdl-button.mdl-js-button(v-on:click="addTag") Java
        .tagBtn.mdl-button.mdl-js-button(v-on:click="addTag") javaScript
        .tagBtn.mdl-button.mdl-js-button(v-on:click="addTag") HTML
        .tagBtn.mdl-button.mdl-js-button(v-on:click="addTag") CSS
        .tagBtn.mdl-button.mdl-js-button(v-on:click="addTag") C
        .tagBtn.mdl-button.mdl-js-button(v-on:click="addTag") C++
        .tagBtn.mdl-button.mdl-js-button(v-on:click="addTag") JSON
        .tagBtn.mdl-button.mdl-js-button(v-on:click="addTag") Android
        .tagBtn.mdl-button.mdl-js-button(v-on:click="addTag") iOS
        .tagBtn.mdl-button.mdl-js-button(v-on:click="addTag") Unity
        .tagBtn.mdl-button.mdl-js-button(v-on:click="addTag") NodeJS
        .tagBtn.mdl-button.mdl-js-button(v-on:click="addTag") Network
        .tagBtn.mdl-button.mdl-js-button(v-on:click="addTag") OS
        .tagBtn.mdl-button.mdl-js-button(v-on:click="addTag") jQuery
        .tagBtn.mdl-button.mdl-js-button(v-on:click="addTag") firebase
        .tagBtn.mdl-button.mdl-js-button(v-on:click="addTag") Vue
        .tagBtn.mdl-button.mdl-js-button(v-on:click="addTag") Kotlin
        .tagBtn.mdl-button.mdl-js-button(v-on:click="addTag") Data-Structure
        .tagBtn.mdl-button.mdl-js-button(v-on:click="addTag") Web
        .tagBtn.mdl-button.mdl-js-button(v-on:click="addTag") Algorithm
      textarea.editor(v-model="inputMarked",
                      placeholder="md규칙으로 작성된 내용을 입력해주세요.",
                      v-bind:style="[isEditMode ? visible : nonVisible]")
      .editor_parsed(v-html="parse",
                    v-bind:style="[isEditMode ? nonVisible : visible]")
</template>

<script>
import marked from 'marked';
import gnb from '../components/gnb';

// TODO:: 버튼 컴포넌트로 분리하기.

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
      isEditMode: true,
      inputMarked: '',
      isTagMode: false,
      visible: {
        display: 'block',
      },
      nonVisible: {
        display: 'none',
      },
      selectedStyle: {
        background: '#dadada',
      },
      nonSelectedStyle: {
        background: 'white',
      },
    };
  },
  methods: {
    editMode() {
      if (!this.isEditMode) {
        this.isEditMode = true;
        return this.isEditMode;
      }
      return this.isEditMode;
    },
    previewMode() {
      if (this.isEditMode) {
        this.isEditMode = false;
        return !this.isEditMode;
      }
      return this.isEditMode;
    },
    onTag() {
      this.isTagMode = !this.isTagMode;
      return this.isTagMode;
    },
    // TODO :: 태그 선택되면, 선택 표시하고 다시 클릭하면 지우기 기능 추가.
    addTag(e) {
      document.getElementById('tags').innerText += (` #${e.target.innerText}`);
    },
    changeBgColor() {
      return 0;
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
      background: #ff908e
      .title_txtWrapper
        width: 700px
        height: auto
        margin: auto
        .bg_colorPicker
          position: absolute
          top: 50px
          left: 50%
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
            color: #a2e5ff

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
      height: 120px
      .tagBtn
        border-radius: 20px
        font-family: 'Roboto Mono', monospace
        text-transform: none
    .editor, .editor_parsed
      border-top: 1px dotted #d0d0d0
      padding-top: 20px
      width: inherit
      height: 500px
      font-size: 15px
      text-align: left

</style>
