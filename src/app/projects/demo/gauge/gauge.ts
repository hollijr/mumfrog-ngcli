import { OnInit } from '@angular/core';
	
export class Gauge {

	constructor(private gaugeCanvas, gaugeSettings) {
		this.updateSettings(gaugeSettings);
    this.context = this.gaugeCanvas.getContext("2d");
	}
 
	context:CanvasRenderingContext2D;
	index:number = 0;  // lookup table index associated with the current input level of gauge

	// SETTING VARIABLES and their DEFAULTS
	// inputGranularity is the smallest unit in which the input level is specified. 
	// Input must be provided as a value within the range of the outer scale and at a granularity that can be less than 
	//    but not greater than the smallest indicator interval shown on the outer scale.
	// inputGranularity should be a number in the range: 0 < inputGranularity <= 1.  
	inputGranularity:number = 1;
	gaugeNameLn1:string = "GAUGE";
	gaugeNameLn2:string = "CONTROL";
	gaugeNmFnt:string = "18pt Arial";
	gaugeDiam:number = 175;
	rimWidth:number = 25;
	faceColor:string = "#ffffff";
	centerX:number = 200;
	centerY:number = 250;
	startDegree:number = 135;
	endDegree:number = 405;
	outerScaleDiam:number = 100;
	outerScaleRange = {s: 0, e: 6000};
	outerScaleIntervals = [500,100,0];
	outerScaleFnt:string = "8pt Calibri";
	outerScaleColor:string = "#000000";
	outerScaleUnit:string = "PSI";
	hasInnerScale:boolean = false;
	innerScaleConvFactor:number = 0.068573;
	innerScaleDiam:number = 96;
	innerScaleMin:number = 0;
	innerScaleIntervals : [50,10,0];
	innerScaleFnt:string = "8pt Arial";
	innerScaleColor:string = "#ff0000";
	innerScaleUnit:string = "Kg/cm3";
	innerScaleToEnd:boolean = true;
	dialBaseDiam:number = 25;
	pointerColor:string = "#0000ff";
	digWd:number = 60;
	digHt:number = 14;
	digFnt:string = "12pt Calibri";
	digBC:string = "#efefef";
	startRadian:number;
	endRadian:number;
	maxSteps:number;
	lookupTbl;
	innerStepConvRate:number;
	inputLevel:number;


