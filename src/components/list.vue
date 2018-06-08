<template lang="pug">
  .listWrapper
    .list(v-on:click="changePage")
      .list_title {{ title }}
      .list_subTitle {{ subTitle }}
    .tags
      template(v-for="tag in tags")
        .tag(v-on:click="searchContents(tag)") {{'#'+tag}}
    .userSection(v-bind:class='{loaded:isLoaded}')
      .by by
      .user(v-on:click="searchContents(user)") {{user.displayName}}
      .grade {{user.grade}}
      .divideCircle
      .date {{date}}
</template>

<script>
import cacheUser from '../util/cache.user';

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
    date: {
      type: String,
      default: '3달 전',
    },
    userId: {
      type: String,
      required: true,
    },
    contentId: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      default() {
        return ['javascript', 'html'];
      },
    },
  },
  data() {
    return {
      user: {
        grade: 'student',
        displayName: 'student',
      },
      isLoaded: false,
    };
  },
  methods: {
    searchTag(object) {
      console.log(object);
    },
    changePage() {
      this.$router.push(`/content/${this.contentId}`);
    },
  },
  async mounted() {
    const u = await cacheUser.get(this.userId);
    this.user = u;
    this.isLoaded = true;
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
    opacity: 0
    width: auto
    height: 15px
    transition: opacity .3s, translate .3s
    transform: translate(0, 10)
    &.loaded
      opacity: 1
      transform: translate(0, 0)
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
