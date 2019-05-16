import { videoList, width, count } from './index';

export let current = 1;
const listElems = document.getElementsByClassName('wrapper');
let xDown = null;
let xDiff = null;
let timeDown = null;
let startEl = null;
let position = 0;
export function swipeEnd(e) {
  if (startEl !== e.target) return;
  const swipeThreshold = parseInt(startEl.getAttribute('data-swipe-threshold') || '20', 10);
  const swipeTimeout = parseInt(startEl.getAttribute('data-swipe-timeout') || '500', 10);
  const timeDiff = Date.now() - timeDown;
  let eventType = '';
  if (Math.abs(xDiff) > swipeThreshold && timeDiff < swipeTimeout) {
    if (xDiff > 0) {
      eventType = 'swiped-left';
    } else {
      eventType = 'swiped-right';
    }
  }
  if (eventType !== '') {
    startEl.dispatchEvent(new CustomEvent(eventType, {
      bubbles: true,
      cancelable: true,
    }));
  }
  xDown = null;
  timeDown = null;
}

export function handleTouchStart(e) {
  if (e.target.getAttribute('data-swipe-ignore') === 'true') return;
  startEl = e.target;
  timeDown = Date.now();
  xDown = e.touches[0].clientX;
  xDiff = 0;
}

export function handleTouchMove(e) {
  if (!xDown) return;
  const xUp = e.touches[0].clientX;
  xDiff = xDown - xUp;
}

export function mouseStart(e) {
  if (e.target.getAttribute('data-swipe-ignore') === 'true') return;
  startEl = e.target;
  timeDown = Date.now();
  xDown = e.clientX;
  xDiff = 0;
}

export function mouseMove(e) {
  if (!xDown) return;
  const xUp = e.clientX;
  xDiff = xDown - xUp;
}

function FindElement(value) {
  const All = document.body.getElementsByTagName('input');
  for (let i = 0; i < All.length; i += 1) {
    if (All[i].getAttribute('data-slide') === value) {
      All[i].setAttribute('checked', 'checked');
    }
  }
}

function FindElementByAttr(value) {
  const All = document.body.getElementsByTagName('input');
  for (let i = 0; i < All.length; i += 1) {
    if (All[i].getAttribute('data-slide') === value) {
      All[i].setAttribute('checked', 'checked');
    }
  }
}

export function makeSwipedleft() {
  position = Math.max(position - width * count, -width * (listElems.length - count) - 100);
  if (position === (-width * (listElems.length - count) - 100)) {
    position = (-width * (listElems.length - count));
    return false;
  }
  videoList.style.marginLeft = `${position}vw`;
  const checkedbutton = document.querySelector('input[type="radio"]:checked');
  let n = +checkedbutton.getAttribute('data-slide');
  checkedbutton.removeAttribute('checked');
  n += 1;
  n = `${n}`;
  current += 1;
  FindElement(n);
  return true;
}
export function makeSwipedRight() {
  position = Math.min(position + width * count, 100);
  if (position === 100) {
    position = 0;
    return false;
  }
  videoList.style.marginLeft = `${position}vw`;
  const checkedbutton = document.querySelector('input[type="radio"]:checked');
  const n = +checkedbutton.getAttribute('data-slide');
  checkedbutton.removeAttribute('checked');
  let k = n - 1;
  k = `${k}`;
  current -= 1;
  FindElementByAttr(k);
  return true;
}
