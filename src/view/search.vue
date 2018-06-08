<template lang="pug">
  .searchWrapper
    h1 SearchPage
    .postListSection
      post-list
</template>

<script>
import list from '../components/list';

export default {
  name: 'search',
  components: {
    PostList: list,
  },
};
</script>

<style lang="sass" scoped>
.searchWrapper
  width: 100%
  height: auto
  .postListSection
    width: 700px
    margin: auto
    height: auto

</style>
