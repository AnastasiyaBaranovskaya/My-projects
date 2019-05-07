const ytForm = document.getElementById('yt-form');
const keywordInput = document.getElementById('keyword-input');
const videoList = document.getElementById('videoListContainer');
const buttonsContainer = document.getElementById('buttonsContainer');

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
           // var newElement = document.createElement('ul');
            //let toRender = "";
            for(var i in list) {
                if(list[i].snippet && list[i].id && list[i].id.videoId) {
                    console.log(list[i]);
                    //toRender += '<li>'+ list[i].snippet.title +'('+ list[i].id.videoId +')</li>';
                } else {
                    console.warn(list[i])
                }
            }
            //newElement.innerHTML = toRender;
            //videoList.appendChild(newElement);
            
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
        description: snippet.description,
        publicationDate: snippet.publishedAt,
        imageUrl: snippet.thumbnails.default.url
    }
}
function renderCard(data) {
    const wrapper = document.createElement('div');
    const img = document.createElement('img');
    img.src = data.imageUrl;
    const title = document.createElement('h3');
    title.innerText = data.title;
    const description = document.createElement('a');
    description.innerText = data.description;
    description.href = "https://www.youtube.com/watch?v=" + data.id;

    wrapper.appendChild(img);
    wrapper.appendChild(title)
    wrapper.appendChild(description)

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
    for(let index = 0; index < buttonsCount; index++) {
        const button = document.createElement('button');
        button.dataset.slide = index;
        button.innerText = "Slide " + index;
        button.addEventListener('click', function(e) {
            renderSlide(index, itemsPerSlide, list);
        })
        buttonsContainer.appendChild(button);
    }
}

