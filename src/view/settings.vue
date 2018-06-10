<template lang="pug">
  .settingsWrapper
    .title 사용자 정보 수정 ^0^
    .infoSection
      .info
        .info_txt display Name :
        input(v-model ="getUserName", maxlength="15").info_data
      .info
        .info_txt mention :
        input(v-model="getMention", maxlength="20").info_data
      .info
        .info_txt date :
        input(v-model="getDate", type="date").info_data
      .info
        .info_txt TIL Repository :
        input(v-model="getGitRepo", type="url").info_data
      .saveBtn(v-on:click="save") 저장하기
</template>

<script>
import { auth } from '../firebase/firebase.api';

export default {
  name: 'settings',
  data() {
    return {
      displayName: '',
      mention: '',
      date: '',
    };
  },
  methods: {
    async save() {
      const user = this.$store.getters.getUser;
      const data = {
        displayName: this.displayName,
        mention: this.getMention,
        time: this.date,
      };
      await auth.update(user, data);
    },
  },
  computed: {
    getUserName: {
      get() {
        return this.$store.getters.getUser.displayName;
      },
      set(data) {
        this.displayName = data;
      },
    },
    getMention: {
      get() {
        return this.$store.getters.getUser.mention;
      },
      set(data) {
        this.mention = data;
      },
    },
    getDate: {
      get() {
        const date = new Date(this.$store.getters.getUser.time);
        const year = date.getFullYear();
        let month = date.getMonth();
        let day = date.getDate();
        if (month < 10) {
          month = `0${month}`;
        }
        if (day < 10) {
          day = `0${day}`;
        }
        return `${year}-${month}-${day}`;
      },
      set(data) {
        // eslint-disable-next-line no-param-reassign
        data = new Date(data).getTime();
        this.date = data;
      },
    },
    getGitRepo: {
      get() {
        // return this.$store.getters.getUser.git;
      },
      set(data) {
        // this.mention = data;
      },
    },
  },
};
</script>

<style lang="sass" scoped>
.settingsWrapper
  width: 100%
  height: 100vh
  .title
    padding-top: 200px
    font-size: 30px
    font-weight: 900
    font-family: 'NanumSquare', sans-serif
  .infoSection
    width: 500px
    margin: auto
    height: 300px
    position: relative
    top: 50px
    .info
      width: auto
      height: 40px
      display: flex
      line-height: 40px
      padding: 10px 0
      .info_txt
        width: 150px
        text-align: right
        font-weight: 800
        font-size: 20px
        padding: 0 20px
        height: inherit
      .info_data
        font-size: 16px
        width: 200px
        border: none
        border-bottom: 2px solid #bebebe
        background: transparent
        transition: border .3s
        &:focus
          outline: none
          border-color: #0d47a1
    .saveBtn
      width: 100px
      border: 1px solid #bebebe
      padding: 10px 15px
      border-radius: 30px
      position: relative
      top: 50px
      left: 300px
      cursor: pointer
      &:hover
        background: #e7e7e7
</style>
