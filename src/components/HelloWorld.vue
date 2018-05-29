<template lang = "pug">
  .hello
    button.login(v-on:click ="login") Login
    button.login(v-on:click ="logout") Logout
</template>

<script>
import { auth } from '../firebase/firebase.api';

export default {
  name: 'HelloWorld',
  methods: {
    async login() {
      await auth.addStateChangeListener('login', auth.signIn);
      await auth.signIn();
    },
    async logout() {
      await auth.addStateChangeListener('logout', auth.signOut);
      await auth.signOut();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
