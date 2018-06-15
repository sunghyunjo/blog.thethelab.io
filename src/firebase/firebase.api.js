/* eslint-disable no-param-reassign,arrow-body-style */
import * as _ from 'lodash';
import axios from 'axios';
import firebase from './firebase.app';
import { store } from '../vuex/store';


const resource = {
  auth: firebase.auth(),
  storage: firebase.storage(),
  database: firebase.database(),
  firestore: firebase.firestore(),
};

resource.firestore.settings({ timestampsInSnapshots: true });

const content = {
  async getUserContent(userId) {
    // console.log(userId);
    const dataListSnapshot = await resource.firestore.collection('user_content').doc(userId).get();
    if (!dataListSnapshot.exists) return [];

    const contentIds = dataListSnapshot.data();
    const contents = await Promise.all(_.map(contentIds, (v, k) => resource.firestore.collection('content').doc(k).get()));
    return _.map(contents, c => c.data());
  },
  async create(user, contentId, data) {
    const md = data.md;
    delete data.md;
    const keywords = {};
    _.forEach(data.keyword, (k) => {
      keywords[k] = true;
    });
    data.keyword = keywords;
    data.userId = user.uid;
    data.contentId = contentId;
    data.date = new Date().getTime();
    const ref = resource.storage.ref(`content/${contentId}`);
    await ref.putString(md);
    data.url = await ref.getDownloadURL();

    // TODO make To Transaction
    const userContent = {};
    userContent[contentId] = true;
    const userContentRef = resource.firestore.collection('user_content').doc(user.uid);
    const userContentListData = await userContentRef.get();
    if (userContentListData.exists) {
      await userContentRef.update(userContent);
    } else {
      await userContentRef.set(userContent);
    }
    const ret = await resource.firestore.collection('content').doc(contentId).set(data);
    return ret;
  },

  // async getContentList(userId) {
  //   const ref = resource.firestore.collection('content')
  //
  // },
  async delete(user, contentId) {
    await resource.firestore.collection('content').doc(contentId).delete();
    const deleteContent = {};
    deleteContent[contentId] = firebase.firestore.FieldValue.delete();
    await resource.firestore.collection('user_content').doc(user.uid).update(deleteContent);
  },
  async get(contentId) {
    const snapshot = await resource.firestore.collection('content').doc(contentId).get();
    const data = snapshot.data();
    const md = (await axios.get(data.url)).data;
    data.md = md;
    return data;
  },
  async find(words) {
    const ref = resource.firestore.collection('content');
    if (words.length === 1 && _.isEmpty(words[0])) throw new DOMException();
    let query = ref;
    _.forEach(words, (word) => {
      query = query.where(`keyword.${word}`, '==', true);
    });
    const snapshot = await query.get();
    const ret = [];
    snapshot.forEach((doc) => {
      ret.push(doc.data());
    });
    return ret;
  },
};
// login, logout, state change
const auth = (() => {
  const provider = new firebase.auth.GoogleAuthProvider();
  const authEvent = {};
  const refUser = resource.firestore.collection('user');

  resource.auth.onAuthStateChanged(async (user) => {
    let serverUser = {};
    if (!_.isNil(user) && !_.isEmpty(user)) {
      serverUser = (await refUser.doc(user.uid).get()).data();
      if (_.isNil(serverUser)) serverUser = {};
    }
    store.commit('setUser', serverUser);
    _.forEach(authEvent, (func) => {
      func(serverUser);
    });
  });

  async function saveUserToStore(user) {
    const ref = resource.firestore.collection('user').doc(user.uid);
    const userData = (await ref.get()).data();
    console.log('save store');
    store.commit('setUser', userData);
  }

  async function update(user, body) {
    const ref = resource.firestore.collection('user').doc(user.uid);
    await ref.update(body);
    await saveUserToStore(user);
  }


  async function signIn() {
    const result = await resource.auth.signInWithPopup(provider);
    const u = result.user;
    const user = {
      displayName: u.displayName,
      uid: u.uid,
      email: u.email,
      photoURL: u.photoURL,
    };

    const ref = resource.firestore.collection('user').doc(u.uid);
    const serverUser = await ref.get();

    if (serverUser.exists) {
      const userData = serverUser.data();
      store.commit('setUser', userData);
      return userData;
    }
    _.assign(user, {
      time: new Date().getTime(),
      tilRepository: 'TIL',
      nickname: '',
      grade: '무지랭이',
      mention: '',
    });
    await ref.set(user);
    store.commit('setUser', user);
    return user;
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

  async function getUser(userId) {
    const user = await resource.firestore.collection('user').doc(userId).get();
    if (user.exists) return user.data();
    return null;
  }

  return {
    signIn,
    signOut,
    addStateChangeListener,
    saveUserToStore,
    getUser,
    update,
  };
})();


export {
// eslint-disable-next-line import/prefer-default-export
  auth,
  content,
};
