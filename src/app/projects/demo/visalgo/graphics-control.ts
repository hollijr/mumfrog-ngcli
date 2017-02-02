import { OnInit } from '@angular/core';
import { ItemArray } from './item-array';
	
export class GraphicsControl {	/* object that controls the drawing of canvas graphics */

	// class variables
	self;
	canvas = new Array();
	context:CanvasRenderingContext2D[] = new Array();


	swapSpeed = [100,50,25];
	flashSpeed = [300,150,75];
	heapSpeed = [1000,500,250];

	startX:number = 5;
	startY:number = 180;
	maxHeight:number = 50;
	barWd:number = 6;
	labelFnt = "7pt Arial";
	textColor = "white";
	nodeFont = "6pt Arial";
	nodeHighlight = "red";
	divideColor = "#aaa";
	lineColor = "black";
	stdColor = "blue";
	sortedColor = "red";
	minColor = "#33ff66";
	compareColor = "#33ccff";
	openSpotColor = "#33ccff";
	pivotPtColor = "#33ff66";
	pivotColor = "#ff99ff";
	activeColor = "blue";
	inactiveColor = "#cccccc";
	backgroundColor = "#ffff99";
	arrowWd:number = 6;
	arrowHt:number = 12;
	arrowY:number = 6;
	bars;
	sortedBars;
	nodeLocations;

	constructor(private numItems:number, private gItemArray:ItemArray, baseCanvas, midCanvas, topCanvas) {
		this.self = this;
		this.canvas.push(baseCanvas);
    this.context[0] = baseCanvas.getContext("2d");
		this.canvas.push(midCanvas);
    this.context[1] = midCanvas.getContext("2d");
		this.canvas.push(topCanvas.nativeElement);
    this.context[2] = topCanvas.getContext("2d");

		this.bars = new Array(this.numItems);
		this.sortedBars = new Array(this.numItems);
		this.nodeLocations = new Array(this.numItems);
  }

	/* a bar object 
	this.bar = function(x, y, z) {
		this.x = x;
		this.y = y;
		this.h = z;
	}*/

	/* load bars array */
	createBars():void {
		var yGap = (this.startY-this.maxHeight) / (this.calculateLevel(this.numItems) + 1);
		var level = 0, sum = 1, iPerRow = 1;

		for (var i = 0; i < this.numItems; i++) {
			// instead of creating an object (above), just pass a map object.  Both ways work; this
			// is just less code.
			// x = x coordinate of bar, y = y coordinate of bar, h = height of bar, v = value of element
			this.bars[i] = {x: this.calculateX(i), y: this.startY, h: this.calculateHt(i), v: this.gItemArray.get(i)};
			
			// store the level in a binary tree where this index's node is displayed
			if (i >= sum) {
				level++;
				iPerRow = Math.pow(2,level);
				sum += iPerRow;
			}
			var xGap = Math.floor(this.canvas[0].width / Math.pow(2,level));
			this.nodeLocations[i] = {l: level, x: xGap*(i - (sum - iPerRow)) + 0.5*xGap, y: yGap*0.5 + yGap*level};
			//this.bars[i] = new this.bar(this.calculateX(i), this.startY, this.calculateHt(i));
		}
	}

	reset = function() {
		this.resetBars();
		for (var i = 0; i < this.context.length; i++) {
			this.clearLayer(i);
		}
		this.drawScreen(0);
	}

	resetBars = function() {
		for (var i = 0; i < this.numItems; i++) {
			this.bars[i].x = this.calculateX(i);
			this.bars[i].y = this.startY;
			this.bars[i].h = this.calculateHt(i);
			this.bars[i].v = this.gItemArray.get(i);
		}
	}

	/* store a canvas and context for a layer */
	setCanvasLayer = function(layerNo, canvasId) {
		if (!isNaN(layerNo)) {
			this.canvas.splice(layerNo, 0, canvasId);
			var cxt = this.canvas[layerNo].getContext('2d');
			this.context.splice(layerNo, 0, cxt);
		}
	}

