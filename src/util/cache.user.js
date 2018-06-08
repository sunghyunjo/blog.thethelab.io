import _ from 'lodash';
import { auth } from '../firebase/firebase.api';

const cachedUser = {};

export default {
  add(uid, user) {
    cachedUser[uid] = user;
  },
  async get(userId) {
    if (_.isNil(cachedUser[userId])) {
      const u = await auth.getUser(userId);
      this.add(userId, u);
    }
    return cachedUser[userId];
  },
};
