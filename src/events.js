var listElems = document.getElementsByClassName('wrapper');
var xDown = null;
var xDiff = null;
var timeDown = null;
var startEl = null;
var position = 0;
export var current = 1;
import {
    videoList,
    width,
    count
} from './index.js';
export function swipeEnd(e) {
    if (startEl !== e.target) return;
    var swipeThreshold = parseInt(startEl.getAttribute('data-swipe-threshold') || '20', 10);
    var swipeTimeout = parseInt(startEl.getAttribute('data-swipe-timeout') || '500', 10);
    var timeDiff = Date.now() - timeDown;
    var eventType = '';
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
            cancelable: true
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
    var xUp = e.touches[0].clientX;
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
    var xUp = e.clientX;
    xDiff = xDown - xUp;
}

function FindElement(value) {
    var All = document.body.getElementsByTagName("input");
    for (var i = 0; i < All.length; i++) {
        if (All[i].getAttribute("data-slide") == value) {
            All[i].setAttribute("checked", "checked");
        }
    }
}

function FindElementByAttr(value) {
    var All = document.body.getElementsByTagName("input");
    for (var i = 0; i < All.length; i++) {
        if (All[i].getAttribute("data-slide") == value) {
            All[i].setAttribute("checked", "checked");
        }
    }
}

export function makeSwipedleft() {
    position = Math.max(position - width * count, -width * (listElems.length - count) - 100);
    if (position == (-width * (listElems.length - count) - 100)) {
        position = (-width * (listElems.length - count));
        return false;
    } else {
        videoList.style.marginLeft = position + 'vw';
        var checkedbutton = document.querySelector('input[type="radio"]:checked');
        var n = +checkedbutton.getAttribute("data-slide");
        checkedbutton.removeAttribute("checked");
        n++;
        n = "" + n;
        current++;
        FindElement(n);
    }
}
export function makeSwipedRight() {
    position = Math.min(position + width * count, 100);
    if (position == 100) {
        position = 0;
        return false;
    } else {
        videoList.style.marginLeft = position + 'vw';
        var checkedbutton = document.querySelector('input[type="radio"]:checked');
        var n = +checkedbutton.getAttribute("data-slide");
        checkedbutton.removeAttribute("checked");
        var k = n - 1;
        k = "" + k;
        current = current - 1;
        FindElementByAttr(k);
    }
}
