import { execute } from './request';
import {
  swipeEnd,
  handleTouchStart,
  handleTouchMove,
  mouseStart,
  mouseMove,
  makeSwipedleft,
  makeSwipedRight,
  current,
} from './events';

export const ITEMS_REQUESTED = 16;
const ytForm = document.createElement('form');
const wrapInput = document.createElement('p');
const keywordInput = document.createElement('input');
export const videoList = document.createElement('div');
const videoWrapper = document.createElement('div');
const buttonsContainer = document.createElement('div');

function init() {
  document.body.insertBefore(ytForm, document.body.firstChild);
  keywordInput.setAttribute('type', 'text');
  keywordInput.setAttribute('placeholder', 'Enter keyword');
  keywordInput.className = 'keyword-input';
  wrapInput.appendChild(keywordInput);
  ytForm.appendChild(wrapInput);
  document.body.appendChild(videoWrapper);
  videoWrapper.appendChild(videoList);
  videoWrapper.className = 'video-wrapper';
  videoList.className = 'video-container';
  videoList.setAttribute('onmousedown', 'return false');
  videoList.setAttribute('onselectstart', 'return false');
  buttonsContainer.className = 'slaider';
  document.body.appendChild(buttonsContainer);

  ytForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await execute(keywordInput.value);
  });

  document.addEventListener('touchstart', handleTouchStart, false);
  document.addEventListener('touchmove', handleTouchMove, false);
  document.addEventListener('touchend', swipeEnd, false);
  document.addEventListener('mousedown', mouseStart, false);
  document.addEventListener('mousemove', mouseMove, false);
  document.addEventListener('mouseup', swipeEnd, false);
  document.body.addEventListener('swiped-left', makeSwipedleft);
  document.body.addEventListener('swiped-right', makeSwipedRight);
}
init();

function prepareCardData(snippet, video) {
  return {
    id: video.videoId,
    title: snippet.title,
    datepub: snippet.publishedAt,
    channel: snippet.channelTitle,
    description: snippet.description,
    imageUrl: snippet.thumbnails.default.url,
  };
}

function createCard(data) {
  const wrapper = document.createElement('div');
  wrapper.className = 'wrapper';
  const img = document.createElement('img');
  img.src = data.imageUrl;
  const title = document.createElement('a');
  title.innerText = data.title;
  const channelname = document.createElement('h3');
  channelname.innerText = data.channel;
  const datapublish = document.createElement('h3');
  const now = new Date(Date.parse(data.datepub));
  const d = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  datapublish.innerText = d;
  const description = document.createElement('h4');
  description.innerText = data.description;
  title.href = `https://www.youtube.com/watch?v=${data.id}`;

  wrapper.appendChild(img);
  wrapper.appendChild(title);
  wrapper.appendChild(channelname);
  channelname.className = 'author';
  wrapper.appendChild(datapublish);
  datapublish.className = 'datapub';
  wrapper.appendChild(description);

  return wrapper;
}

export function createSlide(list) {
  while (videoList.firstChild) {
    videoList.removeChild(videoList.firstChild);
  }
  list.forEach((item) => {
    const cardData = prepareCardData(item.snippet, item.id);
    const card = createCard(cardData);
    videoList.appendChild(card);
  });
}

export function createButtons(cardperslide, listElems) {
  const buttonsCount = Math.ceil(listElems.length / cardperslide);
  while (buttonsContainer.firstChild) {
    buttonsContainer.removeChild(buttonsContainer.firstChild);
  }
  for (let index = 1; index <= buttonsCount; index += 1) {
    const button = document.createElement('input');
    button.setAttribute('type', 'radio');
    button.setAttribute('name', 'slider-item');
    button.dataset.slide = index;
    button.addEventListener('mousedown', (e) => {
      const next = +e.srcElement.getAttribute('data-slide');
      if (next > current) {
        makeSwipedleft();
      } else {
        makeSwipedRight();
      }
    });
    buttonsContainer.appendChild(button);
    const inputcheck = document.body.querySelector("input[data-slide = '1']");
    inputcheck.setAttribute('checked', 'checked');
  }
}
