import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Train } from './ll-train';
import { Car } from './car';
import { TrainGraphics } from './train-graphics';


@Component({
  selector: 'app-ll-train',
  templateUrl: './ll-train.component.html',
  styleUrls: ['./ll-train.component.css']
})
export class LlTrainComponent implements AfterViewInit {

  @ViewChild("canvas") canvas;

  // class variables
  ctx:CanvasRenderingContext2D;
	canvasHt:number;
	canvasWd:number;
  gTrain:Train;
  isRunning:boolean = false;
  gTimer;

  gCarTypes = { 
    "locomotive" : {"w": 35, "h": 15}, 
		"hopper" : {"w": 25, "h": 10}, 
		"flat" : {"w": 23, "h": 4}, 
		"tank" : {"w": 25, "h": 12}, 
		"box" : {"w": 25, "h": 10},
		"caboose": {"w": 23, "h": 13}
  };

	gColors = { 
    "black" : "#000000", 
		"red" : "#ff0000", 
		"blue" : "#0000ff", 
		"green" : "#00ff00", 
		"white" : "#ffffff",
		"yellow" : "#ffff00"
  };

  
	gLocomotive;
	gCaboose;

  gMaxCarHeight:number;
  gWhistle;
  gChugChug = new Audio("steamtrain.ogg");

  gCurrPos;
  gTranslation;
  gSmoke = 0;
  gPuffs:Array<any>;
  gSmokeTrigger:number;

  // variables for cars
  carType;
  carColor;
  carLoc;

  gIsRunning:boolean;
  demoBtnLbl:string;

  ngOnViewInit() {
    this.gTrain = new Train();
    this.gLocomotive = new Car(1, this.gColors.yellow, "locomotive");
	  this.gCaboose = new Car(2, this.gColors.green, "caboose" );

    this.gMaxCarHeight = 15;
    this.gWhistle = new Audio("trainwhistle.ogg");
    this.gChugChug = new Audio("steamtrain.ogg");

    this.gCurrPos = {"x":0, "y":30};
    this.gTranslation = {"x":10, "y":0};
    this.gSmoke = 0;
    this.gSmokeTrigger = 9 - Math.floor(Math.random()*4);

    this.gIsRunning = false;
    this.demoBtnLbl = "Start Train";

    this.canvas = this.canvas.nativeElement;
    this.canvasHt = parseInt(this.canvas.getAttribute('height'), 10);
	  this.canvasWd = parseInt(this.canvas.getAttribute('width'), 10);
    this.ctx = this.canvas.getContext("2d");
    this.drawScreen();
  }

  addSounds():void {
    this.gWhistle.preload = 'auto';
    this.gWhistle.load();

    this.gChugChug.preload = 'auto';
    this.gChugChug.loop = true;
    this.gChugChug.load();
  }
	
  drawScreen():void {
    this.ctx.clearRect(0, 0, this.canvasWd, this.canvasHt);

    this.gCurrPos.x = 0;
    this.gCurrPos.y = 30;

    this.drawCar(this.ctx, this.gLocomotive, false, true);
    this.drawCars(this.ctx);
    this.drawCar(this.ctx, this.gCaboose, true, false);
    
    if (this.gCurrPos.x + this.gTranslation.x <= 0) {
      this.gCurrPos.x = 0;
      this.gTranslation.x = this.canvas.width - 1; 
    }
    
  }

  /******************** Add Car ***************************/

  addCar():void {
    var x = document.getElementById('addType').selectedIndex;
    var y = document.getElementById('addType').options;
    var type = y[x].text;
    x = document.getElementById('addColor').selectedIndex;
    y = document.getElementById('addColor').options;
    var color = y[x].text;
    x = document.getElementById('addLoc').selectedIndex;
    y = document.getElementById('addLoc').options;
    var loc = y[x].text;

    var car = new Car(++gCarId, color, type);
    this.gTrain.insert(loc, car);

    this.addPosition("addLoc", this.gTrain.size() + 1);
    this.addPosition("remLoc", this.gTrain.size());
    this.drawScreen();
  }

