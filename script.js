const ytForm = document.createElement('form');
document.body.insertBefore(ytForm, document.body.firstChild);
const p = document.createElement('p');
const keywordInput = document.createElement('input');
keywordInput.setAttribute('type', 'text');
keywordInput.setAttribute('placeholder', "Enter keyword");
keywordInput.className = "keyword-input";
p.appendChild(keywordInput);
ytForm.appendChild(p);
const videoList = document.createElement('div');
const buttonsContainer = document.createElement('div');
document.body.appendChild(videoList);
videoList.className = "video-container";
document.body.appendChild(buttonsContainer);
buttonsContainer.className = "slaider";
const ITEMS_REQUESTED = 26;
const CARDS_PER_SLIDE = 4;
 
ytForm.addEventListener('submit', e => {
    e.preventDefault();
    execute(keywordInput.value);
});

function execute(searchQuery) {
    var xhr = new XMLHttpRequest();
    const baseUrl = "https://www.googleapis.com/youtube/v3/search";
    const queryList = "maxResults=" + ITEMS_REQUESTED + "&part=snippet&q=" + searchQuery + "&key=AIzaSyDn2Ybd0qz5tdqoC8AU8_ucMLj3mC6XOzc";
    const url = baseUrl + "?" + queryList;

    xhr.open('GET', url, true);
   
    if (!xhr) {
        alert('Giving up :( Cannot create an XMLHTTP instance');
        return false;
    }
    xhr.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            const result = this.response && JSON.parse(this.response);
            const list = result.items;
            for(var i in list) {
                if(list[i].snippet && list[i].id && list[i].id.videoId) {
                    console.log(list[i]);
                } else {
                    console.warn(list[i])
                }
            }
            renderButtons(CARDS_PER_SLIDE, list);
            renderSlide(0, CARDS_PER_SLIDE, list);
        }
    };
    xhr.onerror = function() {
        alert( 'Ошибка ' + this.status );
    }
    xhr.send();
}
function prepareCardData(snippet, video) {
    return {
        id: video.videoId,
        title: snippet.title,
        datepub: snippet.publishedAt,
        channel: snippet.channelTitle,
        description: snippet.description,
        publicationDate: snippet.publishedAt,
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
    datapublish.innerText = data.datepub;
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
function renderSlide(position, itemsPerSlide, list) {
    videoList.innerHTML = "";

    const offset = position * itemsPerSlide;   
    const newList = list.slice(offset, offset + itemsPerSlide); 

    newList.forEach(function(item) {
        const cardData = prepareCardData(item.snippet, item.id);
        const card = renderCard(cardData);
        videoList.appendChild(card);
    })
}

function renderButtons(itemsPerSlide, list) {
    const buttonsCount = Math.ceil(list.length / itemsPerSlide);
    buttonsContainer.innerHTML = "";
    for(let index = 1; index < buttonsCount; index++) {
        const button = document.createElement('button');
        button.dataset.slide = index;
        button.innerText = index;
        button.addEventListener('click', function(e) {
            renderSlide(index-1, itemsPerSlide, list);
        })
        buttonsContainer.appendChild(button);
    }
}

