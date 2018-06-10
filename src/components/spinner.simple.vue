<template lang="pug">
  .show-box(v-bind:class='{usage:usage}')
    .loader
      svg.circular(viewbox='25 25 50 50')
        circle.path(cx='50', cy='50', r='20',
        fill='none', v-bind:stroke-width="strokeWidth + 'px'", stroke-miterlimit='10')
    .text(v-html="text")

</template>

<script>
export default {
  data() {
    return {
      visible: false,
      usage: false,
      text: '',
    };
  },
  props: {
    strokeWidth: {
      type: Number,
      default: 3,
    },
    test: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    mounted() {
      if (this.test) {
        this.visible = true;
        this.usage = true;
      }
    },
    enable() {
      this.text = '';
      this.visible = true;
      this.usage = true;
    },
    setMessage(message) {
      this.text = message;
    },
    disable() {
      this.usage = false;
      setTimeout(() => {
        this.visible = false;
      }, 300);
    },
  },
};
</script>

<style scoped lang="sass">
.show-box
  opacity: 0
  transition: opacity .3s
  pointer-events: none
  display: flex
  align-items: center
  justify-content: center
  &.usage
    opacity: 1
    pointer-events: all
  z-index: 14
  width: 100%
  background: rgba(255, 255, 255, .85)
  /*border: solid 1px #ccc*/
  position: fixed
  top: 0
  bottom: 0
  left: 0
  right: 0
  .text
    padding-top: 180px
  .loader
    position: absolute
    left: calc(50% - 50px)
    top: calc(50% - 50px)

    width: 100px
    &:before
      content: ''
      display: block
      padding-top: 100%

    .circular
      -webkit-animation: rotate 2s linear infinite
      animation: rotate 2s linear infinite
      height: 100%
      -webkit-transform-origin: center center
      transform-origin: center center
      width: 100%
      position: absolute
      top: 0
      bottom: 0
      left: 0
      right: 0
      margin: auto

    .path
      stroke-dasharray: 1, 200
      stroke-dashoffset: 0
      -webkit-animation: dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite
      animation: dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite
      stroke-linecap: round

  @-webkit-keyframes rotate
    100%
      -webkit-transform: rotate(360deg)
      transform: rotate(360deg)

  @keyframes rotate
    100%
      -webkit-transform: rotate(360deg)
      transform: rotate(360deg)

  @-webkit-keyframes dash
    0%
      stroke-dasharray: 1, 200
      stroke-dashoffset: 0

    50%
      stroke-dasharray: 89, 200
      stroke-dashoffset: -35px

    100%
      stroke-dasharray: 89, 200
      stroke-dashoffset: -124px

  @keyframes dash
    0%
      stroke-dasharray: 1, 200
      stroke-dashoffset: 0

    50%
      stroke-dasharray: 89, 200
      stroke-dashoffset: -35px

    100%
      stroke-dasharray: 89, 200
      stroke-dashoffset: -124px

  @-webkit-keyframes color
    100%,
    0%
      stroke: #d62d20

    40%
      stroke: #0057e7

    66%
      stroke: #008744

    80%,
    90%
      stroke: #ffa700

  @keyframes color
    100%,
    0%
      stroke: #d62d20

    40%
      stroke: #0057e7

    66%
      stroke: #008744

    80%,
    90%
      stroke: #ffa700
</style>
