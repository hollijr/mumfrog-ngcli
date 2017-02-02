import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Gauge } from './gauge';

@Component({
  selector: 'app-gauge',
  templateUrl: './gauge.component.html',
  styleUrls: ['./gauge.component.css']
})
export class GaugeComponent implements AfterViewInit {

  @ViewChild("gaugeCanvas") gaugeCanvas;
  @ViewChild("sliderCanvas") sliderCanvas;

  // class variables
  ctx:CanvasRenderingContext2D;
	canvasHt:number;
	canvasWd:number;
	sliderX:number = 30;
	maxSteps:number;
  sliderHeight:number;
  sliderY:number;
  handleY:number;
  pxInterval:number; // handleY is current location of slider handle
	handleHalfWd:number = 12;
  handleHalfHt:number = 2;  
	mousedown:boolean = false;
  sliderCtrlValue:number = 0;
  gaugeSettings = {
    inputGranularity : 1,
    titleLine1 : "ACCUMULATOR",
    titleLine2 : "PRESSURE",
    titleFont : "18pt Arial",
    gaugeDiam : 175,
    rimWidth : 25,
    faceColor : "#ffffff",
    centerX : 200,
    centerY : 250,
    startDegree : 135,
    endDegree : 405,
    outerScaleDiam : 100,
    outerScaleRange : {s: 0, e: 6000},
    outerScaleIntervals : [500,100,0],  // not using third interval at present
    outerScaleFnt : "8pt Calibri",
    outerScaleColor : "#000000",
    outerScaleUnit : "PSI",
    hasInnerScale : true,
    innerScaleConvFactor : 0.068573,
    innerScaleDiam : 96,
    innerScaleMin : 0,
    innerScaleIntervals : [50,10,0],
    innerScaleFnt : "8pt Arial",
    innerScaleColor : "#ff0000",
    innerScaleUnit : "Kg/cm3",
    innerScaleToEnd : true,
    dialBaseDiam : 25,
    pointerColor: "#0000ff",
    digWd : 60,
    digHt : 14,
    digFnt : "12pt Calibri",
    digBC : "#efefef"
  };
  gauge:Gauge;
  // simulation variables
  isRunning:boolean = false;
  inputLevels = {curr : this.gaugeSettings.outerScaleRange.s, targ: this.calcTarget()};
	delay:number = Math.round(Math.random()*20);
  timeoutLen:number = 500;
	timer;
  tick:number = 0;
  demoBtnLbl:string = "Start Simulation";
  demoStatusLbl:string = "";

  ngAfterViewInit() {

    // Build the gauge
    this.gaugeCanvas = this.gaugeCanvas.nativeElement;
    this.gauge = new Gauge(this.gaugeCanvas, this.gaugeSettings);
    this.gauge.drawScreen();
      
    // Build the slider so user can simulate input
    this.sliderCanvas = this.sliderCanvas.nativeElement;
    this.canvasHt = parseInt(this.sliderCanvas.getAttribute('height'), 10);
	  this.canvasWd = parseInt(this.sliderCanvas.getAttribute('width'), 10);
    this.ctx = this.sliderCanvas.getContext("2d");
		this.setSliderValues();
    this.drawSlider();

		window.addEventListener('mouseup', (evt) => {
			this.mousedown = false;
		});
  }

