import { OnInit } from '@angular/core';
	
export class ItemArray {
	
	private original;
	private elements;

	// wrap an array as an object with custom sort methods
	constructor(private length) {
		// length: number of elements to store in array

		// original order of values for resetting between different sorts
		this.original = new Array();

		// working copy for sorting 
		this.elements = new Array();
	}

	// used to populate the array with a new set of random integers
	create():void {
		this.original.length = 0;
		this.elements.length = 0;
		for (var i = 0; i < this.length; i++) {
			var value = Math.floor(Math.random() * this.length) + 1;
			this.original.push(value);
			this.elements.push(value);
		}
	}

	reset():void {
		this.elements.length = 0; 

		// assumes this.original's length has not changed from this.length
		for (var i = 0; i < this.length; i++) {
			this.elements.push(this.original[i]);
		}
	}

	swap(e1, e2):void {
		var temp = this.elements[e1];
		this.elements[e1] = this.elements[e2];
		this.elements[e2] = temp;
	}

	compare(e1, e2) {
		if (this.elements[e1] < this.elements[e2]) return -1;
		if (this.elements[e1] > this.elements[e2]) return 1
		return 0;
	}

	updateElements(array) {
		this.elements = array;
	}

	get(i) {
		return this.elements[i];
	}

}  // end ItemArray class