<template lang="pug">
.listWrapper
  .list
    .list_title {{ title }}
    .list_subTitle {{ subTitle }}
  .tags
    template(v-for="tag in tags")
      .tag(v-on:click="searchContents(tag)") {{'#'+tag}}
  .userSection
    .by by
    .user(v-on:click="searchContents(user)") {{userName}}
    .grade {{userGrade}}
    .divideCircle
    .date {{date}}
</template>

<script>
export default {
  name: 'list',
  props: {
    title: {
      type: String,
      default: '자바스크립트로 좋은 코드 만들기',
    },
    subTitle: {
      type: String,
      default: '자바스크립트로 코딩할 때 지켜야 하는 규칙들',
    },
    userName: {
      type: String,
      default: '조성현',
    },
    date: {
      type: String,
      default: '3달 전',
    },
    tags: {
      default: ['javascript', 'html'],
    },
    userGrade: {
      type: String,
      default: 'student',
    },
  },
  data() {
  },
  methods: {
    searchTag(object) {
      console.log(object);
    },
  },
};
</script>

<style lang="sass" scoped>
.listWrapper
  width: 100%
  height: auto
  background: #ffffff
  padding: 20px 0 30px 0
  text-shadow: none
  color: black
  text-align: left
  border-bottom: .5px dotted lightgray
  .list
    width: 100%
    height: 100%
    background: #ffffff
    cursor: pointer
    &:hover
      .list_title
        text-decoration: underline
    .list_title
      font-size: 20px
    .list_subTitle
      padding-top: 5px
      font-size: 14px
      color: gray
  .tags
    width: 100%
    height: 30px
    padding: 15px 0 0 0
    font-family: 'Roboto Mono', monospace
    .tag
      font-size: 14px
      color: gray
      cursor: pointer
      display: inline-block
      vertical-align: top
      padding: 0 10px 0 0
      &:hover
        color: darkslateblue
        font-weight: 800
  .userSection
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
</style>
