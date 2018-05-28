/* eslint-disable no-underscore-dangle */
import * as firebase from 'firebase';
import config from './keys/firebase.key';

require('firebase/firestore');


export default !firebase.apps.length ?
  firebase.initializeApp(config).firebase_ : firebase.app().firebase_;