	/* clear a layer's entire canvas */
	clearLayer = function(layer) {
		this.context[layer].clearRect(0, 0, this.canvas[layer].width, this.canvas[layer].height);
	}

	/* draw the entire array of items in base color on the baseline and with labels */
	drawScreen = function(layer) {
		this.context[layer].clearRect(0, 0, this.canvas[layer].width, this.canvas[layer].height);

		// draw bars & labels
		for (var i = 0; i < this.gItemArray.length; i++) {
			this.drawItem(layer, i, this.stdColor);
		}
	}

	/* draw the horizontal line on which the item bars sit */
	drawBaseline = function(layer) {
		this.context[layer].beginPath();
		this.context[layer].strokeStyle = this.lineColor;
		this.context[layer].lineWidth = 1;
		this.context[layer].moveTo(this.startX, this.startY+1);
		this.context[layer].lineTo(this.canvas[layer].width - this.startX, this.startY+1);
		this.context[layer].stroke();
		this.context[layer].closePath();
	}

	/* draw the item bars, coloring them according to which are already sorted and which
		remain to be sorted
	*/
	drawInPlaceSort = function(layer, start, end, switchPt, lowColor, hiColor) {
		this.context[layer].clearRect(0, 0, this.canvas[layer].width, this.canvas[layer].height);

		for (var k = start; k < end; k++) {
			var color = hiColor;
			if (k < switchPt) color = lowColor;
			this.drawItem(layer, k, color);
		}
	}

	/* Redraw current state of divide and conquer sort where pivot is marked separately, 
		current subset of array being processed is highlighted while rest of array is
		kept in 'disabled' color.
	*/
	drawDivideAndConquerSort = function(layer, left, right, pivot) {
		this.context[layer].clearRect(0, 0, this.canvas[layer].width, this.canvas[layer].height);
		this.clearSwapBaseMark(0);
		this.markRange(0, left);
		this.markRange(0, right);

		for (var k = 0; k < this.gItemArray.length; k++) {
			var color = this.activeColor;
			if (k == pivot) color = this.pivotColor;
			else if (k < left || k > right) color = this.inactiveColor;
			this.drawItem(layer, k, color);
		}
	}

	/* Slide a range of bars */
/*	this.slideRangeOfBars = function(layer, left, barCt, startX, startY, currX, currY, endX, endY, color, funct)  {
		//this.context[layer].clearRect(0, 0, this.canvas[layer].width, this.canvas[layer].height);	
		var newX = currX;
		var newY = currY;
		if (currY !== endY || currX !== endX) {
			if (currY !== endY) {
				var vertChg = 5;
				if (Math.abs(currY - endY) < 5) vertChg = Math.abs(currY - endY);
				if (endY < startY) vertChg *= -1;
				newY += vertChg;
			} 
			if (currX !== endX) {
				var horizChg = 1;
				if (Math.abs(endX - currX) < horizChg) horizChg = Math.abs(endX - currX);
				if (endX < startX) horizChg *= -1;
				newX += horizChg;
			}	

			for (var k = left; k < left + barCt; k++) {
				this.moveBar(layer, k, currX+(k-left)*this.barWd*2, currY, newX+(k-left)*this.barWd*2, newY, color);
			}
			timer = setTimeout(function() {gGraphics.slideRangeOfBars(layer, left, barCt, startX, startY, newX, newY, endX, endY, color, funct);}, swapSpeed[speed]);
		} else {
			funct();
		}		
	} */

