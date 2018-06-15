<template lang="pug">
  .userWrapper
    .userSectionWrapper
      .userSection
        .userImg(v-bind:style="{background: 'url('+ photoUrl +')'}")
        .userInfo
          .user_name {{name}}
          .user_grade {{grade}}
          .user_email {{email}}
          .user_postNum 글 {{postNum}}
    .postSection
      template(v-for="content in contentList")
        post-list(:title="content.title", :subTitle="content.subTitle",
        :userId="content.userId", :contentId="content.contentId" )

</template>

<script>
import list from '../components/list';
import { auth, content } from '../firebase/firebase.api';
import eventbus from '../eventbus/eventbus';

export default {
  name: 'user',
  props: {
    userId: {
      type: String,
      required: true,
    },
  },
  components: {
    PostList: list,
  },
  data() {
    return {
      photoUrl: '',
      name: '',
      email: '',
      grade: '',
      postNum: '',
      contentList: [],
    };
  },
  async mounted() {
    eventbus.emit(eventbus.Events.spinner.active);
    const user = await auth.getUser(this.userId);
    const userContents = await content.getUserContent(this.userId);
    this.photoUrl = user.photoURL;
    this.name = user.displayName;
    this.grade = user.grade;
    this.postNum = userContents.length;
    this.contentList = userContents;
    this.email = user.email;
    eventbus.emit(eventbus.Events.spinner.disable);
  },
};
</script>

<style lang="sass" scoped>
.userWrapper
  width: 100%
  height: auto
  font-family: 'NanumSquare', sans-serif
  .userSectionWrapper
    width: 100%
    height: 200px
    background: #b0bec5
    .userSection
      width: 700px
      height: inherit
      margin: auto
      position: relative
      .userImg
        position: absolute
        top: 70px
        left: 20px
        width: 100px
        height: 100px
        border-radius: 50%
        background-size: contain !important
        background-repeat: no-repeat
      .userInfo
        top: 75px
        width: 500px
        height: auto
        position: absolute
        text-align: left
        left: 150px
        line-height: 25px
        .user_name
          display: inline-block
          font-size: 20px
        .user_grade
          padding-left: 5px
          display: inline-block
          font-size: 10px
        .user_postNum
          font-size: 14px
        .user_email
          font-size: 14px
  .postSection
    width: 700px
    padding: 48px 0
    height: auto
    margin: auto
</style>