	updateSettings(gaugeSettings):void {
		// inputGranularity is the smallest unit in which the input level is specified. 
		// Input must be provided as a value within the range of the outer scale and at a granularity that can be less than 
		//    but not greater than the smallest indicator interval shown on the outer scale.
		// inputGranularity should be a number in the range: 0 < inputGranularity <= 1. 
		this.inputGranularity = (gaugeSettings.hasOwnProperty("inputGranularity")) ? gaugeSettings.inputGranularity : 1;
		if (this.inputGranularity > 1 || this.inputGranularity <= 0) this.inputGranularity = 1;
		
		//***** gauge title properties  *****// 
		this.gaugeNameLn1 = (gaugeSettings.hasOwnProperty("titleLine1")) ? gaugeSettings.titleLine1 : "GAUGE";
		this.gaugeNameLn2 = (gaugeSettings.hasOwnProperty("titleLine2")) ? gaugeSettings.titleLine2 : "CONTROL";
		this.gaugeNmFnt = (gaugeSettings.hasOwnProperty("titleFont")) ? gaugeSettings.titleFont : "18pt Arial";

		//***** gauge border and background properties  *****// 
		this.gaugeDiam = (gaugeSettings.hasOwnProperty("gaugeDiam")) ? gaugeSettings.gaugeDiam : 175;
		this.rimWidth = (gaugeSettings.hasOwnProperty("rimWidth")) ? gaugeSettings.rimWidth : 25;
		this.faceColor = (gaugeSettings.hasOwnProperty("faceColor")) ? gaugeSettings.faceColor : "#ffffff";	

		//***** centerpoint of gauge  *****// 
		this.centerX = (gaugeSettings.hasOwnProperty("centerX")) ? gaugeSettings.centerX : 200;
		this.centerY = (gaugeSettings.hasOwnProperty("centerY")) ? gaugeSettings.centerY : 250;

		//***** start and finish degrees of scale  *****// 
		this.startDegree = (gaugeSettings.hasOwnProperty("startDegree")) ? gaugeSettings.startDegree : 135;
		this.endDegree = (gaugeSettings.hasOwnProperty("endDegree")) ? gaugeSettings.endDegree : 405;
		this.startRadian = this.startDegree * (Math.PI/180);
		this.endRadian = this.endDegree * (Math.PI/180);

		//***** major scale properties  *****//
		this.outerScaleDiam = (gaugeSettings.hasOwnProperty("outerScaleDiam")) ? gaugeSettings.outerScaleDiam : 100;

		// first and last values (numbers) shown on the scale
		this.outerScaleRange = (gaugeSettings.hasOwnProperty("outerScaleRange")) ? gaugeSettings.outerScaleRange : {s: 0, e: 6000};

		// interval = # of units between scale's major, minor and subminor indicator marks (set an interval to 0 if not applicable)
		this.outerScaleIntervals = (gaugeSettings.hasOwnProperty("outerScaleIntervals")) ? gaugeSettings.outerScaleIntervals : [500,100,0];

		this.outerScaleFnt = (gaugeSettings.hasOwnProperty("outerScaleFnt")) ? gaugeSettings.outerScaleFnt : "8pt Calibri";
		this.outerScaleColor = (gaugeSettings.hasOwnProperty("outerScaleColor")) ? gaugeSettings.outerScaleColor : "#000000";
		this.outerScaleUnit = (gaugeSettings.hasOwnProperty("outerScaleUnit")) ? gaugeSettings.outerScaleUnit : "PSI";

		//***** minor scale properties  *****//
		// include inner scale?
		this.hasInnerScale = (gaugeSettings.hasOwnProperty("hasInnerScale")) ? gaugeSettings.hasInnerScale : false;

		// decimal number to multiply outer scale value by to get equivalent inner scale value (for determining step intervals for marking inner scale indicators)
		this.innerScaleConvFactor = (gaugeSettings.hasOwnProperty("innerScaleConvFactor")) ? gaugeSettings.innerScaleConvFactor : 0.068573;
		
		this.innerScaleDiam = (gaugeSettings.hasOwnProperty("innerScaleDiam")) ? gaugeSettings.innerScaleDiam : 96;

		// start labeling major indicator marks at this number
		this.innerScaleMin = (gaugeSettings.hasOwnProperty("innerScaleMin")) ? gaugeSettings.innerScaleMin : 0;

		// interval = # of units between scale's major, minor and subminor indicator marks (set an interval to 0 if not applicable)
		this.innerScaleIntervals = (gaugeSettings.hasOwnProperty("innerScaleIntervals")) ? gaugeSettings.innerScaleIntervals : [50,10,0];

		this.innerScaleFnt = (gaugeSettings.hasOwnProperty("innerScaleFnt")) ? gaugeSettings.innerScaleFnt : "8pt Arial";
		this.innerScaleColor = (gaugeSettings.hasOwnProperty("innerScaleColor")) ? gaugeSettings.innerScaleColor : "#ff0000";
		this.innerScaleUnit = (gaugeSettings.hasOwnProperty("innerScaleUnit")) ? gaugeSettings.innerScaleUnit : "Kg/cm3";

		// if end of range is before end of outer scale's range, should additional tick markings be shown?
		this.innerScaleToEnd = (gaugeSettings.hasOwnProperty("innerScaleToEnd")) ? gaugeSettings.innerScaleToEnd : true;

		//***** dial base/center circle properties  *****//
		this.dialBaseDiam = (gaugeSettings.hasOwnProperty("dialBaseDiam")) ? gaugeSettings.dialBaseDiam : 25;
		
		//***** pointer properties  *****//
		this.pointerColor = (gaugeSettings.hasOwnProperty("pointerColor")) ? gaugeSettings.pointerColor : "#0000ff";
		
		//***** conversions, lookups, max settings  *****//
		this.maxSteps = ((this.outerScaleRange.e - this.outerScaleRange.s) / this.inputGranularity) + 1;
		this.lookupTbl = createLookupTbl(this.startRadian, this.endRadian, this.maxSteps);
		this.innerStepConvRate = this.maxSteps / ((this.outerScaleRange.e * this.innerScaleConvFactor) - (this.outerScaleRange.s * this.innerScaleConvFactor));

		//***** digital display properties  *****//
		this.digWd = (gaugeSettings.hasOwnProperty("digWd")) ? gaugeSettings.digWd : 60; 
		this.digHt = (gaugeSettings.hasOwnProperty("digHt")) ? gaugeSettings.digHt : 14;
		this.digFnt = (gaugeSettings.hasOwnProperty("digFnt")) ? gaugeSettings.digFnt : "12pt Calibri";
		this.digBC = (gaugeSettings.hasOwnProperty("digBC")) ? gaugeSettings.digBC : "#efefef";		
	} // end updateSettings


