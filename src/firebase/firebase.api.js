import * as _ from 'lodash';
import firebase from './firebase.app';
import { store } from '../vuex/store';

const resource = {
  auth: firebase.auth(),
  storage: firebase.storage(),
  database: firebase.database(),
  firestore: firebase.firestore(),
};

console.log(store);
// login, logout, state change
const auth = (() => {
  const provider = new firebase.auth.GoogleAuthProvider();
  const authEvent = {};
  const refUser = resource.database.ref('/user');

  resource.auth.onAuthStateChanged(async (user) => {
    if (!_.isNil(user)) {
      const serverUser = (await refUser.child(`/${user.uid}`).once('value')).val();
      store.commit('setUser', serverUser);
    } else {
      store.commit('setUser', {});
    }
    _.forEach(authEvent, (func) => {
      func(user);
    });
  });

  async function signIn() {
    const result = await resource.auth.signInWithPopup(provider);
    const u = result.user;
    const user = {
      displayName: u.displayName,
      uid: u.uid,
      email: u.email,
      photoURL: u.photoURL,
    };

    const serverUser = (await refUser.child(`/${u.uid}`).once('value')).val();
    if (_.isNil(serverUser)) {
      // join
      _.assign(user, {
        creationTime: new Date(),
        nickname: '',
        grade: '무지랭이',
        mention: '',
      });
      await refUser.child(`/${u.uid}`).set(user);
      store.commit('setUser', user);
      return user;
    }
    store.commit('setUser', serverUser);
    return serverUser;
  }

  async function signOut() {
    store.commit('setUser', {});
    return resource.auth.signOut();
  }

  function addStateChangeListener(eventName, callback) {
    // 인증상태 여부 체크를 받는 것.
    if (_.isNil(authEvent[eventName])) authEvent[eventName] = callback;
    else console.error('already exist event ', eventName);
  }

  return {
    signIn,
    signOut,
    addStateChangeListener,
  };
})();


export {
// eslint-disable-next-line import/prefer-default-export
  auth,
};
