<template lang="pug">
  .gnbWrapper
    .gnb
      .gnb_menuIcon
        i.material-icons.menuBtn(v-on:click="onSideMenu") menu
      .gnb_saveBtn
        .mdl-button.mdl-js-button UPLOAD
    .userInfo(v-bind:style="[isClicked ? visible : nonVisible]")
      i.material-icons.closeBtn(v-on:click="onSideMenu") close
      .userSection
        .user_imgWrapper
          .user_img
        .user
          .user_name 조성현
          .user_grade 관리자
        .writeBtn
          .mdl-button.mdl-js-button.mdl-button--primary 글쓰기
      .postingList
        .title < Contents List >
        .listWrapper
          .list 자바스크립트 좋은 코드 만들기
          .list 자바스크립트 좋은 코드 만들
          .list 자바스크립트 좋은 코드 만들
          .list 자바스크립트 좋은 코드 만들
          .list 자바스크립트 좋은 코드 만들
          .list 자바스크립트 좋은 코드 만들
          .list 자바스크립트 좋은 코드 만들
          .list 자바스크립트 좋은 코드 만들
          .list 자바스크립트 좋은 코드 만들
          .list 자바스크립트 좋은 코드 만들기
          .list 자바스크립트 좋은 코드 만들
          .list 자바스크립트 좋은 코드 만들
          .list 자바스크립트 좋은 코드 만들
          .list 자바스크립트 좋은 코드 만들
          .list 자바스크립트 좋은 코드 만들
          .list 자바스크립트 좋은 코드 만들
          .list 자바스크립트 좋은 코드 만들
          .list 자바스크립트 좋은 코드 만들
</template>

<script>
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
    };
  },
  methods: {
    onSideMenu() {
      this.isClicked = !this.isClicked;
      return this.isClicked;
    },
    // scrolledNav() {
    //   const ele = document.getElementsByClassName('gnbWrapper');
    //   ele.className += ' isScroll';
    // },
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
            width: 70px
            margin: auto
            height: 70px
            border-radius: 50%
            background: red
        .user
          .user_name
            width: 100%
            height: 20px
            font-size: 20px
          .user_grade
            width: 100%
            height: 15px
            font-size: 12px
        .writeBtn
          padding: 20px
      .postingList
        overflow: auto
        white-space: nowrap
        .title
          font-size: 15px
          font-weight: bold
        .list
          height: 40px
          line-height: 40px
          cursor: pointer
          &:hover
            color: darkslateblue
</style>
