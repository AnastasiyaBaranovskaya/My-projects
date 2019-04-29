const canvas = document.querySelectorAll(".canvas-items");
var red = document.querySelector(".red-color");
var blue = document.querySelector(".blue-color");
const pan = document.querySelector(".paint-tool");
var curColor = document.querySelector(".current-circle");
var prevColor = document.querySelector(".prev-circle");
const trans = document.querySelector(".transform");
const move = document.querySelector(".move");
const chooseCol = document.querySelector(".choose-color");

pan.addEventListener('click', changeColor);

function changeColor(e){
red.addEventListener('click', color_red);

function color_red(e){
    prevColor.style.backgroundColor  = curColor.style.backgroundColor ;
    curColor.style.backgroundColor = 'red';
for (let i=0; i < canvas.length; i++){
    canvas[i].addEventListener('click', paint);
}
function paint(e){
    e.target.style.backgroundColor = 'red';
    for (let i=0; i < canvas.length; i++){
      canvas[i].removeEventListener('click', paint);
  }
}
}

blue.addEventListener('click', color_blue);

function color_blue(e){
    prevColor.style.backgroundColor  = curColor.style.backgroundColor ;
    curColor.style.backgroundColor = 'blue';
for (let i=0; i < canvas.length; i++){
    canvas[i].addEventListener('click', paint);
}

function paint(e){
    e.target.style.backgroundColor = 'blue';
    for (let i=0; i < canvas.length; i++){
      canvas[i].removeEventListener('click', paint);
  }
}
}
}
move.addEventListener('click', moveCanvas);
function moveCanvas(e){
for (let i=0; i < canvas.length; i++){
canvas[i].onmousedown = function(e) { 
    canvas[i].style.position = 'absolute';
    moveAt(e);
    document.body.appendChild(canvas[i]);
  
    canvas[i].style.zIndex = 1000;

    function moveAt(e) {
      canvas[i].style.left = e.pageX - canvas[i].offsetWidth / 2 + 'px';
      canvas[i].style.top = e.pageY - canvas[i].offsetHeight / 2 + 'px';
    }

    document.onmousemove = function(e) {
      moveAt(e);
    }
    canvas[i].onmouseup = function() {
      document.onmousemove = null;
      canvas[i].onmouseup = null;
    }
    for (let i=0; i < canvas.length; i++){
    canvas[i].onmousedown = null;

    }
  }
}
}

trans.addEventListener('click', Changeform);
function Changeform(e){
for (let i=0; i < canvas.length; i++){
    canvas[i].addEventListener('click', transorm);
}
function transorm(e){
    e.target.style.borderRadius = '50%';
    for (let i=0; i < canvas.length; i++){
      canvas[i].removeEventListener('click', transorm);
  }
}
}
chooseCol.addEventListener('click', ChooseColor);
function ChooseColor(e){
  for (let i=0; i < canvas.length; i++){
    canvas[i].addEventListener('click', savecolor);
  }
  function savecolor(e){
    curColor.style.backgroundColor = e.target.style.backgroundColor;
    for (let i=0; i < canvas.length; i++){
      canvas[i].removeEventListener('click', savecolor);
    }
}
}
