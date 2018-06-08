<template lang="pug">
  .searchWrapper
    h1 SearchPage
    .postListSection
      template(v-for="content in contentList")
        post-list(:title="content.title", :subTitle="content.subTitle",
        :userId="content.userId", :contentId="content.contentId" )
</template>

<script>
import _ from 'lodash';
import list from '../components/list';
import { content } from '../firebase/firebase.api';

export default {
  name: 'search',
  components: {
    'post-list': list,
  },
  data() {
    return {
      contentList: [],
    };
  },
  async mounted() {
    const queries = _.filter(_.split(this.$route.query.q, ','), q => !_.isEmpty(q));
    this.contentList = await content.find(queries);
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