	drawScreen():void {

		let digDispX = this.centerX - (this.digWd / 2);  
		let digDispY = this.centerY + this.outerScaleDiam + (this.digHt / 2); 
		let maxDigits = Math.floor(this.outerScaleRange.e).toString().length;
		let digDispFixed = 0;

		if (this.inputGranularity < 1) {
			// add digits for decimal and 1 - 3 decimals
			var decs = this.inputGranularity.toFixed(3).toString(), addTo = 2;
			if (decs.substr(decs.length - 1,1) == "0") {
				addTo++;
				if (decs.substr(decs.length - 2,1) == "0") addTo++;
			}
			maxDigits += addTo;
			digDispFixed = addTo - 1;
		}

		//***** font sizes for spacing calculations  *****//
		let gaugeNmFS = parseInt(this.gaugeNmFnt.replace(/[^0-9 ]/g, ""));
		if (!gaugeNmFS) gaugeNmFS = 18;

		let outerScaleFS = parseInt(this.outerScaleFnt.replace(/[^0-9 ]/g, ""));
		if (outerScaleFS) outerScaleFS = 8;

		let innerScaleFS = parseInt(this.innerScaleFnt.replace(/[^0-9 ]/g, ""));
		if (!innerScaleFS) innerScaleFS = 8;
		
		let digFS = parseInt(this.digFnt.replace(/[^0-9 ]/g, ""));
		if (!digFS) digFS = 12;

		//***** unit label positions *****//
		let gap = ((this.centerY + this.outerScaleDiam) - (this.centerY + this.dialBaseDiam) - ((outerScaleFS + innerScaleFS) * 1.25)) / 7;
		let minorUnitY = this.centerY + this.dialBaseDiam + (gap * 3);
		let majorUnitY = minorUnitY + innerScaleFS + gap;

		// current input level
		this.inputLevel = this.outerScaleRange.s;

		// clear the canvas
		this.context.clearRect(0,0,this.gaugeCanvas.width,this.gaugeCanvas.height);

		// name of gauge
		writeMessage(this.context, this.gaugeNameLn1, this.gaugeNmFnt, "#000000", "center", "top", this.centerX, 10);
		writeMessage(this.context, this.gaugeNameLn2, this.gaugeNmFnt, "#000000", "center", "top", this.centerX, 10 + gaugeNmFS * 1.25);

		// outer black circle
		drawArc(this.context, this.centerX, this.centerY, this.gaugeDiam, 0, 2*Math.PI, false, "#030303", 0.5);

			// add radial gradient for lighting effect
		var grd = this.context.createRadialGradient(this.centerX, this.centerY, this.gaugeDiam-2, this.centerX, this.centerY, this.gaugeDiam * 0.75);
		grd.addColorStop(0, "#222222");
		grd.addColorStop(0.2, "#787878");
		grd.addColorStop(0.4, "#222222");
		grd.addColorStop(0.6, "#000000");
		this.context.fillStyle = grd;
		this.context.fill();

		// overlay gauge background
		drawArc(this.context, this.centerX, this.centerY, this.gaugeDiam - this.rimWidth, 0, 2*Math.PI, false, "#000000", 1);
		this.context.fillStyle = this.faceColor;
		this.context.fill();

		// outer scale arc
		drawArc(this.context, this.centerX, this.centerY, this.outerScaleDiam, this.startRadian, this.endRadian, false, this.outerScaleColor, 1.25);

		// draw outer scale major indicator markings
		drawOuterSteps(this.context, this.lookupTbl, this.outerScaleDiam, this.outerScaleDiam + 5, this.centerX, this.centerY, this.outerScaleColor, 1, this.outerScaleIntervals[0], this.inputGranularity, true, this.outerScaleFnt, this.startRadian, this.endRadian, this.outerScaleRange.s);

		// draw outer scale minor indicator markings
		if (this.outerScaleIntervals[1] > 0) {
			drawOuterSteps(this.context, this.lookupTbl, this.outerScaleDiam, this.outerScaleDiam + 3, this.centerX, this.centerY, this.outerScaleColor, 1, this.outerScaleIntervals[1], this.inputGranularity, undefined, undefined, undefined, undefined, undefined);
		}

		// draw outer scale subminor indicator markings
		if (this.outerScaleIntervals[2] > 0) {
			drawOuterSteps(this.context, this.lookupTbl, this.outerScaleDiam, this.outerScaleDiam + 1, this.centerX, this.centerY, this.outerScaleColor, 1, this.outerScaleIntervals[2], this.inputGranularity, undefined, undefined, undefined, undefined, undefined);
		}

		if (this.hasInnerScale) {

			var innerStart = this.outerScaleRange.s * this.innerScaleConvFactor,
				innerEnd = this.outerScaleRange.e * this.innerScaleConvFactor,
				innerTotUnits = (innerEnd - innerStart);

			// inner scale arc
			drawArc(this.context, this.centerX, this.centerY, this.innerScaleDiam, this.startRadian, this.endRadian, false, this.innerScaleColor, 1.25);

			// draw inner scale major indicator markings
			drawInnerSteps(this.context, this.lookupTbl, this.innerScaleDiam, this.innerScaleDiam - 5, this.centerX, this.centerY, this.innerScaleColor, 1, this.innerScaleIntervals[0], this.innerScaleMin, innerStart, innerEnd, this.innerScaleToEnd, true, this.outerScaleFnt, this.startRadian, this.endRadian);

			// draw inner scale minor indicator markings
			if (this.innerScaleIntervals[1] > 0) {
				drawInnerSteps(this.context, this.lookupTbl, this.innerScaleDiam, this.innerScaleDiam - 3, this.centerX, this.centerY, this.innerScaleColor, 1, this.innerScaleIntervals[1], this.innerScaleMin, innerStart, innerEnd, this.innerScaleToEnd, undefined, undefined, undefined, undefined);
			}

			// draw inner scale subminor indicator markings
			if (this.innerScaleIntervals[2] > 0) {
				drawInnerSteps(this.context, this.lookupTbl, this.innerScaleDiam, this.innerScaleDiam - 1, this.centerX, this.centerY, this.innerScaleColor, 1, this.innerScaleIntervals[2], this.innerScaleMin, innerStart, innerEnd, this.innerScaleToEnd, undefined, undefined, undefined, undefined);
			}
		}

		// inner black circle
		drawArc(this.context, this.centerX, this.centerY, this.dialBaseDiam, 0, 2*Math.PI, true, "#787878", 1);
		grd = this.context.createRadialGradient(this.centerX, this.centerY, this.dialBaseDiam, this.centerX, this.centerY, 0);
		grd.addColorStop(0, "#000000");
		grd.addColorStop(.2, "#222222");
		grd.addColorStop(0.5, "#555555");
		grd.addColorStop(0.85, "#777777");
		
		this.context.fillStyle = grd;
		this.context.fill();	

		// draw pointer
		this.context.strokeStyle = this.pointerColor;
		this.context.lineWidth = 1.5;
		drawTickMark(this.context, this.lookupTbl[this.index][0], this.lookupTbl[this.index][1], this.dialBaseDiam, this.outerScaleDiam + 15, this.centerX, this.centerY);

		// draw minor unit
		writeMessage(this.context, this.innerScaleUnit, this.innerScaleFnt, this.innerScaleColor, "center", "top", this.centerX, minorUnitY);

		// draw major unit
		writeMessage(this.context, this.outerScaleUnit, this.outerScaleFnt, this.outerScaleColor, "center", "top", this.centerX, majorUnitY);

		// draw digital display
		this.context.beginPath();
		this.context.strokeStyle = "#000000";
		this.context.lineWidth = 2;
		this.context.rect(digDispX - 5, digDispY - 3, this.digWd + 10, this.digHt + 8);
		this.context.stroke();
		this.context.fillStyle = this.digBC;
		this.context.fill();
		this.context.closePath();
		var digNum = "" + (this.index * this.inputGranularity).toFixed(digDispFixed).toString(), zero = "0";
		for (var i = 0; i < maxDigits - this.index.toString().length; i++) {
			digNum = zero + digNum;
		}

		// to right justify display, assume each digit display is about 2/3 as wide as it is tall
		writeMessage(this.context, digNum.toString(), this.digFnt, this.outerScaleColor, "center", "top", (digDispX + (this.digWd / 2)), digDispY);

	} // end drawScreen()