	slideRangeOfBars = function(layer, left, barCt, startX, startY, endX, endY, color, whichTimer, funct)  {
		
		var newX = this.bars[left].x;
		var newY = this.bars[left].y;
		if (this.bars[left].y !== endY || this.bars[left].x !== endX) {
			if (this.bars[left].y !== endY) {
				var vertChg = 5;
				if (Math.abs(this.bars[left].y - endY) < 5) vertChg = Math.abs(this.bars[left].y - endY);
				if (endY < startY) vertChg *= -1;
				newY += vertChg;
			} 
			if (this.bars[left].x !== endX) {
				var horizChg = 1;
				if (Math.abs(endX - this.bars[left].x) < horizChg) horizChg = Math.abs(endX - this.bars[left].x);
				if (endX < startX) horizChg *= -1;
				newX += horizChg;
			}	

			for (var k = left; k < left + barCt && k < this.numItems; k++) {
				this.moveBar(layer, k, newX+(k-left)*this.barWd*2, newY, color);
			}
			if (whichTimer === 1) 
				timer = setTimeout(function() {gGraphics.slideRangeOfBars(layer, left, barCt, startX, startY, endX, endY, color, 1, funct);}, this.swapSpeed[speed]);
			else 
				timer2 = setTimeout(function() {gGraphics.slideRangeOfBars(layer, left, barCt, startX, startY, endX, endY, color, 2, funct);}, this.swapSpeed[speed]);
		} else {
			funct();
		}		
	}

	flashAndMoveBar = function(layer, bar, endX, endY, nComplete, funct) {
		if (nComplete > 2) {
			// flashing complete, move
			this.hideBar(layer, bar);
			this.drawBar(layer, endX, endY, this.bars[bar].h, this.stdColor);
			timer = setTimeout(function() {funct();}, this.compareSpeed[speed]);
		} else {
			var color = this.compareColor;
			if (nComplete % 2 == 0) {
				color = this.minColor;
			} 
			this.drawBar(layer, this.bars[bar].x, this.bars[bar].y, this.bars[bar].h, color);
			timer = setTimeout(function() {gGraphics.flashAndMoveBar(layer, bar, endX, endY, nComplete+1, funct);}, this.flashSpeed[speed]);
		}
	}

	sortBar = function(i, old) {
		this.sortedBars[i] = this.bars[old];
		this.sortedBars[i].x = this.calculateX(i);
		this.sortedBars[i].y = this.startY;
	}

	copyBars = function(left, end) {
		var temp = this.bars.slice(0, left).concat(this.sortedBars.slice(left, end)).concat(this.bars.slice(end));
		this.bars = temp;
	}

	/* swap the coordinates of two bars */
	swapCoordinates = function(i, j) {
		var tempX = this.bars[i].x;
		var tempY = this.bars[i].y;
		this.bars[i].x = this.bars[j].x;
		this.bars[i].y = this.bars[j].y;
		this.bars[j].x = tempX;
		this.bars[j].y = tempY;
	}		

	/* move a bar from its current coordinates to new coordinates */
	moveBar = function(layer, idx, newX, newY, color) {
		//var ht = this.calculateHt(idx);
		this.hideBar(layer, idx);
		this.bars[idx].x = newX;
		this.bars[idx].y = newY;
		this.drawBar(layer, this.bars[idx].x, this.bars[idx].y, this.bars[idx].h, color);
	}

	/* hide a range of bars */
	hideRangeOfItems = function(layer, start, end) {
		for (var i = start; i < end; i++) {
			this.hideItem(layer, i);
		}
	}

	/* (re)draw a bar, its label, and the baseline on which it sits */
	/*
	this.drawItem = function(layer, i, color) {
		this.drawBar(layer, this.calculateX(i), this.startY, this.calculateHt(i), color);
		this.drawLabel(layer, i, color);
		this.drawBaseline(layer);
	}*/

	/* (re)draw a bar, its label, and the baseline on which it sits */
	drawItem = function(layer, i, color) {
		this.context[layer].clearRect(this.bars[i].x, this.arrowHt + this.arrowY, this.barWd, this.startY);
		this.drawBar(layer, this.bars[i].x, this.bars[i].y, this.bars[i].h, color);
		this.drawLabel(layer, i, color);
		this.drawBaseline(layer);
	}

	/* hide the bars, usually in the base layer, that are going to be moving in an animation */
	hideItem = function(layer, i) {
		this.context[layer].clearRect(this.bars[i].x-this.barWd/2, this.arrowHt + this.arrowY, this.barWd*2, this.startY);
		this.drawBaseline(layer);
	}

