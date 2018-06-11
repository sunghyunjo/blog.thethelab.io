<template lang="pug">
  .mainWrapper
    .main_gradient
    .main
      .main_mention(v-html="getMainText").
      .searchWrapper
        input.search(type='search', autofocus='true',
        placeholder="관심있는 키워드를 입력하세요.", v-model="keyword")
        i.material-icons.searchBtn(v-on:click="search(keyword)") search
        .searchedItemGroup
          template(v-for="item in searchItems")
            .searchedItem(v-on:click="changePage('/content/'+item.contentId)")
              .title {{item.title}}
              .sub-title {{item.subTitle}}
      .commentWrapper
        .comment(v-html="getBottomText")
</template>

<script>
import * as _ from 'lodash';
import list from '../components/list';
import { content } from '../firebase/firebase.api';

export default {
  name: 'Main',
  components: {
    'post-list': list,
  },
  computed: {
    getTime() {
      return new Date().getTime();
    },
    getMainText() {
      if (_.isEmpty(this.$store.getters.getUser)) {
        return '더더랩의 기술블로그<br>( ~ . ~ )';
      }
      return `"${this.$store.getters.getUser.grade}" ${this.$store.getters.getUser.displayName}님<br>${this.$store.getters.getUser.mention}`;
    },
    // TODO 시간 undefined 해결하기..
    getBottomText() {
      if (_.isEmpty(this.$store.getters.getUser)) return '';
      const creationTime = this.$store.getters.getUser.time;
      const currentTime = new Date().getTime();
      const diffTime = (currentTime - creationTime) / 60000;
      return `${this.$store.getters.getUser.displayName}님은 THETHELAB과 함께 ${diffTime}분을 보냈습니다.`;
    },
  },
  data() {
    return {
      grade: '코딩바보',
      userName: '성현',
      mention: '오늘 하루도 열심히!',
      time: '1023',
      postNum: '20',
      keyword: '',
      searchItems: [],
      user: this.$store.getters.getUser,
    };
  },
  watch: {
    keyword() {
      this.getSearchItems();
    },
  },
  methods: {
    changePage(path) {
      this.$router.push({ path });
    },
    search(keyword) {
      this.isSearchMode = true;
      if (keyword === '') {
        this.$router.push('/search');
      } else {
        this.$router.push(`/search?q=${keyword}`);
      }
    },
    getSearchItems: _.debounce(
      async function () {
        this.searchItems = await content.find(this.keyword.split(' '));
      }, 500),
  },
};
</script>

<style lang="sass" scoped>
@import "../global"
.searchedItemGroup
  width: 100%
  height: calc(100% - 30px)
  margin-top: 20px
  left: 0
  color: #fff
  text-align: left
  overflow: auto
  .searchedItem
    padding: 8px
    height: 56px
    cursor: pointer
    &:hover
      background: rgba(255, 255, 255, 0.15)
    .title
      text-shadow: 0 0 15px #000000
      font-weight: 600
      font-size: 18px
      height: 24px
      line-height: 24px
    .sub-title
      height: 14px
      font-size: 14px
      line-height: 18px
  &::-webkit-scrollbar
    display: none

.mainWrapper
  width: 100%
  min-height: 680px
  height: 100vh
  background: url("../assets/image03.jpg") no-repeat center
  background-size: cover
  @media #{$phone}
    height: 100%
  .main_gradient
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    background: radial-gradient(rgba(0, 0, 0, 0.09), rgba(0, 0, 0, 0.59))
    transition: background .3s
    &.searched
      background: white
  .main
    width: 700px
    height: 100%
    margin: auto
    position: relative
    text-shadow: 0 0 15px #000000
    font-family: 'NanumSquare', sans-serif
    @media #{$phone}
      width: 100%
    .main_mention
      transition: opacity .3s, top .3s
      width: 500px
      margin: auto
      height: auto
      line-height: 1.4
      text-align: center
      position: fixed
      top: 33%
      left: calc(50% - 250px)
      font-size: 60px
      color: white
      opacity: .9
      font-family: 'East Sea Dokdo', cursive
      @media #{$phone}
        width: 100%
        font-size: 50px
        line-height: 1.2
    .searchWrapper
      transition: opacity .5s, top .5s
      position: fixed
      left: calc(50% - 175px)
      top: 70%
      height: calc(45% - 120px)
      margin: auto
      width: 350px
      @media #{$phone}
        width: 60vw
        left: -10px
      input.search
        font-size: 18px
        height: 30px
        line-height: 30px
        text-align: center
        width: 280px
        resize: none
        border: none
        border-bottom: solid .5px white
        background: transparent
        color: white
        caret-color: white
        &::placeholder
          color: rgba(255, 255, 255, 0.85)
        &:focus
          outline: none
        &::-webkit-search-cancel-button
          transform: scale(.7)
        @media #{$phone}
          width: 100%
          font-size: 14px
      .searchBtn
        width: 40px
        height: 30px
        position: absolute
        top: 5px
        cursor: pointer
        vertical-align: center
        color: white
    .commentWrapper
      transition: opacity .5s, bottom .5s
      position: fixed
      width: inherit
      height: auto
      line-height: 1
      bottom: 50px
      color: white
      font-size: 12px
      @media #{$phone}
        font-size: 10px

.postList
  display: none

.mdl-button
  border: .5px solid #bebebe
  border-radius: 20px
  color: white
</style>
