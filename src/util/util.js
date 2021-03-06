/* eslint-disable prefer-template,arrow-body-style */
import MarkdownIt from 'markdown-it';


const markdown = new MarkdownIt().use(require('markdown-it-highlightjs'));

export default {
  decode: (string) => {
    return decodeURIComponent(atob(string).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  },
  encode: (string) => {
    return btoa(encodeURIComponent(string).replace(/%([0-9A-F]{2})/g,
      (match, p1) => String.fromCharCode('0x' + p1)));
  },
  renderMarkdown: (md) => {
    return markdown.render(md);
  },
  timeToDate(time) {
    const date = new Date(time);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 10) {
      month = `0${month}`;
    }
    if (day < 10) {
      day = `0${day}`;
    }
    return `${year}-${month}-${day}`;
  },
  dateToTime(date) {
    return new Date(date).getTime();
  },
};