	hideBar = function(layer, idx) {
		this.context[layer].clearRect(this.bars[idx].x-this.barWd/4, this.bars[idx].y-this.bars[idx].h-2, this.barWd*1.5, this.bars[idx].h+4);
	}

	/* calculate the lower left X position of a bar based on its index in the array */
	calculateX = function(i) {
		return this.startX + this.barWd/2 + (this.barWd * 2 * i);
	}

	/* calculate the height of a bar based on its value */
	calculateHt = function(i) {
		return this.maxHeight * (this.gItemArray.elements[i] / this.gItemArray.length);
	}

	/* calculate the level in the tree at which an element's node should be displayed based on the index of the element in the array */
	calculateLevel = function(idx) {
		var level = 0, sum = 1;
		while (idx >= sum)  {
			level++;
			sum += Math.pow(2,level);
		}
		return level;
	}

	/* draw a bar */
	drawBar = function(layer, x, y, ht, color) {
		//this.context[layer].clearRect(x, this.arrowHt + this.arrowY, this.barWd, this.startY);
		this.context[layer].beginPath();
		this.context[layer].fillStyle = color;
		this.context[layer].rect(x, y - ht, this.barWd, ht);
		this.context[layer].stroke();
		this.context[layer].fill();
		this.context[layer].closePath();
	}

	/* draw a bar's label */
	drawLabel = function(layer, i, color) {
		//var x = this.startX + this.barWd/4 + (this.barWd * 2 * i);
		this.context[layer].clearRect(this.bars[i].x, this.startY + 1, this.barWd, this.startY);
		this.context[layer].font = color;
		this.context[layer].setTransform(1,0,0,1,0,0);
		this.context[layer].translate(this.bars[i].x, this.startY + 12);
		this.context[layer].rotate(270 + (Math.PI / 2));
		this.context[layer].textAlign = "center";
		this.context[layer].translate(0, 0);
		this.context[layer].fillText(this.bars[i].v.toString(), 0, 0);
		this.context[layer].rotate(0);
		this.context[layer].setTransform(1,0,0,1,0,0);
	}

	/* draw a node in a tree */
	drawNode = function(layer, i, textColor, fillColor, lineColor, lineWidth) {
		var offset = this.bars[i].v.toString().length*2.5;
		this.context[layer].beginPath();
		this.context[layer].font = this.nodeFont;
		this.context[layer].fillStyle = fillColor;
		this.context[layer].strokeStyle = lineColor;
		this.context[layer].lineWidth = lineWidth;
		this.context[layer].arc(this.nodeLocations[i].x, this.nodeLocations[i].y, 8, 0, 360, true);
		this.context[layer].stroke();
		this.context[layer].fill();
		this.context[layer].fillStyle = textColor;
		this.context[layer].fillText(this.bars[i].v.toString(), this.nodeLocations[i].x-offset, this.nodeLocations[i].y+3);
		this.context[layer].closePath();
	}

	/* draw all tree branches */
 	drawBranches = function(layer) {
		var lastParent = Math.floor((this.numItems-2)/2);
		for (var i = 0; i <= lastParent; i++) {
			var child = 2*i + 1;
			if (child < this.numItems) {
				this.drawBranch(layer, i, child, this.lineColor);
			} else break;
			if (child + 1 < this.numItems) {
				this.drawBranch(layer, i, child + 1, this.lineColor);
			} else break;
		}
	}

	/* draw a single branch line */
	drawBranch = function(layer, parent, child, color) {
		this.context[layer].beginPath();
		this.context[layer].strokeStyle = color;
		this.context[layer].moveTo(this.nodeLocations[parent].x, this.nodeLocations[parent].y);
		this.context[layer].lineTo(this.nodeLocations[child].x, this.nodeLocations[child].y);
		this.context[layer].stroke();
		this.context[layer].closePath();
	}

	/* draw all nodes in the active color */
	drawNodesActive = function(layer) {
		for (var i = 0; i < this.numItems; i++) {
			this.drawNode(layer, i, this.textColor, this.activeColor, this.lineColor, 1);
		}
	}