  /******************** Delete Car ************************/

  deleteCar():void {
    //var use = document.getElementById("arg").value;
    var success = false;
    var x = document.getElementById('remLoc');
    var value = x.options[x.selectedIndex].text;

    //if (use == "remId") {
    //	x = gTrain.get(value);
    //} else if (use == "remLoc") {
      x = this.gTrain.getAt(value);
    //}
    if (x !== null) {
      success = this.gTrain.delete(x);
    }
    if (success) {
      //buildIdMenu("remId");
      //removePosition("remId");
      this.removePosition("remLoc");
    }
    this.drawScreen();
  }

  /******************** Run Train Button ***************************/

  toggleTrainButton():void {
    if (!this.gIsRunning) {
      this.gIsRunning = true;
      this.demoBtnLbl = "Stop Train";
      this.playSound("whistle", "play");
      this.playSound("train", "play");
      this.gTimer = setInterval( function() { 
        this.runTrain(); 
      }, 100);
    } else {
      this.gIsRunning = false;
      this.demoBtnLbl = "Start Train";
      this.playSound("whistle", "pause");
      this.playSound("train", "pause");
      clearInterval(this.gTimer);
    }
  }

  runTrain():void {
    if (this.gIsRunning) {
      this.gTranslation.x -= 2;
      this.gSmoke = (this.gSmoke + 1) % 10;
      if (this.gSmoke % 5 == 0) {
        // move smoke puffs up
        for (var i = 0; i < this.gPuffs.length; i++) {
          this.gPuffs[i].y -= (3 + Math.random()*3);
          if (i == 0 && this.gPuffs[i].y < 0) {
            this.gPuffs.shift();
            i--;
          }
        }
      }
      this.drawScreen();
    }
  }

  /* Drawing functions */
  calculateY(y):number {
    return this.gCurrPos.y + this.gMaxCarHeight - y;
  }


  drawCars(context) {
    var car = this.gTrain.mHead;
    while (car !== null) {
      this.drawCar(context, car, true, true);
      car = car.mNext;
    }
  }

  drawCar(context, car, frontCoupling, backCoupling) {
    this.drawGround(context);
    if (frontCoupling) this.drawCoupling(context);

    switch (car.mType) {
      case 'locomotive':
        this.drawLocomotive(context, car.mColor);
        break;
      case 'hopper':
        this.drawHopper(context, car.mColor);
        break;
      case 'flat':
        this.drawFlat(context, car.mColor);
        break;
      case 'tank':
        this.drawTank(context, car.mColor);
        break;
      case 'box':
        this.drawBox(context, car.mColor);
        break;
      case 'caboose':
        this.drawCaboose(context, car.mColor);
        break;
      default: 
        this.drawRect(context, this.gCurrPos.x, this.calculateY(this.gCarTypes[car.mType].h), 
          this.gCarTypes[car.mType].w, this.gCarTypes[car.mType].h, 1.5, this.gColors.black, car.mColor);
    }
  
    if (car.mType != 'locomotive') this.drawWheels(context, this.gCarTypes[car.mType].w);
    this.gCurrPos.x += (this.gCarTypes[car.mType].w + 1.5);

    if (backCoupling) this.drawCoupling(context);

    for (var i = 0; i < this.gPuffs.length; i++) {
      this.drawSmokePuff(context, this.gPuffs[i].x, this.gPuffs[i].y);
    }
  }