	setInputLevel(input):void {
		this.inputLevel = input;
		this.index = Math.floor((input - this.outerScaleRange.s) / this.inputGranularity);
		if (this.index < 0) this.index = 0;
		if (this.index >= this.maxSteps) this.index = this.maxSteps - 1;
	}  // end setInputLevel()

}  // end class


function createLookupTbl(startRad, endRad, steps) {
	// assume all parameters are positive -- validation to be added
	var table = [],
		ang = startRad,
		angStep = (endRad - startRad) / steps;
	for (var i = 0; i <= steps; i++) {
		table[i] = [Math.cos(ang),Math.sin(ang)];
		ang += angStep;
	}
	return table;
}

function writeMessage(context, text, fnt, color, a, baseln, x, y) {
	context.textBaseline = baseln;
	context.textAlign = a;
	context.font = fnt;
	context.fillStyle = color;
	context.fillText(text, x, y);
}

function drawArc(context, x, y, d, startRad, endRad, cc, color, w) {
	context.beginPath();
	context.strokeStyle = color;
	context.lineWidth = w;
	context.arc(x, y, d, startRad, endRad, cc);
	context.stroke();
	context.closePath();
}

function drawTickMark(context, cos, sin, d1, d2, cX, cY) {
	var x, y;
	context.beginPath();
	x = cX + (cos * d1);
	y = cY + (sin * d1);
	context.moveTo(x, y);
	x = cX + (cos * d2);
	y = cY + (sin * d2);
	context.lineTo(x, y);
	context.stroke();
	context.closePath();
}