  resetSettings():void {
    this.gaugeSettings.inputGranularity = 1;
    this.gaugeSettings.titleLine1 = "ACCUMULATOR";
    this.gaugeSettings.titleLine2 = "PRESSURE";
    this.gaugeSettings.titleFont = "18pt Arial";
    this.gaugeSettings.gaugeDiam = 175;
    this.gaugeSettings.rimWidth = 25;
    this.gaugeSettings.faceColor = "#ffffff";
    this.gaugeSettings.centerX = 200;
    this.gaugeSettings.centerY = 250;
    this.gaugeSettings.startDegree = 135;
    this.gaugeSettings.endDegree = 405;
    this.gaugeSettings.outerScaleDiam = 100;
    this.gaugeSettings.outerScaleRange = {s: 0, e: 6000};
    this.gaugeSettings.outerScaleIntervals = [500,100,0];  // not using third interval at present
    this.gaugeSettings.outerScaleFnt = "8pt Calibri";
    this.gaugeSettings.outerScaleColor = "#000000";
    this.gaugeSettings.outerScaleUnit = "PSI";
    this.gaugeSettings.hasInnerScale = true;
    this.gaugeSettings.innerScaleConvFactor = 0.068573;
    this.gaugeSettings.innerScaleDiam = 96;
    this.gaugeSettings.innerScaleMin = 0;
    this.gaugeSettings.innerScaleIntervals = [50,10,0];
    this.gaugeSettings.innerScaleFnt = "8pt Arial";
    this.gaugeSettings.innerScaleColor = "#ff0000";
    this.gaugeSettings.innerScaleUnit = "Kg/cm3";
    this.gaugeSettings.innerScaleToEnd = true;
    this.gaugeSettings.dialBaseDiam = 25;
    this.gaugeSettings.pointerColor = "#0000ff";
    this.gaugeSettings.digWd = 60;
    this.gaugeSettings.digHt = 14;
    this.gaugeSettings.digFnt = "12pt Calibri";
    this.gaugeSettings.digBC = "#efefef";
	}

  setSliderValues():void {
			this.maxSteps = this.gaugeSettings.outerScaleRange.e - this.gaugeSettings.outerScaleRange.s + 1;
			this.sliderHeight = this.canvasHt - 10;  // initial slider height is 10 pixels less than canvas height
			this.sliderY = this.sliderHeight + 5; // (x,y) location of center base of slider
			this.handleY = this.sliderY;  // handleY is current location of slider handle
			this.pxInterval = Math.floor(this.sliderHeight / this.maxSteps * this.gaugeSettings.outerScaleIntervals[1]);
	}

  drawSlider():void {
    this.ctx.rect(0,0,this.canvasWd,this.canvasHt);
    this.ctx.clip();
    this.ctx.clearRect(0,0,this.canvasWd,this.canvasHt);

    var y = this.sliderY;
    
    // draw slider tick marks			
    this.ctx.lineWidth = 1;
    for (var i = 0; i < this.maxSteps; i = i + this.gaugeSettings.outerScaleIntervals[1]) {
      this.drawLine(i, y);
      y -= this.pxInterval;
    }

    y += this.pxInterval;
    this.sliderHeight = this.sliderY - y;  // adjust slider height to actual height based on pixel interval

    // draw vertical slider line
    this.ctx.strokeStyle = "#0000ff";
    this.ctx.lineWidth = 5;
    this.ctx.beginPath();
    this.ctx.moveTo(this.sliderX, this.sliderY);
    this.ctx.lineTo(this.sliderX, y);
    this.ctx.stroke();
    this.ctx.closePath();

    // draw slider handle
    this.ctx.fillStyle = "#000000";
    this.ctx.beginPath();
    this.ctx.arc(this.sliderX - this.handleHalfWd, this.handleY, this.handleHalfHt, (Math.PI/180)*90, (Math.PI/180)*270, false);
    this.ctx.lineTo(this.sliderX + this.handleHalfWd, this.handleY - this.handleHalfHt);
    this.ctx.arc(this.sliderX + this.handleHalfWd, this.handleY, this.handleHalfHt, (Math.PI/180)*270, (Math.PI/180)*450, false);
    this.ctx.lineTo(this.sliderX - this.handleHalfWd, this.handleY + this.handleHalfHt);
    this.ctx.fill();
    this.ctx.closePath();
  } // end drawSlider()

