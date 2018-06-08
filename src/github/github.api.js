import axios from 'axios';
import util from '../util/util';

const sha1 = require('sha1');

const client = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: '',
  },
});


export default {
  async setToken(token) {
    client.defaults.headers.Authorization = `token ${token}`;
  },
  async getUser() {
    const ret = await client.get('/user');
    console.log('github user', ret);
    return ret.data;
  },
  async getRepoFiles(user, repo) {
    const ret = await client.get(`/repos/${user}/${repo}/contents/`);
    return ret;
  },
  async getContent(user, repo, path) {
    const ret = await client.get(`/repos/${user}/${repo}/contents/${path}`);
    return ret;
  },
  async createRepoFile(user, repo, path, content) {
    const blob = util.encode(content);
    const ret = await client.put(`/repos/${user}/${repo}/contents/${path}`, {
      message: '',
      content: blob,
      sha: sha1(blob),
    });
    console.log(ret);
  },
  async updateRepoFile(user, repo) {
    console.log(user, repo);
  },
};
