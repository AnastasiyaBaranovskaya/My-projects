const ytForm = document.createElement('form');
const wrapInput = document.createElement('p');
const keywordInput = document.createElement('input');
const buttonsContainer = document.createElement('div');
const videoList = document.createElement('div');
const ITEMS_REQUESTED = 16;
var CARDS_PER_SLIDE = 4;
const width1200 = window.matchMedia("(max-width: 1200px)");
const width500 = window.matchMedia("(max-width: 500px)");
function init(){
    document.body.insertBefore(ytForm, document.body.firstChild);
    keywordInput.setAttribute('type', 'text');
    keywordInput.setAttribute('placeholder', "Enter keyword");
    keywordInput.className = "keyword-input";
    wrapInput.appendChild(keywordInput);
    ytForm.appendChild(wrapInput);
    document.body.appendChild(videoList);
    videoList.className = "video-container";
    document.body.appendChild(buttonsContainer);
    buttonsContainer.className = "slaider";

    function changeWidth(width1200) {
        if (width1200.matches) { 
            CARDS_PER_SLIDE = 2;
        }
    }
    changeWidth(width1200); 
    width1200.addListener(changeWidth);

    function changeWidthmobile(width500) {
        if (width500.matches) { 
            CARDS_PER_SLIDE = 1;
        } 
    }
    changeWidthmobile(width500); 
    width500.addListener(changeWidthmobile);

    ytForm.addEventListener('submit', e => {
        e.preventDefault();
        execute(keywordInput.value);
    });
}
init();
function execute(searchQuery) {
    return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    const baseUrl = "https://www.googleapis.com/youtube/v3/search";
    const queryList = "maxResults=" + ITEMS_REQUESTED + "&part=snippet&q=" + searchQuery + "&order=rating" + "&key=AIzaSyDn2Ybd0qz5tdqoC8AU8_ucMLj3mC6XOzc";
    const url = baseUrl + "?" + queryList;

    xhr.open('GET', url, true);
   
    if (!xhr) {
        alert('Giving up :( Cannot create an XMLHTTP instance');
        return false;
    }
    xhr.onload = function(){
        if (this.status == 200) {
            resolve(this.response)
            const result = this.response && JSON.parse(this.response);
            const list = result.items;
            renderButtons(CARDS_PER_SLIDE, list);
            renderSlide(0, CARDS_PER_SLIDE, list);
        } else{
            var error = new Error(this.statusText);
            error.code = this.status;
            reject(error); 
        }      
    };
    xhr.onerror = function() {
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
    const d = now.getFullYear() + "-" +(now.getMonth()+1) + "-" + now.getDate();
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
function renderSlide(position, CARDS_PER_SLIDE, list) {
    while (videoList.firstChild){
    videoList.removeChild(videoList.firstChild);
    }
    const offset = position * CARDS_PER_SLIDE;   
    const newList = list.slice(offset, offset + CARDS_PER_SLIDE); 

    newList.forEach(function(item) {
        const cardData = prepareCardData(item.snippet, item.id);
        const card = renderCard(cardData);
        videoList.appendChild(card);
    })
}
renderSlide();
function renderButtons(CARDS_PER_SLIDE, list) {
    const buttonsCount = Math.ceil(list.length / CARDS_PER_SLIDE);
    while (buttonsContainer.firstChild){
        buttonsContainer.removeChild(buttonsContainer.firstChild);
    }
    for(let index = 1; index < buttonsCount; index++) {
        const button = document.createElement('button');
        button.dataset.slide = index;
        button.innerText = index;
        button.addEventListener('click', function() {
            renderSlide(index-1, CARDS_PER_SLIDE, list);
        })
        buttonsContainer.appendChild(button);
    }
}
