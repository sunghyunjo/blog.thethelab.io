<template lang="pug">
  .sign-root
    .text-group
      .emo {{emo}}
      .text {{message}}
      <svg id="octo" viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <path id="part1" class="part" d="m332.289429,87.087219c60.033295,-20.366676 114.402222,-21.83609 172.935547,1.047241l-11.403595,32.850952c-43.333344,-15.5 -104.147491,-15.984329 -148.480804,-0.734329" transform="rotate(45 418.757 96.1885)"/>
      <path id="part2" class="part" d="m398.527466,246.388596c60.033325,-20.366684 114.402222,-21.83609 172.935547,1.047241l-11.403564,32.850967c-43.333374,-15.500031 -104.147491,-15.984344 -148.480835,-0.734344" transform="rotate(90 484.995 255.49)"/>
      <path id="part3" class="part" d="m331.332214,404.823669c60.033325,-20.366699 114.402252,-21.83609 172.935547,1.047241l-11.403534,32.850952c-43.333405,-15.500031 -104.147522,-15.984344 -148.480865,-0.734344" transform="rotate(135 417.8 413.925)"/>
      <path id="part4" class="part" d="m171.58223,470.323669c60.03331,-20.366699 114.402237,-21.83609 172.935532,1.047241l-11.403534,32.850952c-43.333405,-15.500031 -104.147522,-15.984344 -148.48085,-0.734344" transform="rotate(180 258.05 479.425)"/>
      <path id="part5" class="part" d="m13.0822,406.074005c60.033301,-20.367004 114.401801,-21.835999 172.935805,1.046997l-11.404007,32.850983c-43.332993,-15.5 -104.147301,-15.983978 -148.480589,-0.733978" transform="rotate(-135 99.55 415.175)"/>
      <path id="part6" class="part" d="m-53.713486,247.091553c60.03331,-20.367004 114.40181,-21.835999 172.935806,1.046997l-11.404022,32.850983c-43.332977,-15.5 -104.147277,-15.983978 -148.480576,-0.733978" transform="rotate(-90 32.754 256.193)"/>
      <path id="part7" class="part" d="m12.883621,87.061485c60.033295,-20.366669 114.402206,-21.836082 172.935562,1.047249l-11.403595,32.850952c-43.333344,-15.5 -104.147507,-15.984329 -148.48082,-0.734337" transform="rotate(-45 99.3514 96.1628)"/>
      <path id="part8" class="part" d="m172.906631,20.929741c60.03331,-20.366681 114.402206,-21.836091 172.935562,1.04723l-11.403595,32.85096c-43.333344,-15.5 -104.147507,-15.984322 -148.48082,-0.734329"/>
      <path id="cat" d="m197.75,459.850006c0,0 -0.125,-48.75 -0.125,-48.850006c0,-0.100006 -4.75,-4.399994 -33,-1c-28.25,3.399994 -62.5,-66.649994 -65.25,-69.75c-2.75,-3.100006 14,-5.649994 26.5,5c12.5,10.649994 38.25,33.350006 38.5,33.25c0.25,-0.100006 31.75,0.600006 31.75,0.5c0,-0.100006 3,-44.149994 20.75,-37.5c17.75,6.649994 -72.5,1.350006 -97.75,-61.25c-25.25,-62.600006 19.25,-124.899994 20.25,-115.399994c1,9.5 -17,-35 -10.25,-46.850006c6.75,-11.849998 19.25,-9.400002 30.25,-5.5c11,3.900002 34.25,20.350006 39.25,21.25c5,0.899994 18.25,-8.150002 59.25,-7.5c41,0.650002 52.769196,6.138474 56.75,6.5c3.980804,0.361526 30.519165,-17.38076 38.250061,-22.557701c7.730896,-5.176941 18.653595,-9.092308 28.653687,0.78849c10.000092,9.880798 4.923157,67.00383 3.096252,55.519211c-1.826904,-11.484619 36.25,70.600006 6,122.100006c-30.25,51.5 -99.25,52.75 -87.75,55.899994c11.5,3.149994 15,33.350006 14.75,49.850006l-0.25,65.899994l-22.875,3.875l-0.5,-74.75c0.125,-9.225006 -9.125,-10.649994 -9.625,-9.75l-0.25,85.875l-21.25,1.25l-0.25,-86.75l-10.5,0l0,86.5l-20.75,-1l-0.25,-84.25c0,-0.100006 -8.75,-1.149994 -8.25,10.75l-0.5,72.25"/>
      </svg>

</template>

<script>
import axios from 'axios';
import qs from 'query-string';
import _ from 'lodash';
import githubConfig from '../../config/github.config';
import { auth } from '../../firebase/firebase.api';


export default {
  name: 'github',
  data() {
    return {
      status: 'waiting',
      emo: '( = _ = )',
      message: 'Github의 응답을 기다리고 있어요!',
    };
  },
  async mounted() {
    auth.addStateChangeListener('githubRedirect', async () => {
      const user = this.$store.getters.getUser;
      if (_.isNil(user) || _.isEmpty(user)) {
        this.message = '사용자 정보를 얻는데 실패했어요, 로그인 상태를 체크해주세요.';
        this.emo = '( - _ - );';
        return;
      }
      const url = 'https://github.com/login/oauth/access_token';
      const body = {
        client_id: githubConfig.githubClient,
        client_secret: githubConfig.githubSecret,
        code: this.$route.query.code,
        state: githubConfig.state,
      };

      const a = await axios.post('https://request-delegate.hanu.io/request',
        {
          method: 'post',
          url,
          body,
        });
      const query = qs.parse(a.data);
      if (!_.isNil(query.error)) {
        this.message = 'Github의 승인을 얻는데 실패했어요, 재시도 해주세요.';
        this.emo = '( T ^ T )';
      } else {
        await auth.update(user, { githubAccessToken: query.access_token });
        this.message = 'Github와 연결을 완료했어요, 이창은 곧 사라집니다!';
        this.emo = '~( ~ . ~ )~';

        setTimeout(() => {
          window.close();
        }, 2000);

      }
    });
  },
};
</script>

<style scoped lang="sass">


.sign-root
  font-family: 'Roboto', sans-serif
  height: 100vh
  background: #222
  color: #eee
  display: flex
  align-items: center
  justify-content: center
  .text-group
    .text
      font-size: 16px
      padding: 24px 24px 112px
      color: rgba(255, 255, 255, 0.8)
    .emo
      padding: 12px
      font-size: 80px

</style>

<style scoped>

#octo #cat {
  fill: #fff
}

#octo {
  height: 100px;
  width: 100px;
}

#octo .part {
  animation-name: fade;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-out;
  fill: #333;
}

#octo #part1 {
  animation-delay: 0.000s
}

#octo #part2 {
  animation-delay: 0.125s
}

#octo #part3 {
  animation-delay: 0.250s
}

#octo #part4 {
  animation-delay: 0.375s
}

#octo #part5 {
  animation-delay: 0.500s
}

#octo #part6 {
  animation-delay: 0.625s
}

#octo #part7 {
  animation-delay: 0.750s
}

#octo #part8 {
  animation-delay: 0.875s
}

@keyframes fade {
  0%, 25% {
    fill: #fff
  }
  50%, 75% {
    fill: #333
  }
}

.lds-ripple {
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;
}

.lds-ripple div {
  position: absolute;
  border: 4px solid #fff;
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}

.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}

@keyframes lds-ripple {
  0% {
    top: 28px;
    left: 28px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: -1px;
    left: -1px;
    width: 58px;
    height: 58px;
    opacity: 0;
  }
}

</style>
