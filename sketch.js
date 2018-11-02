var micio;
var barrel;
var mic;
var vol;
var sfondo;

function preload() {

}

function setup(){
    createCanvas(windowWidth, windowHeight);
    micio = loadImage('./assets/urlo.png');
    sfondo = loadImage('./assets/sfondo.jpg');

    barrel = new obstacle();
    cat = new player();

    mic = new p5.AudioIn();
    mic.start();

}

function draw(){
  //background('pink');
  image(sfondo, 0, 0);

  barrel.display();
  cat.display();

  vol = mic.getLevel();
  text(vol, 100, 200);
}

function player() {
  this.display = function(){
  console.log(vol);

  var currentHeight=height/2;
  if(vol>0.02) {
  currentHeight-=vol*2500;
  }
image(micio, 200, currentHeight);


  }
}

function obstacle() {
  this.move = function() {
  }
  this.display = function() {
    fill('blue');
    rect(-frameCount+width, 500, 100, 100);
  }
}

function volume() {

}