  drawGround(context) {
    var y = this.gCurrPos.y + this.gMaxCarHeight+4;
    context.beginPath();
    this.doStroke(context, 1, this.gColors.green);
    context.moveTo(0, y);
    context.lineTo(this.canvas.width, y);
    context.lineTo(this.canvas.width, this.canvas.height);
    context.lineTo(0, this.canvas.height);
    context.lineTo(0, y);
    context.stroke();
    this.doFill(context, this.gColors.green);	
    context.closePath();

    context.beginPath();
    doStroke(context, 1.5, gColors.black);
    context.moveTo(0, y);
    context.lineTo(gCanvas.width, y);
    context.stroke();
    context.closePath();
  }

  drawCoupling(context) {
    drawRect(context, gCurrPos.x, calculateY(0), 1, 1, 1, gColors.black, gColors.black);
    gCurrPos.x += 2;
  }

  drawLocomotive(context, color) {
    var bodyH = gCarTypes.locomotive.h*0.65;
    var cabW = gCarTypes.locomotive.w*0.3;
    var cabH = gCarTypes.locomotive.h*0.9;

    // body
    context.beginPath();
    doStroke(context, 1, gColors.black);
    context.translate(gTranslation.x, gTranslation.y);

    context.moveTo(gCurrPos.x+cabW/2, calculateY(bodyH));
    context.lineTo(gCurrPos.x+cabW, calculateY(bodyH));
    context.lineTo(gCurrPos.x+cabW, calculateY(cabH));
    context.lineTo(gCurrPos.x+cabW*1.5, calculateY(cabH));
    context.lineTo(gCurrPos.x+cabW*1.5, calculateY(bodyH));
    context.lineTo(gCurrPos.x+gCarTypes.locomotive.w-cabW/2, calculateY(bodyH));
    context.lineTo(gCurrPos.x+gCarTypes.locomotive.w-cabW/2, calculateY(0));
    context.lineTo(gCurrPos.x+cabW/2, calculateY(0));
    context.lineTo(gCurrPos.x+cabW/2, calculateY(bodyH));
    
    context.stroke();
    if (color !== undefined) doFill(context, color);	
    context.translate(-gTranslation.x, -gTranslation.y);
    context.closePath();

    drawRect(context, gCurrPos.x+cabW*0.8, calculateY(gCarTypes.locomotive.h), cabW*0.9, gCarTypes.locomotive.h-cabH, 1.5, gColors.black, color);

    //cab
    drawRect(context, gCurrPos.x+gCarTypes.locomotive.w-cabW, calculateY(cabH), cabW, cabH, 1.5, gColors.black, color);
    // window
    drawRect(context, gCurrPos.x+gCarTypes.locomotive.w-(cabW*0.7), calculateY(cabH*0.85), cabW*0.4, bodyH*0.3,
      1, gColors.black, gColors.white);

    context.beginPath();
    doStroke(context, 1, gColors.black);
    context.translate(gTranslation.x, gTranslation.y);

    context.moveTo(gCurrPos.x+gCarTypes.locomotive.w-cabW-cabW*0.25, calculateY(cabH));
    context.lineTo(gCurrPos.x+gCarTypes.locomotive.w+cabW*0.4, calculateY(cabH));
    context.moveTo(gCurrPos.x, calculateY(-2));
    context.lineTo(gCurrPos.x+cabW/2,calculateY(-2));
    context.lineTo(gCurrPos.x+cabW/2, calculateY(cabW/2));
    context.lineTo(gCurrPos.x, calculateY(-2));
    
    context.stroke();
    if (color !== undefined) doFill(context, gColors.black);	
    context.translate(-gTranslation.x, -gTranslation.y);
    context.closePath();

    // front wheels
    drawArc(context, gCurrPos.x+6, calculateY(-1), 2, 0, 2 * Math.PI, false, 1, gColors.black, gColors.black);
    drawArc(context, gCurrPos.x+9, calculateY(-1), 2, 0, 2 * Math.PI, false, 1, gColors.black, gColors.black);
    
    // back wheels
    drawArc(context, gCurrPos.x+gCarTypes.locomotive.w-4, calculateY(0), 3, 0, 2 * Math.PI, false, 1, gColors.black, gColors.black);
    drawArc(context, gCurrPos.x+gCarTypes.locomotive.w-11, calculateY(0), 3, 0, 2 * Math.PI, false, 1, gColors.black, gColors.black);
    drawArc(context, gCurrPos.x+gCarTypes.locomotive.w-18, calculateY(0), 3, 0, 2 * Math.PI, false, 1, gColors.black, gColors.black);

    // add smoke puff
    if (gSmoke == gSmokeTrigger) {
      var x = gCurrPos.x+cabW*0.8 + gTranslation.x;
      var y = gCurrPos.y-6 + gTranslation.y;
      var smoke = {"x":x, "y":y};
      gPuffs.push(smoke);
      gSmokeTrigger = 9 - Math.floor(Math.random()*4)
    }
  }

