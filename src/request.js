import {
  ITEMS_REQUESTED, CARDS_PER_SLIDE, renderSlide, renderButtons,
} from './index';

export function execute(searchQuery) {
  return new Promise(((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const baseUrl = 'https://www.googleapis.com/youtube/v3/search';
    const queryList = `maxResults=${ITEMS_REQUESTED}&part=snippet&q=${searchQuery}&order=rating` + '&key=AIzaSyDn2Ybd0qz5tdqoC8AU8_ucMLj3mC6XOzc';
    const url = `${baseUrl}?${queryList}`;
    xhr.open('GET', url, true);
    if (!xhr) {
      return 'Giving up :( Cannot create an XMLHTTP instance';
    }
    xhr.onload = function () {
      const good = 200;
      if (this.status === good) {
        resolve(this.response);
        const result = this.response && JSON.parse(this.response);
        const list = result.items;
        renderButtons(CARDS_PER_SLIDE, list);
        renderSlide(list);
      } else {
        const error = new Error(this.statusText);
        error.code = this.status;
        reject(error);
      }
    };
    xhr.onerror = function () {
      reject(new Error('Network Error'));
    };
    xhr.send();
  }));
}
