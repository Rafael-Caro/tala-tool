//general variables
var talSet;
var talMenu = ["tīntāl", "ektāl"];
//tal features
var talName;
var avart;
var strokeCircles; //list of strokeCircles
//style
var radiusBig; //radius of the big circle
var radius1 = 25; //radius of accented matra
var radius2 = 20; //radius of unaccented matra
var backColor;
var mainColor;
var matraColor;
//machanism
var speed;
var tempo;
// var cursorX; //cursor line's x
// var cursorY; //cursor line's y
// var angle = -90; //angle of the cursor
var cursor;
var shade;
// var alpha;
// var position = 0;
var playing = false;
var timeDiff;
//html interaction
var slider;
var select;
var button;//sounds
var loaded = false;
var dha;
var dhin;
var ta;
var tin;
var soundDic = {};
var strokePlayPoints = [];
var strokeToPlay = 0;

function preload () {
  talSet = loadJSON("files/talSet.json");
}

function setup() {
  var canvas = createCanvas(600, 600);
  var div = createDiv()
    .id("sketch-holder")
    .style("width: " + width + "px; margin: 10px auto; position: relative;");
  // var divElem = new p5.Element(input.elt);
  // divElem.style
  canvas.parent("sketch-holder");
  ellipseMode(RADIUS);
  angleMode(DEGREES);
  //style
  radiusBig = width * (2 / 5);
  backColor = color(185, 239, 162);
  mainColor = color(249, 134, 50);
  matraColor = color(249, 175, 120);
  //html interaction
  slider = createSlider(5, 300)
    .position(10, height-30)
    .size(width-20, 20)
    .changed(updateTempo)
    .parent("sketch-holder");;
  select = createSelect()
    .size(90, 25)
    .position(10, 10)
    .changed(start)
    .parent("sketch-holder");;
  for (var i = 0; i < talMenu.length; i++) {
    select.option(talMenu[i]);
  }
  button = createButton("¡Comienza!")
    .size(90, 25)
    .position(width-100, 10)
    .mousePressed(playTal)
    .parent("sketch-holder");
    // .style("position: static;");
  //start tal
  start();
  updateTempo();
}

function draw() {
  background(backColor);
  tempo = slider.value();
  fill(0);
  noStroke();
  textAlign(LEFT, BASELINE);
  textSize(12);
  text(str(tempo)+" bpm", 10, height-30); //tempo box

  push();
  translate(width/2, height/2);
  // rotate(-90);

  // noStroke();
  // alpha = map((angle+90)%360, 0, 360, 0, 255);
  // mainColor.setAlpha(alpha);
  // fill(mainColor);
  // arc(0, 0, radiusBig, radiusBig, -90, angle%360);

  if (playing) {
    shade.update();
    shade.display();
  }

  noFill();
  strokeWeight(2);
  mainColor.setAlpha(255);
  stroke(mainColor);
  ellipse(0, 0, radiusBig, radiusBig);
  //draw circle per bol
  for (var i = 0; i < strokeCircles.length; i++) {
    strokeCircles[i].display();
  }
  textAlign(CENTER, CENTER);
  textSize(30);
  strokeWeight(5);
  stroke(0);
  fill(mainColor);
  text(talName, 0, 0);

  // position = updateCursor(position);

  //cursor
  // stroke(mainColor);
  // line(0, 0, cursorX, cursorY);
  // fill("red");
  // noStroke();
  // ellipse(cursorX, cursorY, 5, 5);
  if (playing) {
    cursor.update();
    cursor.display();
    strokePlayer(cursor.angle);
  }
}

function start() {
  //restart values
  strokeCircles = [];
  cursorX = 0;
  cursorY = -radiusBig;
  angle = -90;
  button.html("¡Comienza!");
  playing = false;

  var talSortName = select.value();
  var tal = talSet[talSortName];
  talName = tal["name"];
  avart = tal["avart"];
  var tempoInit = tal["tempoInit"];
  var theka = tal["theka"];
  for (var i = 0; i < theka.length; i++) {
    var stroke = theka[i];
    var matra = stroke["matra"];
    var vibhag; //tali or khali
    if (int(stroke["vibhag"]) > 0) {
      vibhag = "tali";
    } else {
      vibhag = "khali";
    }
    var circleType;
    if (i == 0) {
      circleType = "sam";
    } else if ((stroke["vibhag"] % 1) < 0.101) {
      circleType = 1;
    } else if ((stroke["vibhag"] * 10 % 1) == 0) {
      circleType = 2;
    } else {
      circleType = 3;
    }
    var bol = stroke["bol"];
    var strokeCircle = new StrokeCircle(matra, vibhag, circleType, bol);
    strokeCircles[i] = strokeCircle;
    if (strokeCircle.circleAngle < 0) {
      strokePlayPoints[i] = 360 + strokeCircle.circleAngle;
    } else {
      strokePlayPoints[i] = strokeCircle.circleAngle;
    }
  }
  slider.value(tempoInit);
  updateTempo();
}

