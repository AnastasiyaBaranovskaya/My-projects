const ytForm = document.createElement('form');
const wrapInput = document.createElement('p');
const keywordInput = document.createElement('input');
const videoList = document.createElement('div');
const videoWrapper = document.createElement('div');
const buttonsContainer = document.createElement('div');
const width1000 = window.matchMedia("(max-width: 1000px)");
const width500 = window.matchMedia("(max-width: 500px)");
const ITEMS_REQUESTED = 16;
var width = 25;
var count = 4;
var CARDS_PER_SLIDE = 4;
var listElems = document.getElementsByClassName('wrapper');
var position = 0;
var xDown = null;
var xDiff = null;
var timeDown = null;
var startEl = null;

function init() {
    document.body.insertBefore(ytForm, document.body.firstChild);
    keywordInput.setAttribute('type', 'text');
    keywordInput.setAttribute('placeholder', "Enter keyword");
    keywordInput.className = "keyword-input";
    wrapInput.appendChild(keywordInput);
    ytForm.appendChild(wrapInput);
    document.body.appendChild(videoWrapper);
    videoWrapper.appendChild(videoList);
    videoWrapper.className = "video-wrapper";
    videoList.className = "video-container";
    videoList.setAttribute("onmousedown", "return false");
    videoList.setAttribute("onselectstart", "return false");
    buttonsContainer.className = "slaider";
    document.body.appendChild(buttonsContainer);

    function changeWidth(width1000) {
        if (width1000.matches) {
            width = 50;
            count = 2;
            CARDS_PER_SLIDE = 2;
        }
    }
    changeWidth(width1000);
    width1000.addListener(changeWidth);

    function changeWidthmob(width500) {
        if (width500.matches) {
            width = 100;
            count = 1;
            CARDS_PER_SLIDE = 1;
        }
    }
    changeWidthmob(width500);
    width500.addListener(changeWidthmob);

    ytForm.addEventListener('submit', e => {
        e.preventDefault();
        execute(keywordInput.value);
    });
    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);
    document.addEventListener('touchend', handleTouchEnd, false);
    document.addEventListener('mousedown', mouseStart, false);
    document.addEventListener('mousemove', mouseMove, false);
    document.addEventListener('mouseup', mouseEnd, false);
    document.body.addEventListener('swiped-left', makeSwipedleft);
    document.body.addEventListener('swiped-right', makeSwipedRight);
}
init();

function execute(searchQuery) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        const baseUrl = "https://www.googleapis.com/youtube/v3/search";
        const queryList = "maxResults=" + ITEMS_REQUESTED + "&part=snippet&q=" + searchQuery + "&order=rating" + "&key=AIzaSyDn2Ybd0qz5tdqoC8AU8_ucMLj3mC6XOzc";
        const url = baseUrl + "?" + queryList;

        xhr.open('GET', url, true);

        if (!xhr) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }
        xhr.onload = function () {
            const good = 200;
            if (this.status == good) {
                resolve(this.response)
                const result = this.response && JSON.parse(this.response);
                const list = result.items;
                renderButtons(CARDS_PER_SLIDE, list);
                renderSlide(list);
            } else {
                var error = new Error(this.statusText);
                error.code = this.status;
                reject(error);
            }
        };
        xhr.onerror = function () {
            reject(new Error("Network Error"));
        }
        xhr.send();
    });
}

function prepareCardData(snippet, video) {
    return {
        id: video.videoId,
        title: snippet.title,
        datepub: snippet.publishedAt,
        channel: snippet.channelTitle,
        description: snippet.description,
        imageUrl: snippet.thumbnails.default.url
    }
}

function renderCard(data) {
    const wrapper = document.createElement('div');
    wrapper.className = "wrapper";
    const img = document.createElement('img');
    img.src = data.imageUrl;
    const title = document.createElement('a');
    title.innerText = data.title;
    const channelname = document.createElement('h3');
    channelname.innerText = data.channel;
    const datapublish = document.createElement('h3');
    const now = new Date(Date.parse(data.datepub));
    const d = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
    datapublish.innerText = d;
    const description = document.createElement('h4');
    description.innerText = data.description;
    title.href = "https://www.youtube.com/watch?v=" + data.id;

    wrapper.appendChild(img);
    wrapper.appendChild(title);
    wrapper.appendChild(channelname);
    channelname.className = "author";
    wrapper.appendChild(datapublish);
    datapublish.className = "datapub";
    wrapper.appendChild(description);

    return wrapper;
}

function renderSlide(list) {
    while (videoList.firstChild) {
        videoList.removeChild(videoList.firstChild);
    }
    list.forEach(item => {
        const cardData = prepareCardData(item.snippet, item.id);
        const card = renderCard(cardData);
        videoList.appendChild(card);
    });
}

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

function mouseEnd(e) {
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

function mouseStart(e) {
    if (e.target.getAttribute('data-swipe-ignore') === 'true') return;
    startEl = e.target;
    timeDown = Date.now();
    xDown = e.clientX;
    xDiff = 0;
}

function mouseMove(e) {
    if (!xDown) return;
    var xUp = e.clientX;
    xDiff = xDown - xUp;
}

function makeSwipedleft() {
    position = Math.max(position - width * count, -width * (listElems.length - count));
    videoList.style.marginLeft = position + 'vw';
}

function makeSwipedRight() {
    position = Math.min(position + width * count, 0);
    videoList.style.marginLeft = position + 'vw';
}
var current = 1;
function renderButtons(CARDS_PER_SLIDE, listElems) {
    const buttonsCount = Math.ceil(listElems.length / CARDS_PER_SLIDE);
    while (buttonsContainer.firstChild) {
        buttonsContainer.removeChild(buttonsContainer.firstChild);
    }
    for (let index = 1; index <= buttonsCount; index++) {
        const button = document.createElement('input');
        button.setAttribute("type", "radio")
        button.setAttribute("name", "slider-item")
        button.dataset.slide = index;
        button.addEventListener('click', function(e){
           var next = + e.srcElement.getAttribute("data-slide");
            if (next > current) {
                makeSwipedleft();
                current = next;
            } else if (next < current){
                makeSwipedRight();
                current = next; 
            }
        });
        buttonsContainer.appendChild(button);
        const inputcheck = document.body.querySelector("input[data-slide = '1']");
        inputcheck.setAttribute("checked", "checked");
    }
}
