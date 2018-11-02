var micio;
var mic;
var vol;

var sfondo;
var ground;
var titolo;

var typeCodes = ['A', 'B', 'C', 'D'];
var quadroA, quadroB, quadroC, quadroD;
var obstacleArray = [];
var minObstacleDist = 500;
var floorLine;
var img;
var imgTop;
var playerCurrentX=200;
var playerCurrentY;
var pause=false;
var punteggio=0;
var gameover=false;

function preload() {
  micio = loadImage('./assets/urlo.png');
  sfondo = loadImage('./assets/sfondo.jpg');
  ground = loadImage('./assets/prato.png');
  titolo = loadImage('./assets/titolo.png');

  quadroA = loadImage('./assets/quadro1.png');
  quadroB = loadImage('./assets/quadro2.png');
  quadroC = loadImage('./assets/quadro3.png');
  quadroD1 = loadImage('./assets/quadro4a.png');
  quadroD2 = loadImage('./assets/quadro4b.png');
}

function setup(){
  createCanvas(windowWidth, windowHeight);
  floorLine=height*0.9;
  playerCurrentY=floorLine-micio.height;

  for(var i=0; i<10; i++){
    var indice = floor(random(0, typeCodes.length-0.1));
    var o = new obstacle(typeCodes[indice]);
    //var o = new obstacle(typeCodes[floor(random(0, typeCodes.lenght-0.1))]);
    obstacleArray.push(o);
  }

  munch = new player();

  mic = new p5.AudioIn();
  mic.start();
}

function draw(){
  if(!gameover){
    vol = mic.getLevel();

    image(sfondo, 0, 0);
    image(ground, 0, height-ground.height);
    image(titolo, (width-titolo.width)-50, 50);

    fill('black');
    textSize(30);
    textStyle(BOLD);
    textFont('Rubik');
    text('Scream to jump and avoid the paintings', width/2, 700);
    textAlign(CENTER);

    munch.display();

    for(var i=0; i<obstacleArray.length-1; i++){
      obstacleArray[i].display();
      if(!pause){
        obstacleArray[i].move();
        obstacleArray[i].checkCollision();
      }
      if(obstacleArray[i].x>=(width-(minObstacleDist+img.width))) {
        break;
      }
    }

    /*if(frameCount%2==0){ //ogni 2 frame
    obstacleArray[0].move();
  }*/

  textSize(60);
  text(punteggio, 100, 100);

}else{
  gameover=true;
}
}

function player() {
  this.y=floorLine-micio.height;
  this.x=playerCurrentX;

  this.display = function(){

    if(!pause){
      var currentHeight=floorLine-micio.height;
      this.y=currentHeight;
      playerCurrentY=this.y;
      if(vol>0.02) {
        if(vol<0.15){
          currentHeight-=vol*2500;
        }else{
          currentHeight-=floorLine-micio.height;
        }
        this.y=currentHeight;
        playerCurrentY=this.y; //salvo nella variabile globaler playerCurrentY il valore attuale della y
      }
    }else{
      currentHeight=playerCurrentY; //prendo dalla variabile globale l'ultimo valore della y
    }
    image(micio, playerCurrentX, currentHeight);
  }
}

function obstacle(typeCode) {
  this.type = typeCode; //typeCode è un valore di A, B o C
  this.x = width;
  this.y = floorLine;
  this.speed = random(5,10);
  this.yTop = 20;

  this.display = function() {

    if(this.type=='A'){
      img=quadroA;
      imgTop=undefined;
      this.y=floorLine-quadroA.height;
      image(img, this.x, this.y);
    }else if (this.type=='B') {
      img=quadroB;
      imgTop=undefined;
      this.y=floorLine-quadroB.height;
      image(img, this.x, this.y);
    }else if (this.type=='C') {
      img=quadroC;
      imgTop=undefined;
      this.y=50;
      image(img, this.x, this.y);
    }else if(this.type=='D'){
      img=quadroD1;
      imgTop=quadroD2;
      image(img, this.x, this.y-quadroD1.height);
      image(imgTop, this.x, this.yTop);
    }

    if(this.x<=(-img.width)){
      removeObstacle();
      insertNewObstacle();
    }
  }

  this.move = function() {
    this.x-=this.speed;
  }

  this.checkCollision = function() {

    if(imgTop==undefined){
      if((playerCurrentX+micio.width<this.x||
        playerCurrentX>this.x+img.width||
        playerCurrentY+micio.height<this.y||
        playerCurrentY>this.y+img.height
      )
    ){
      //no collision
    }else{
      textAlign(CENTER);
      textSize(90);
      text('Click to restart', width/2, height/2);
      gameover=true;
      pause=true;
    }
  } else {
    if((playerCurrentX+micio.width<this.x||
      playerCurrentX>this.x+img.width||
      playerCurrentY+micio.height<this.y||
      playerCurrentY>this.y+img.height
    ) && (playerCurrentX+micio.width<this.x||
      playerCurrentX>this.x+imgTop.width||
      playerCurrentY+micio.height<this.yTop||
      playerCurrentY>this.yTop+imgTop.height
    )
  ){
    //no collision
  }else{
    textAlign(CENTER);
    textSize(90);
    text('Click to restart', width/2, height/2);
    gameover=true;
    pause=true;
  }
}
}
}

function removeObstacle() {
  console.log('cancello');
  obstacleArray.shift();
  punteggio++;
}

function insertNewObstacle() {
  console.log('aggiungo');
  var indice = floor(random(0, typeCodes.length-0.1));
  var o = new obstacle(typeCodes[indice]);
  obstacleArray.push(o);
}

function mouseClicked() {
  if(gameover){
    location.reload()}
  }