	/* draw the tree, one node at a time */
	drawTree = function(layer, textColor, fillColor, lineColor, i, funct) {
		if (i < this.numItems) {
			this.hideItem(0, i);
			if (i%2 === 0 && (i-2)/2 >= 0) {
				this.markParentChild(layer, (i-2)/2, i, textColor, fillColor, lineColor);
			} else if (i%2 !== 0 && (i-1)/2 >= 0) {
				this.markParentChild(layer, (i-1)/2, i, textColor, fillColor, lineColor);
			}
			else this.drawNode(layer, i, textColor, fillColor, lineColor, 1);
			timer = setTimeout(function() {gGraphics.drawTree(layer, textColor, fillColor, lineColor, i+1, funct);}, this.heapSpeed[speed]);
		} else {
			funct();
		}
	}

	/* color a parent-child relationship */
	markParentChild = function(layer, parent, child, textColor, fillColor, lineColor) {
		this.drawBranch(layer, parent, child, lineColor);
		this.drawNode(layer, parent, textColor, fillColor, lineColor, 1);
		this.drawNode(layer, child, textColor, fillColor, lineColor, 1);	
	}

	/* Hide a node and branch to it */
	hideNode = function(layer, node) {
		if (node >= 0 && node < this.numItems) {
			this.drawNode(layer, node, this.backgroundColor, this.backgroundColor, this.backgroundColor, 3);
			if (node%2 === 0 && (node-2)/2 >= 0) {
				this.drawBranch(layer, (node-2)/2, node, this.backgroundColor);
				this.drawNode(layer, (node-2)/2, this.textColor, this.activeColor, this.lineColor, 1);
			} else if (node%2 !== 0 && (node-1)/2 >= 0) {
				this.drawBranch(layer, (node-1)/2, node, this.backgroundColor);
				this.drawNode(layer, (node-1)/2, this.textColor, this.activeColor, this.lineColor, 1);
			}
		}
	}

	/* draw a black arrow pointing to a bar that is being compared and/or swapped */
	markSwapBase = function(layer, i) {
		var x = this.calculateX(i);
		this.drawDownArrow(layer, x, this.arrowY, "black");
	}

	markRange = function(layer, i) {
		var x = this.calculateX(i);
		this.drawDownArrow(layer, x, this.arrowY, this.activeColor);
	}

	markDivide = function(layer, r) {
		if (r < this.numItems) {
			this.context[layer].strokeStyle = this.divideColor;
			this.context[layer].lineWidth = 1;
			this.context[layer].beginPath();
			this.context[layer].moveTo(this.bars[r].x-2-this.barWd/2, this.bars[r].y);
			this.context[layer].lineTo(this.bars[r].x-2-this.barWd/2, this.bars[r].y-this.maxHeight);
			this.context[layer].stroke();
			this.context[layer].closePath();
		}
		
	}

	/* hide a black arrow */
	clearSwapBaseMark = function(layer) {
		this.context[layer].clearRect(0, 0, this.canvas[layer].width, this.arrowY+this.arrowHt);
	}

	/* draw a bar and its label using the color that denotes the item has already been sorted */
	drawSortedItem = function(layer, i) {
		this.drawItem(layer, i, this.sortedColor);
	}

	/* draw a bar and its label using the color that denotes it is the current minimum value */
	highlightMin = function(layer, min) {
		this.drawItem(layer, min, this.minColor);
	}

	/* draw a bar and its label using the color that denotes it is the current minimum value */
	highlightPivotPoint = function(layer, pivot) {
		this.drawItem(layer, pivot, this.pivotPtColor);
	}

	/* draw a bar and its label using the base (unsorted) color */
	drawStandard = function(layer, i) {
		this.drawItem(layer, i, this.stdColor);
	}

	/* draw and bar and its label using the color that denotes it is part of the current comparison */
	showNextCompare = function(layer, i) {
		this.drawItem(layer, i, this.compareColor);
	}