  drawHopper(context, color) {
    var minY = calculateY(gCarTypes.hopper.h);
    var boxH = gCarTypes.hopper.h*0.55;
    var maxX = gCurrPos.x + gCarTypes.hopper.w;
    var chuteW = gCarTypes.hopper.w*0.25;
    var offset = chuteW*0.25;
    var midX = gCurrPos.x + (gCarTypes.hopper.w/ 2);
    
    // draw upper box
    drawRect(context, gCurrPos.x, calculateY(gCarTypes.hopper.h), gCarTypes.hopper.w, boxH, 1.5, gColors.black, color);

    // draw chute
    context.beginPath();
    doStroke(context, 1.5, gColors.black);
    context.translate(gTranslation.x, gTranslation.y);

    context.moveTo(gCurrPos.x, minY+boxH);
    context.lineTo(maxX, minY+boxH);
    context.lineTo(midX+chuteW/2, calculateY(-offset));
    context.lineTo(midX+chuteW/2-offset, calculateY(0));
    context.lineTo(midX-chuteW/2+offset, calculateY(0)); // top of car
    context.lineTo(midX-chuteW/2, calculateY(-offset));
    context.lineTo(gCurrPos.x, minY+boxH);

    context.stroke();
    if (color !== undefined) doFill(context, color);	
    context.translate(-gTranslation.x, -gTranslation.y);
    context.closePath();

    // draw supports
    context.beginPath();
    doStroke(context, 1.5, gColors.black);
    context.translate(gTranslation.x, gTranslation.y);

    context.moveTo(gCurrPos.x, minY+boxH);
    context.lineTo(gCurrPos.x, calculateY(0));
    context.moveTo(maxX, minY+boxH);
    context.lineTo(maxX, calculateY(0));

    context.stroke();
    if (color !== undefined) doFill(context, color);	
    context.translate(-gTranslation.x, -gTranslation.y);
    context.closePath();
  }

  drawFlat(context, color) {
    drawRect(context, gCurrPos.x, calculateY(gCarTypes.flat.h), gCarTypes.flat.w, gCarTypes.flat.h, 1.5, gColors.black, color);
  }

  drawTank(context, color) {
    context.beginPath();
    doStroke(context, 1.5, gColors.black);
    context.translate(gTranslation.x, gTranslation.y);

    var minY = calculateY(gCarTypes.tank.h);
    var maxX = gCurrPos.x + gCarTypes.tank.w;
    var offset = gCarTypes.tank.w*0.15;
    var capW = gCarTypes.tank.w*0.25;
    var leftX = gCurrPos.x + offset;
    var midX = gCurrPos.x + ((maxX - gCurrPos.x) / 2);
    
    context.moveTo(leftX, minY+offset);
    context.lineTo(midX-capW/2, minY+offset);
    context.lineTo(midX-capW/2, minY+offset/2);
    context.quadraticCurveTo(midX, minY, midX + capW/2, minY + offset/2);
    context.lineTo(midX+capW/2, minY+offset);
    context.lineTo(maxX-offset, minY+offset); // top of car
    context.quadraticCurveTo(maxX, minY+(gCarTypes.tank.h)/2, maxX-offset, minY+gCarTypes.tank.h);
    context.lineTo(leftX, minY+gCarTypes.tank.h);
    context.quadraticCurveTo(gCurrPos.x, minY+(gCarTypes.tank.h)/2, leftX, minY+offset);
    context.moveTo(gCurrPos.x, minY+gCarTypes.tank.h);
    context.lineTo( maxX, minY+gCarTypes.tank.h);

    context.stroke();
    if (color !== undefined) doFill(context, color);	
    context.translate(-gTranslation.x, -gTranslation.y);
    context.closePath();
  }

