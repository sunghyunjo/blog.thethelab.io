<template lang="pug">
  .userWrapper
    .userSectionWrapper
      .userSection
        .userImg
        .userInfo
          .user_name
    .postSection
      post-list

</template>

<script>
import list from '../components/list';

export default {
  name: 'user',
  components: {
    PostList: list,
  },
};
</script>

<style lang="sass" scoped>
.userWrapper
  width: 100%
  height: auto
  .userSectionWrapper
    width: 100%
    height: 250px
    background: #b0bec5
    .userSection
      width: 700px
      height: inherit
      margin: auto
      background: #ff9
      position: relative
      .userImg
        position: absolute
        top: 50px
        left: 20px
        width: 100px
        height: 100px
        background: #0d47a1
        border-radius: 50%
      .userInfo
        width: 500px
        height: inherit
        background: #00b0ff
        position: absolute
        left: 150px
  .postSection
    width: 700px
    height: auto
    margin: auto
</style>
