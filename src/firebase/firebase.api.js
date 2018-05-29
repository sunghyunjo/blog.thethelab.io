import * as _ from 'lodash';
import firebase from './firebase.app';

const resource = {
  auth: firebase.auth(),
  storage: firebase.storage(),
  database: firebase.database(),
  firestore: firebase.firestore(),
};


// login, logout, state change
const auth = (() => {
  const provider = new firebase.auth.GoogleAuthProvider();
  const authEvent = {};

  resource.auth.onAuthStateChanged((user) => {
    _.forEach(authEvent, (func) => {
      func(user);
      console.log('stateChange');
      console.log(func);
    });
  });

  async function signIn() {
    const result = await resource.auth.signInWithPopup(provider);
    console.log('result:', result);
  }

  async function signOut() {
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
