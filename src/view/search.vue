<template lang="pug">
  .searchWrapper
    h1 SearchPage
    .postListSection
      template(v-for="content in contentList")
        post-list(:title="content.title", :subTitle="content.subTitle",
        :userId="content.userId", :contentId="content.contentId" )
      h3.emptyMsg(v-bind:class="{visible : isEmpty}") 검색결과가 존재하지 않습니다.
</template>

<script>
import _ from 'lodash';
import list from '../components/list';
import { content } from '../firebase/firebase.api';
import eventbus from '../eventbus/eventbus';

export default {
  name: 'search',
  components: {
    'post-list': list,
  },
  data() {
    return {
      contentList: [],
      isEmpty: false,
    };
  },
  async mounted() {
    eventbus.emit(eventbus.Events.spinner.active);
    const queries = _.filter(_.split(this.$route.query.q, ','), q => !_.isEmpty(q));
    this.contentList = await content.find(queries);
    if (_.isEmpty(this.contentList)) {
      this.isEmpty = true;
    }
    eventbus.emit(eventbus.Events.spinner.disable);
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
    .emptyMsg
      display: none
      &.visible
        display: block
</style>