  drawBox(context, color) {
    var minY = calculateY(gCarTypes.box.h);
    var maxX = gCurrPos.x + gCarTypes.box.w;
    var chuteW = gCarTypes.box.w*0.2;
    var offset = chuteW*0.2;
    var midX = gCurrPos.x + (gCarTypes.box.w/ 2);
    
    context.beginPath();
    doStroke(context, 1.5, gColors.black);
    context.translate(gTranslation.x, gTranslation.y);

    context.moveTo(gCurrPos.x, minY);
    context.lineTo(maxX, minY);
    context.lineTo(maxX, calculateY(0));
    context.lineTo(midX+chuteW/2, calculateY(0));
    context.lineTo(midX+chuteW/2-offset, calculateY(-offset));
    context.lineTo(midX-chuteW/2+offset, calculateY(-offset));
    context.lineTo(midX-chuteW/2, calculateY(0));
    context.lineTo(gCurrPos.x, calculateY(0));
    context.lineTo(gCurrPos.x, minY);

    context.stroke();
    if (color !== undefined) doFill(context, color);	
    context.translate(-gTranslation.x, -gTranslation.y);
    context.closePath();
  }

  drawCaboose(context, color) {
    context.beginPath();
    doStroke(context, 1, gColors.black);
    context.translate(gTranslation.x, gTranslation.y);

    var minY = calculateY(gCarTypes.caboose.h);
    var maxX = gCurrPos.x + gCarTypes.caboose.w;
    var midX = gCurrPos.x + ((maxX - gCurrPos.x) / 2);
    var bodyH = gCarTypes.caboose.h*0.8;
    var bodyMinY = calculateY(bodyH);
    var bodyW = gCarTypes.caboose.w * 0.8;
    var capW = bodyW*0.3;
    var leftX = gCurrPos.x + ((gCarTypes.caboose.w-bodyW)/2);
    var capH = bodyMinY - minY;
    
    context.moveTo(gCurrPos.x, bodyMinY);
    context.lineTo(midX-(capW/2), bodyMinY); 
    context.lineTo(midX-(capW/2), bodyMinY-(capH*0.5));
    context.lineTo(midX-(capW/2)-(capW*0.2), bodyMinY-(capH*0.5));
    context.lineTo(midX-(capW/2)-(capW*0.2), minY);
    context.lineTo(midX+(capW/2)+(capW*0.2), minY);
    context.lineTo(midX+(capW/2)+(capW*0.2), bodyMinY-(capH*0.5));
    context.lineTo(midX+(capW/2), bodyMinY-(capH*0.5));
    context.lineTo(midX+(capW/2), bodyMinY);
    context.lineTo(maxX, bodyMinY);
    context.lineTo(maxX, bodyMinY*1.05);
    context.lineTo(leftX+bodyW, bodyMinY*1.05);
    context.lineTo(leftX+bodyW, calculateY(0)); 
    context.lineTo(leftX, calculateY(0));
    context.lineTo(leftX, bodyMinY*1.05); 
    context.lineTo(gCurrPos.x, bodyMinY*1.05);
    context.lineTo(gCurrPos.x, bodyMinY);

    context.stroke();
    if (color !== undefined) doFill(context, color);	
    context.translate(-gTranslation.x, -gTranslation.y);
    context.closePath();

    // windows
    drawRect(context, midX-capW, bodyMinY*1.08, capW/2, bodyH*0.3, 1, gColors.black, gColors.white);
    drawRect(context, midX+capW/2, bodyMinY*1.08, capW/2, bodyH*0.3, 1, gColors.black, gColors.white);

    // draw front/back poles
    context.beginPath();
    doStroke(context, 1.5, gColors.black);
    context.translate(gTranslation.x, gTranslation.y);
    context.moveTo(gCurrPos.x, bodyMinY);
    context.lineTo(gCurrPos.x, bodyMinY+bodyH);
    context.moveTo(maxX, bodyMinY);
    context.lineTo(maxX, bodyMinY+bodyH);
    context.stroke();	
    context.translate(-gTranslation.x, -gTranslation.y);
    context.closePath();

    context.beginPath();
    doStroke(context, 1, gColors.black);
    context.translate(gTranslation.x, gTranslation.y);
    context.moveTo(gCurrPos.x, bodyMinY);
    context.lineTo(leftX, bodyMinY);
    context.moveTo(maxX-((gCarTypes.caboose.w-bodyW)/2), bodyMinY);
    context.lineTo(maxX, bodyMinY);
    context.stroke();	
    context.translate(-gTranslation.x, -gTranslation.y);
    context.closePath();
  }

