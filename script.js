const ytForm = document.getElementById('yt-form');
const keywordInput = document.getElementById('keyword-input');
const videoList = document.getElementById('videoListContainer');
var pageToken = '';
 
ytForm.addEventListener('submit', e => {
    e.preventDefault();
    execute();
});
function loadClient() {
    gapi.client.setApiKey("AIzaSyDn2Ybd0qz5tdqoC8AU8_ucMLj3mC6XOzc");
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
    .then(function() { console.log("GAPI client loaded for API"); },
    function(err) { console.error("Error loading GAPI client for API", err); });
}
// Make sure the client is loaded before calling this method//
function execute() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=Ks-_Mh1QhMc&key=AIzaSyDn2Ybd0qz5tdqoC8AU8_ucMLj3mC6XOzc', true);
   
    if (!xhr) {
        alert('Giving up :( Cannot create an XMLHTTP instance');
        return false;
    }
    xhr.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            const searchString = keywordInput.value;
            var list = gapi.client.youtube.search.list({
                "part": "snippet",
                "type": "video",
                "maxResults": 15,
                "q": searchString
            })
            for(var i in list) {
                if(list[i].title != undefined && list[i].id != undefined) {
                    var newElement = document.createElement('li');
                    newElement.innerHTML = '<li>'+ list[i].title +'('+ list[i].id +')</li>';
                    videoList.appendChild(newElement);
                }
            }
        }
    };
    xhr.onerror = function() {
        alert( 'Ошибка ' + this.status );
    }
    xhr.send();
}
gapi.load("client");

/*.then(function(response) {
    // Handle the results here (response.result has the parsed body).
    const listItems = response.result.items;
    if (listItems) {
        listItems.forEach(item => {
            const videoId = item.id.videoId;
            const videoTitle = item.snippet.title;
            var output += '<li>${videoTitle} (${videoId})</li>';
        });
        output += '</ul>';

        if (response.result.prevPageToken) {
            output += '<br><a class="paginate" href="#" data-id="${response.result.prevPageToken}" onclick="paginate(event, this)">Prev</a>';
        }
        if (response.result.nextPageToken) {
            output += '<a href="#" class="paginate" data-id="${response.result.nextPageToken}" onclick="paginate(event, this">Next</a>';
        }
        // Output list
        videoList.innerHTML = output;
    }
} */