	/* draw a black arrow that points downward */
	drawDownArrow = function(layer, x,y,color) {
		var third = this.arrowWd / 3;
		this.context[layer].beginPath();
		this.context[layer].fillStyle = color;
		this.context[layer].strokeStyle = color;
		this.context[layer].translate(x, y);
		this.context[layer].moveTo(third, 0);
		this.context[layer].lineTo(third * 2, 0);
		this.context[layer].lineTo(third * 2, this.arrowHt - this.arrowWd);
		this.context[layer].lineTo(this.arrowWd, this.arrowHt - this.arrowWd);
		this.context[layer].lineTo(this.arrowWd/2, this.arrowHt);
		this.context[layer].lineTo(0, this.arrowHt - this.arrowWd);
		this.context[layer].lineTo(third, this.arrowHt - this.arrowWd);
		this.context[layer].lineTo(third, 0);
		this.context[layer].fill();
		this.context[layer].stroke();
		this.context[layer].translate(-x, -y);
		this.context[layer].closePath();
	}

	/* animate the swapping of two bars */
	swapElements = function(baseLayer, swapLayer, i, j, type, funct) {

		// hide bars being switched in base layer
		this.hideItem(baseLayer, i);
		this.hideItem(baseLayer, j);

		var icolor = this.openSpotColor;
		var	jcolor = this.minColor;
		if (type == 'pivot') {
			icolor = this.pivotColor;
			jcolor = this.openSpotColor;
		} else if (type == 'reversePivot') {
			jcolor = this.pivotColor;
		}

		// animate swap
		this.slideBars(swapLayer, "up", i, j, icolor, jcolor, 0, funct);
	}

	/* helper function that moves the two bars being swapped */
	slideBars = function(layer, dir, i, j, icolor, jcolor, nComplete, funct) {
		this.clearLayer(layer);

		if (dir == "up") {
			if (nComplete < 5) {
				// draw bars
				this.hideBar(layer, i);
				this.bars[i].y -= nComplete;
				this.drawBar(layer, this.bars[i].x, this.bars[i].y, this.bars[i].h, icolor);
				if (i != j) {
					this.hideBar(layer, j);
					this.bars[j].y -= nComplete;
					this.drawBar(layer, this.bars[j].x, this.bars[j].y, this.bars[j].h, jcolor);
				}
				
				timer = setTimeout(function() {gGraphics.slideBars(layer, "up", i, j, icolor, jcolor, nComplete+1, funct);}, this.swapSpeed[speed]);
			} else {
				this.slideBars(layer, "side", i, j, icolor, jcolor, 0, funct);
			}
		} else if (dir == "side") {
			var range = j - i;
			var y = (nComplete < range) ? 1 : -1;
			if (nComplete < range * 2) {
				this.hideBar(layer, i);
				this.hideBar(layer, j);
				this.bars[i].x += this.barWd;
				this.bars[j].x -= this.barWd;
				this.bars[i].y -= y;
				this.bars[j].y -= y;
				gGraphics.drawBar(layer, this.bars[i].x, this.bars[i].y, this.bars[i].h, icolor);
				gGraphics.drawBar(layer, this.bars[j].x, this.bars[j].y, this.bars[j].h, jcolor);
				timer = setTimeout(function() {gGraphics.slideBars(layer, "side", i, j, icolor, jcolor, nComplete+1, funct);}, this.swapSpeed[speed]);
			} else {
				this.slideBars(layer, "down", i, j, icolor, jcolor, 0, funct);
			}
		} else if (dir == "down") {
			if (nComplete < 5) {
				if (i != j) {
					this.hideBar(layer, i);
					this.bars[i].y += nComplete;
					gGraphics.drawBar(layer, this.bars[i].x, this.bars[i].y, this.bars[i].h, icolor);
				}
				this.hideBar(layer, j);
				this.bars[j].y += nComplete;
				gGraphics.drawBar(layer, this.bars[j].x, this.bars[j].y, this.bars[j].h, jcolor);
				timer = setTimeout(function() {gGraphics.slideBars(layer, "down", i, j, icolor, jcolor, nComplete+1, funct);}, this.swapSpeed[speed]);
			} else {
				this.bars[i].y = this.startY;
				this.bars[j].y = this.startY;
				funct();
			}
		}
	}
}