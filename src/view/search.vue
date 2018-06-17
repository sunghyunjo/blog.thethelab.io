<template lang="pug">
  .searchWrapper
    .postListSection
      h3.msg {{queries}}로 검색한 결과
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
      queries: '',
    };
  },
  methods: {
    async doSearch() {
      this.isEmpty = false;
      this.queries = _.filter(_.split(this.$route.query.q, ','), q => !_.isEmpty(q));
      this.contentList = await content.find(this.queries);
      if (_.isEmpty(this.contentList)) {
        this.isEmpty = true;
      }
    },
  },
  watch: {
    '$route.query.q': _.debounce(function () {
      this.doSearch();
    }),
  },
  async mounted() {
    eventbus.emit(eventbus.Events.spinner.active);
    this.doSearch();
    eventbus.emit(eventbus.Events.spinner.disable);
  },
};
</script>

<style lang="sass" scoped>
.searchWrapper
  width: 100%
  height: auto
  .postListSection
    padding-top: 50px
    width: 700px
    margin: auto
    height: auto
    .emptyMsg
      display: none
      &.visible
        display: block
</style>
