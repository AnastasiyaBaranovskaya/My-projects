(function (window, document) {
  'use strict';
  if (typeof window.CustomEvent !== 'function') {
    window.CustomEvent = function (event, params) {
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined
      };
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    };
    window.CustomEvent.prototype = window.Event.prototype;
  }

  document.addEventListener('touchstart', handleTouchStart, false);
  document.addEventListener('touchmove', handleTouchMove, false);
  document.addEventListener('touchend', handleTouchEnd, false);

  var xDown = null;
  var xDiff = null;
  var timeDown = null;
  var startEl = null;

  function handleTouchEnd(e) {
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

  function handleTouchStart(e) {
    if (e.target.getAttribute('data-swipe-ignore') === 'true') return;
    startEl = e.target;
    timeDown = Date.now();
    xDown = e.touches[0].clientX;
    xDiff = 0;
  }

  function handleTouchMove(e) {
    if (!xDown) return;
    var xUp = e.touches[0].clientX;
    xDiff = xDown - xUp;
  }
}(window, document));
var width = 25; 
var count = 4; 
const width1000 = window.matchMedia("(max-width: 1000px)");
function changeWidth(width1000) {
    if (width1000.matches) { 
        width = 45; 
        count = 2; 
    }
}
changeWidth(width1000); 
width1000.addListener(changeWidth);

var containerVideo = document.getElementsByClassName('video-container');
var listElems = document.getElementsByClassName('wrapper');

var position = 0; 

window.onload = function() {
    document.body.addEventListener('swiped-left', makeSwipedleft);
    function makeSwipedleft() {
        position = Math.max(position - width * count, -width * (listElems.length - count));
        containerVideo[0].style.marginLeft = position + 'vw';
    }
    document.body.addEventListener('swiped-right', makeSwipedRight);
    function makeSwipedRight() {
        position = Math.min(position + width * count, 0);
        containerVideo[0].style.marginLeft =  position + 'vw';
    }
}