function StrokeCircle (matra, vibhag, circleType, bol) {
  this.bol = bol;
  var increment = 1;
  this.strokeWeight = 2;

  if (circleType == "sam") {
    this.col = mainColor;
  } else if (vibhag == "tali") {
    this.col = matraColor;
  } else if (vibhag == "khali") {
    this.col = backColor;
  }

  if (circleType == "sam") {
    this.radius = radius1;
    this.txtStyle = BOLD;
    this.bol = this.bol.toUpperCase();
    this.volume = 1;
  } else if (circleType == 1) {
    this.radius = radius1;
    this.txtStyle = BOLD;
    this.volume = 1;
  } else if (circleType == 2){
    this.radius = radius2;
    this.txtStyle = BOLD;
    this.volume = 0.7;
  } else {
    this.radius = radius2;
    this.col = color(0, 0);
    this.txtStyle = NORMAL;
    this.strokeWeight = 0;
    this.volume = 0.7;
    increment = 1.04;
  }

  this.circleAngle = map(matra, 0, avart, -90, 270);
  this.x = radiusBig * increment * cos(this.circleAngle);
  this.y = radiusBig * increment * sin(this.circleAngle);

  this.display = function () {
    stroke(mainColor);
    strokeWeight(this.strokeWeight);
    fill(this.col);
    ellipse(this.x, this.y, this.radius, this.radius);

    textAlign(CENTER, CENTER);
    noStroke();
    fill(0);
    textSize(this.radius * 0.75);
    textStyle(this.txtStyle);
    text(this.bol, this.x, this.y);
  }

  this.clicked = function () {
    var d = dist(this.x, this.y, mouseX-width/2, mouseY-height/2);
    if (d < this.radius) {
      soundDic[this.bol].play();
    }
  }
}

function CreateCursor () {
  this.x = 0;
  this.y = -radiusBig;
  this.angle = 270;
  this.position = 0;
  this.update = function () {
    var position = millis() - timeDiff;
    var increase = position - this.position;
    this.angle += (360 * increase) / speed;
    if (this.angle > 360) {
      this.angle -= 360;
    }
    this.x = radiusBig * cos(this.angle);
    this.y = radiusBig * sin(this.angle);
    this.position = position;
  }
  this.display = function () {
    fill("red");
    noStroke();
    ellipse(this.x, this.y, 5, 5)
  }
}

function CreateShade () {
  this.x = 0;
  this.y = -radiusBig;
  this.angle = 270;
  this.position = 0;
  this.alpha = 0;
  this.col = mainColor;
  this.update = function () {
    var position = millis() - timeDiff;
    var increase = position - this.position;
    this.angle += (360 * increase) / speed;
    if (this.angle > 360) {
      this.angle -= 360;
    }
    var alphaAngle = this.angle + 90;
    if (alphaAngle > 360) {
      alphaAngle -= 360;
    }
    this.alpha = map(alphaAngle, 0, 360, 0, 255);
    this.x = radiusBig * cos(this.angle);
    this.y = radiusBig * sin(this.angle);
    this.position = position;
  }
  this.display = function () {
    this.col.setAlpha(this.alpha);
    fill(this.col);
    noStroke();
    arc(0, 0, radiusBig, radiusBig, 270, this.angle);
  }
}

function strokePlayer (angle) {
  var checkPoint = strokePlayPoints[strokeToPlay];
  if (checkPoint == 0) {
    checkPoint = strokePlayPoints[strokeToPlay - 1];
    if (angle < checkPoint) {
      var sC = strokeCircles[strokeToPlay];
      var sound = soundDic[sC.bol];
      sound.setVolume(sC.volume);
      sound.play();
      strokeToPlay++;
    }
  } else {
    if (angle >= checkPoint) {
      var sC = strokeCircles[strokeToPlay];
      var sound = soundDic[sC.bol.toLowerCase()];
      sound.setVolume(sC.volume);
      sound.play();
      strokeToPlay++;
    }
  }
  print(strokeToPlay, angle);
  if (strokeToPlay == strokePlayPoints.length) {
    strokeToPlay = 0;
  }
}

function updateTempo () {
  tempo = slider.value();
  speed = avart * (60 / tempo) * 1000;
}

function playTal() {
  if (playing == false) {
    timeDiff = millis();
    cursor = new CreateCursor();
    shade = new CreateShade();
    playing = true;
    button.html("Para");
    strokeToPlay = 0;
    strokePlayer(-90);
  } else {
    playing = false;
    button.html("¡Comienza!");
  }
}

function mousePressed() {
  if (loaded == false) {
    var a = millis();
    dha = loadSound("sounds/dha.wav");
    soundDic["dha"] = dha;
    dhin = loadSound("sounds/dhin.wav");
    soundDic["dhin"] = dhin;
    ge = loadSound("sounds/ga.wav");
    soundDic["ge"] = ge;
    kat = loadSound("sounds/kat.wav");
    soundDic["kat"] = kat;
    ki = loadSound("sounds/ka.wav");
    soundDic["ki"] = ki;
    na = loadSound("sounds/na.wav");
    soundDic["na"] = na;
    ra = loadSound("sounds/re.wav");
    soundDic["ra"] = ra;
    ta = loadSound("sounds/na.wav");
    soundDic["ta"] = ta;
    ti = loadSound("sounds/te.wav");
    soundDic["te"] = ti;
    soundDic["ti"] = ti;
    tin = loadSound("sounds/tin.wav");
    soundDic["tin"] = tin;
    tun = loadSound("sounds/tun.wav");
    soundDic["tun"] = tun;
    print((millis() - a)/1000);
    loaded = true;
  }
  if (playing == false) {
    for (var i = 0; i < strokeCircles.length; i++) {
      strokeCircles[i].clicked();
    }
  }
}