function labelStep(context, angle, lbl, radius, cX, cY, color, fnt) {
	context.setTransform(1,0,0,1,0,0);
	context.font = fnt;
	context.fillStyle = color;
	context.translate(cX, cY);
	context.rotate(angle + (Math.PI / 2));
	context.textAlign = "center";
	context.translate(0, -1 * radius);
	context.fillText(lbl, 0, 0);
	context.rotate(0);
	context.setTransform(1,0,0,1,0,0);
}
		
function drawOuterSteps(context, table, d1, d2, cX, cY, color, w, interval, granularity, label, lblFnt, startRad, endRad, firstLabel) {
	if (typeof label === "undefined") label = false;
	var last, 
		skipSteps = interval / granularity,
		totRadians = endRad - startRad;
	context.strokeStyle = color;
	context.lineWidth = w;

	for (var i = 0; i < table.length; i = i + skipSteps) {
		drawTickMark(context, table[i][0], table[i][1], d1, d2, cX, cY);
		if (label) {
			var lbl = ((i * granularity) + firstLabel).toString(),
				angle = startRad + (totRadians * (i / table.length));
			labelStep(context, angle, lbl, d2 + 15, cX, cY, color, lblFnt);
		}
		last = i;
	}
	if (last < table.length - 1) {
		// draw closing step
		drawTickMark(context, table[table.length - 1][0], table[table.length - 1][1], d1, d2, cX, cY);
	}
}

function drawInnerSteps(context, table, d1, d2, cX, cY, color, w, interval, firstLabel, innerStart, innerEnd, toEnd, label, lblFnt, startRad, endRad) {
	if (typeof label === "undefined") label = false;
	context.strokeStyle = color;
	context.lineWidth = w;

	var totUnits = innerEnd - innerStart,
		last = innerEnd, 
		idx = 0,
		totRadians = endRad - startRad;
	if (toEnd && innerStart != firstLabel) {
		// draw tick at beginning of arc
		drawTickMark(context, table[idx][0], table[idx][1], d1, d2, cX, cY);
	}
	for (var i = firstLabel; i <= innerEnd; i = i + interval) {
		idx = Math.floor((((i - innerStart )/ totUnits) * table.length) + 0.5);
		if (idx < 0) idx = 0;
		if (idx >= table.length) idx = table.length - 1;
		drawTickMark(context, table[idx][0], table[idx][1], d1, d2, cX, cY);
		if (label) {
			var angle = startRad + (totRadians * ((i - firstLabel) / totUnits));
			labelStep(context, angle, i.toString(), d2 - 2, cX, cY, color, lblFnt);
		}
		last = i;
	}
	if (toEnd && last < innerEnd) {
		// draw tick at end of arc
		idx = table.length - 1;
		drawTickMark(context, table[idx][0], table[idx][1], d1, d2, cX, cY);
	}
}