  drawLine(i, y):void {
    var x1 = this.sliderX - 5, x2 = this.sliderX + 5, label = false;
    if (i % this.gaugeSettings.outerScaleIntervals[0] === 0) {
        x1 -= 3;
        x2 += 3;
        label = true;
      }
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y);
    this.ctx.lineTo(x2, y);
    this.ctx.stroke();
    this.ctx.closePath();
    if (label) {
      this.ctx.fillStyle = "#0000ff";
      this.ctx.textBaseline = "middle";
      this.ctx.textAlign = "start";
      this.ctx.fillText(i.toString(), x2 + 8, y);
    }
  }  // end drawLine()

  setMouseDown(isDown) {
    this.mousedown = isDown;
  }  // end setMouseDown()

	onSliderMouseMove(evt:Event):void {
    if (this.mousedown) {
      var mousePos = this.getMousePos(this.sliderCanvas, evt);
      //var message = onHandle + " -- Mouse position: " + mousePos.x + "," + mousePos.y + " || " + mousePos.msg;
      //writeMessage(this, message);
      if (this.isOnSlider(mousePos) && !this.isRunning) {
        var value = (this.sliderY - mousePos.y) / this.sliderHeight * this.maxSteps;
        
        //console.log(value);
        if (value < 0) {
          this.handleY = this.sliderY;
        } else if (value >= this.maxSteps) {
          this.handleY = this.sliderY - this.sliderHeight;
        } else {
          this.handleY = mousePos.y;
        }
        this.drawSlider();
        if (!this.isRunning) {
          // update gauge needle
          this.gauge.setInputLevel(value);
          this.gauge.drawScreen();
          // update html slider
          this.sliderCtrlValue = value / this.maxSteps * 100;
        }
      }
    }
  } // end onSliderMouseMove()

  getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect(), root = document.documentElement;

    // return relative mouse position
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    var pos = {x: mouseX, y: mouseY, msg: "cx: " + evt.clientX + ", cy: " + evt.clientY + ", t: " + rect.top + ", l: " + rect.left + ", st:" + root.scrollTop + ", sl:" + root.scrollLeft};
    //console.log(pos);
    return pos;
  }  // end getMousePos()

  isOnSlider(mousePos):boolean {
    if (mousePos.x >= this.sliderX - this.handleHalfWd * 2 && mousePos.x <= this.sliderX + this.handleHalfWd * 2 &&
        mousePos.y >= this.sliderY - this.sliderHeight && mousePos.y <= this.sliderY) {
      return true;
    }
    return false;
  }  // end isOnSlider()

  calcTarget():number {
    return this.gaugeSettings.outerScaleRange.s + 
            (Math.round(Math.random()*((this.gaugeSettings.outerScaleRange.e - this.gaugeSettings.outerScaleRange.s) / 
            this.gaugeSettings.inputGranularity) * this.gaugeSettings.inputGranularity));
  }  // end calcTarget()
		
	toggleDemo():void {
    if (!this.isRunning) {
      this.isRunning = true;
      this.demoBtnLbl = "Stop Simulation";
      if (this.timeoutLen == 500) {
        this.timer = setInterval(()=>{this.runDemo();},100);
      }
    } else {
      this.isRunning = false;
      this.demoBtnLbl = "Start Simulation";
      clearInterval(this.timer);
      this.timeoutLen = 500;
    }
  }  // end toggleDemo()

	runDemo():void {
    this.demoStatusLbl = "Running demo..." + (this.timeoutLen + 1).toString();
    
    if (this.isRunning) {
      if (this.inputLevels.curr < this.inputLevels.targ) {
        this.inputLevels.curr += (this.gaugeSettings.outerScaleIntervals[1] * this.gaugeSettings.inputGranularity);
        if (this.inputLevels.curr > this.inputLevels.targ) this.inputLevels.curr = this.inputLevels.targ;
      }
      else if (this.inputLevels.curr > this.inputLevels.targ) {
        this.inputLevels.curr -= (this.gaugeSettings.outerScaleIntervals[1] * this.gaugeSettings.inputGranularity);
        if (this.inputLevels.curr < this.inputLevels.targ) this.inputLevels.curr = this.inputLevels.targ;
      }
      else {
        if (this.tick++ > this.delay) {
          this.tick = 0;
          this.delay = Math.round(Math.random()*30);
          this.inputLevels.targ = this.calcTarget();
        }
      }
    }
    this.gauge.setInputLevel(this.inputLevels.curr);
    this.gauge.drawScreen();

    if (this.timeoutLen-- < 0) {
      clearInterval(this.timer);
      this.isRunning = false;
      this.demoBtnLbl = "Start Simulation";
      this.timeoutLen = 500;
    }
  }  // end runDemo()

	resetSliderCtrl() {
		this.sliderCtrlValue = 0;
	}  // end resetSliderCtrl()
		
	onSliderInput():void {
    console.log('input');
    if (!this.isRunning) {
      var value = this.sliderCtrlValue;
      var pctage = value / 100;
      value = pctage * this.maxSteps;
      if (value < 0) {
        value = 0;
      } else if (value >= this.maxSteps) {
        value = this.maxSteps;
      } 
      // update gauge needle
      this.gauge.setInputLevel(value);
      this.gauge.drawScreen();
      // update canvas slider
      this.handleY = this.sliderY - (this.sliderHeight * pctage);
      this.drawSlider();
    }
  } // end onSliderInput()

  setSettings():void {
    this.gaugeSettings.gaugeDiam = this.enforceInt(this.gaugeSettings.gaugeDiam);
    this.gaugeSettings.rimWidth = this.enforceInt(this.gaugeSettings.rimWidth);
    this.gaugeSettings.centerX = this.enforceInt(this.gaugeSettings.centerX);
    this.gaugeSettings.centerY = this.enforceInt(this.gaugeSettings.centerY);
    this.gaugeSettings.startDegree = this.enforceInt(this.gaugeSettings.startDegree);
    this.gaugeSettings.endDegree = this.enforceInt(this.gaugeSettings.endDegree);
    this.gaugeSettings.outerScaleDiam = this.enforceInt(this.gaugeSettings.outerScaleDiam);
    this.gaugeSettings.outerScaleRange.s = this.enforceInt(this.gaugeSettings.outerScaleRange.s);
    this.gaugeSettings.outerScaleRange.e = this.enforceInt(this.gaugeSettings.outerScaleRange.e);
    this.gaugeSettings.outerScaleIntervals[0] = this.enforceInt(this.gaugeSettings.outerScaleIntervals[0]);
    this.gaugeSettings.outerScaleIntervals[1] = this.enforceInt(this.gaugeSettings.outerScaleIntervals[1]);
    this.gaugeSettings.hasInnerScale = this.parseBoolean(this.gaugeSettings.hasInnerScale);
    this.gaugeSettings.innerScaleConvFactor = this.enforceFloat(this.gaugeSettings.innerScaleConvFactor);
    this.gaugeSettings.innerScaleDiam = this.enforceInt(this.gaugeSettings.innerScaleDiam);
    this.gaugeSettings.innerScaleMin = this.enforceInt(this.gaugeSettings.innerScaleMin);
    this.gaugeSettings.innerScaleIntervals[0] = this.enforceInt(this.gaugeSettings.innerScaleIntervals[0]);
    this.gaugeSettings.innerScaleIntervals[1] = this.enforceInt(this.gaugeSettings.innerScaleIntervals[1]);
    this.gaugeSettings.innerScaleToEnd = this.parseBoolean(this.gaugeSettings.innerScaleToEnd);
    this.gaugeSettings.dialBaseDiam = this.enforceInt(this.gaugeSettings.dialBaseDiam);
    this.gaugeSettings.digWd = this.enforceInt(this.gaugeSettings.digWd);
    this.gaugeSettings.digHt = this.enforceInt(this.gaugeSettings.digHt);
  }  // end setSettings()
  
  parseBoolean(str):boolean {
    str = str.toString().toLowerCase();
    if (str === "true") return true;
    return false;
  }

  enforceInt(num:number):number {
    return Math.floor(num);
  }

  enforceFloat(num:number):number {
    return num * 1.0;
  }

	// apply settings
	onApply(e:Event):void {
    this.setSettings();  // read settings from form into gaugeSettings object
    this.update(e);
  }

	// reset input fields
	onReset(e:Event):void {
    this.resetSettings();
    this.update(e);
  }

  update(e:Event):void {
    this.gauge.updateSettings(this.gaugeSettings);  // update Gauge object with settings object
    this.inputLevels.curr = this.gaugeSettings.outerScaleRange.s;  // reset current input to starting level
    this.gauge.setInputLevel(this.inputLevels.curr);  // update the gauge so needle is reset
    this.gauge.drawScreen();  // draw gauge
    this.setSliderValues();  // update the canvas slider variables so they match new settings
    this.drawSlider();  // redraw canvas slider
    this.resetSliderCtrl();  // reset the html slider control
    e.preventDefault(); // prevent default HTTP request on submit
  }

}  // end class