  drawWheels(context, width) {
    drawArc(context, gCurrPos.x + 2, calculateY(-1), 2, 0, 2 * Math.PI, false, 1, gColors.black, gColors.black);
    drawArc(context, gCurrPos.x + 6, calculateY(-1), 2, 0, 2 * Math.PI, false, 1, gColors.black, gColors.black);
    drawArc(context, gCurrPos.x + width - 6, calculateY(-1), 2, 0, 2 * Math.PI, false, 1, gColors.black, gColors.black);
    drawArc(context, gCurrPos.x + width - 2, calculateY(-1), 2, 0, 2 * Math.PI, false, 1, gColors.black, gColors.black);
  }
  
  drawSmokePuff(context, x, y) {
    context.beginPath();
    doStroke(context, 1, gColors.black);
    //context.translate(gTranslation.x, gTranslation.y);
    context.moveTo(x, y);
    context.quadraticCurveTo(x+2, y-4, x+3, y-1);
    context.quadraticCurveTo(x+4, y-5, x+8, y-1);
    context.bezierCurveTo(x+9, y+2, x+7, y+4, x+6, y+2);
    context.quadraticCurveTo(x+3, y+5, x, y+2);
    context.quadraticCurveTo(x-1, y+2, x, y);
    context.stroke();
    doFill(context, "#fcfcfc");	
    //context.translate(-gTranslation.x, -gTranslation.y);
    context.closePath();
  }

  doStroke(context, lw, strokeColor) {
    context.strokeStyle = strokeColor;
    context.lineWidth = lw;
  }

  doFill(context, style) {
    context.fillStyle = style;
    context.fill();
  }

  drawArc(context, x, y, d, startRad, endRad, cc, lw, strokeColor, fillStyle) {
    context.beginPath();
    doStroke(context, lw, strokeColor);
    context.translate(gTranslation.x, gTranslation.y);
    context.arc(x, y, d, startRad, endRad, cc);
    if (fillStyle !== undefined) doFill(context, fillStyle);	
    context.translate(-gTranslation.x, -gTranslation.y);
    context.closePath();
  }

  drawRect(context, x, y, w, h, lw, strokeColor, fillStyle) {
    context.beginPath();
    doStroke(context, lw, strokeColor);
    context.translate(gTranslation.x, gTranslation.y);
    context.rect(x, y, w, h);
    context.stroke();
    if (fillStyle !== undefined) doFill(context, fillStyle);	
    context.translate(-gTranslation.x, -gTranslation.y);
    context.closePath();
  }

}  // end class
