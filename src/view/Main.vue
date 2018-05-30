<template lang = "pug">
  .mainWrapper
    .main_gradient
    .main(v-bind:class="{searched : isSearchMode}")
      .main_mention "{{grade}}" {{userName}}님 </br> {{mention}}
      .searchWrapper
        input.search(type='search', autofocus='true', placeholder="관심있는 키워드를 입력하세요.")
        i.material-icons.searchBtn(v-on:click="search") search
      .commentWrapper
        .comment {{userName}}님은 THETHELAB과 함께 <strong>{{time}}</strong>시간을 보냈습니다.
        </br> 이곳에 <strong>{{postNum}}</strong>개의 지식을 공유했습니다.
      <!--.mdl-button.mdl-js-button.login(v-on:click ="login") Login-->
      <!--.mdl-button.mdl-js-button.login(v-on:click ="logout") Logout-->
</template>

<script>
import { auth } from '../firebase/firebase.api';

export default {
  name: 'Main',
  data() {
    return {
      grade: '코딩바보',
      userName: '성현',
      mention: '오늘 하루도 열심히!',
      time: '1023',
      postNum: '20',
      isSearchMode: false,
    };
  },
  methods: {
    async login() {
      await auth.addStateChangeListener('login', auth.signIn);
      await auth.signIn();
    },
    async logout() {
      await auth.addStateChangeListener('logout', auth.signOut);
      await auth.signOut();
    },
    search() {
      this.isSearchMode = true;
    },
  },
};
</script>

<style lang="sass" scoped>
.mainWrapper
  width: 100%
  height: 100vh
  background: url("../assets/bg3.jpg") no-repeat
  background-size: cover
  .main_gradient
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    background: radial-gradient(rgba(0, 0, 0, 0.09), rgba(0, 0, 0, 0.59))
  .main
    width: 700px
    height: 100vh
    margin: auto
    position: relative
    text-shadow: 0 0 15px #000000
    font-family: 'NanumSquare', sans-serif
    &.searched
      .main_mention
        opacity: 0
        top: -200px
      .searchWrapper
        top: -20vh
      .commentWrapper
        bottom: -10vh
        opacity: 0
    .main_mention
      transition: opacity .3s, top .3s
      width: 500px
      margin: auto
      line-height: 1.4
      text-align: center
      position: relative
      top: 33vh
      font-size: 60px
      color: white
      opacity: .9
      font-family: 'East Sea Dokdo', cursive
    .searchWrapper
      transition: opacity .5s, top .5s
      position: relative
      top: 38vh
      height: auto
      margin: auto
      width: 350px
      input.search
        font-size: 20px
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
          color: white
        &:focus
          outline: none
        &::-webkit-search-cancel-button
          transform: scale(.7)
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
      position: absolute
      width: 100%
      height: auto
      line-height: 1
      bottom: 50px
      color: white
      font-size: 12px
.mdl-button
  border: .5px solid #bebebe
  border-radius: 20px
  color: white
</style>
