/* eslint-disable prefer-template */
/* eslint-disable func-names */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable no-inner-declarations */
/* eslint-disable no-plusplus */
const canvas = document.querySelectorAll('.canvas-items');
const color = document.querySelectorAll('.color-static');
const pan = document.querySelector('.paint-tool');
const prevbutton = document.querySelector('.prev-color');
const curColor = document.querySelector('.current-circle');
const prevColor = document.querySelector('.prev-circle');
const trans = document.querySelector('.transform');
const move = document.querySelector('.move');
const chooseCol = document.querySelector('.choose-color');

function init(){
  pan.addEventListener('click', changeColor);
  prevbutton.addEventListener('click', ChangeCurColor);
  move.addEventListener('click', moveCanvas);
  trans.addEventListener('click', Changeform);
  chooseCol.addEventListener('click', ChooseColor);
}
// Paint bucket
function paint(e) {
  e.target.style.backgroundColor = curColor.style.backgroundColor;
  for (let i = 0; i < canvas.length; i++) {
    canvas[i].removeEventListener('click', paint);
  }
}
function changeColor(e) {
  for (let i = 0; i < canvas.length; i++) {
    canvas[i].addEventListener('click', paint);
  }
}
function ChangeCurColor(e) {
  curColor.style.backgroundColor = prevbutton.firstElementChild.style.backgroundColor;
}
for (let i = 0; i < color.length; i++) {
  color[i].addEventListener('click', addColor);
  var n = ["red", "lightblue", "lightgreen", "yellow"]
  function addColor() {
    prevColor.style.backgroundColor = curColor.style.backgroundColor;
    curColor.style.backgroundColor = n[i];
  }
}
// Move Tool
function moveCanvas(e) {
  for (let i = 0; i < canvas.length; i++) {
    canvas[i].onmousedown = function (e) {
      canvas[i].style.position = 'absolute';
      function moveAt(e) {
        canvas[i].style.left = e.pageX - canvas[i].offsetWidth / 2 + 'px';
        canvas[i].style.top = e.pageY - canvas[i].offsetHeight / 2 + 'px';
      }
      moveAt(e);
      document.body.appendChild(canvas[i]);
      canvas[i].style.zIndex = 1000;
      document.onmousemove = function (e) {
        moveAt(e);
      };
      canvas[i].onmouseup = function () {
        document.onmousemove = null;
        canvas[i].onmouseup = null;
      };
      for (let i = 0; i < canvas.length; i++) {
        canvas[i].onmousedown = null;
      }
    };
  }
}
// Transformation
function Changeform(e) {
  function transform(e) {
    e.target.style.borderRadius = '50%';
    for (let i = 0; i < canvas.length; i++) {
      canvas[i].removeEventListener('click', transform);
    }
  }
  for (let i = 0; i < canvas.length; i++) {
    canvas[i].addEventListener('click', transform);
  }
}
// Choose color
function ChooseColor(e) {
  function savecolor(e) {
    curColor.style.backgroundColor = e.target.style.backgroundColor;
    for (let i = 0; i < canvas.length; i++) {
      canvas[i].removeEventListener('click', savecolor);
    }
  }
  for (let i = 0; i < canvas.length; i++) {
    canvas[i].addEventListener('click', savecolor);
  }
}
init();