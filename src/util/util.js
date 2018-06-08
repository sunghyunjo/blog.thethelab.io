/* eslint-disable prefer-template,arrow-body-style */
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
};
