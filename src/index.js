export const ITEMS_REQUESTED = 16;
export var CARDS_PER_SLIDE = 4;
import {
    execute
} from './request.js';
import {
    swipeEnd,
    handleTouchStart,
    handleTouchMove,
    mouseStart,
    mouseMove,
    makeSwipedleft,
    makeSwipedRight,
    current
} from './events.js';

const ytForm = document.createElement('form');
const wrapInput = document.createElement('p');
const keywordInput = document.createElement('input');
export const videoList = document.createElement('div');
const videoWrapper = document.createElement('div');
const buttonsContainer = document.createElement('div');
const width1000 = window.matchMedia("(max-width: 1000px)");
const width500 = window.matchMedia("(max-width: 500px)");
export var width = 25;
export var count = 4;

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

    ytForm.addEventListener('submit', async e => {
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

export function renderSlide(list) {
    while (videoList.firstChild) {
        videoList.removeChild(videoList.firstChild);
    }
    list.forEach(item => {
        const cardData = prepareCardData(item.snippet, item.id);
        const card = renderCard(cardData);
        videoList.appendChild(card);
    });
}

export function renderButtons(CARDS_PER_SLIDE, listElems) {
    const buttonsCount = Math.ceil(listElems.length / CARDS_PER_SLIDE);
    while (buttonsContainer.firstChild) {
        buttonsContainer.removeChild(buttonsContainer.firstChild);
    }
    for (let index = 1; index <= buttonsCount; index++) {
        const button = document.createElement('input');
        button.setAttribute("type", "radio")
        button.setAttribute("name", "slider-item")
        button.dataset.slide = index;
        button.addEventListener('mousedown', function (e) {
            var next = +e.srcElement.getAttribute("data-slide");
            if (next > current) {
                makeSwipedleft();
            } else if (next < current) {
                makeSwipedRight();
            }
        });
        buttonsContainer.appendChild(button);
        const inputcheck = document.body.querySelector("input[data-slide = '1']");
        inputcheck.setAttribute("checked", "checked");
    }
}
