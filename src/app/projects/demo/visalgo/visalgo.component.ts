import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ItemArray } from './item-array';

@Component({
  selector: 'app-visalgo',
  templateUrl: './visalgo.component.html',
  styleUrls: ['./visalgo.component.css']
})
export class VisalgoComponent implements AfterViewInit {

  @ViewChild("canvasLayer0") baseCanvas;
  @ViewChild("canvasLayer1") midCanvas;
  @ViewChild("canvasLayer2") topCanvas;

  // class variables
	attr = { width: 300, height: 200};
  numItems:number = 24;
	gItemArray = new ItemArray(this.numItems);
	compareSpeed = [200,100,50];
	sortType = "none";
	stack = null;
  speed = 1;
  speeds = [
    { value: 0, label: 'Slow' },
    { value: 1, label: 'Medium' },
    { value: 2, label: 'Fast' }
  ];
	heapSpeed = [1000,500,250];
	timer = null;
	timer2 = null;

  // sort info
  desc:String = "description";
  message:String = "message";
  sortInfo = {
    none: "",
    selectionSort: "<p><a href='http://en.wikipedia.org/wiki/Selection_sort'>From Wikipedia: </a>A simple, in-place comparison sort with O(n^2) complexity.  Generally performs worse than insertion sort.</p><p>The algorithm divides the input list into two parts: the sublist of items already sorted, which is built up from left to right at the front (left) of the list, and the sublist of items remaining to be sorted that occupy the rest of the list. Initially, the sorted sublist is empty and the unsorted sublist is the entire input list. The algorithm proceeds by finding the smallest (or largest, depending on sorting order) element in the unsorted sublist, exchanging it with the leftmost unsorted element (putting it in sorted order), and moving the sublist boundaries one element to the right.</p>",
    bubbleSort: '<p><a href="http://en.wikipedia.org/wiki/Bubble_sort">From Wikipedia: </a>A simple sorting algorithm that works by repeatedly stepping through the list to be sorted, comparing each pair of adjacent items and swapping them if they are in the wrong order. The pass through the list is repeated until no swaps are needed, which indicates that the list is sorted. The algorithm gets its name from the way smaller elements "bubble" to the top of the list. Because it only uses comparisons to operate on elements, it is a comparison sort with 0(n^2) complexity. Although the algorithm is simple, most of the other sorting algorithms are more efficient for large lists.</p><p> The bubble sort algorithm can be easily optimized by observing that the n-th pass finds the n-th largest element and puts it into its final place. So, the inner loop can avoid looking at the last n-1 items when running for the n-th time</p>',
    insertionSort: '<p><a href="http://en.wikipedia.org/wiki/Insertion_sort">From Wikipedia: </a>Insertion sort iterates, consuming one input element each repetition, and growing a sorted output list. Each iteration, insertion sort removes one element from the input data, finds the location it belongs within the sorted list, and inserts it there. It repeats until no input elements remain.</p><p>Sorting is typically done in-place, by iterating up the array, growing the sorted list behind it. At each array-position, it checks the value there against the largest value in the sorted list (which happens to be next to it, in the previous array-position checked). If larger, it leaves the element in place and moves to the next. If smaller, it finds the correct position within the sorted list, shifts all the larger values up to make a space, and inserts into that correct position.</p><p>The resulting array after k iterations has the property where the first k + 1 entries are sorted ("+1" because the first entry is skipped). In each iteration the first remaining entry of the input is removed, and inserted into the result at the correct position, thus extending the result:</p>',
    mergeSort: '<p><a href="http://en.wikipedia.org/wiki/Merge_sort">From Wikipedia: </a>An O(n log n) comparison-based sorting algorithm. Conceptually, a merge sort works as follows:<ol><li>Divide the unsorted list into n sublists, each containing 1 element (a list of 1 element is considered sorted).</li><li>Repeatedly merge sublists to produce new sublists until there is only 1 sublist remaining. This will be the sorted list.</li></ol>This screen shows a bottom-up sort, which begins by assuming the initial array consists of 24 length-1 sublists.  It sorts and merges adjacent sublists, begining with lists that are length 1, then 2, 4, 8, ... until the final width that is the length of the entire array.</p>',
    quickSort: '<p><a href="http://en.wikipedia.org/wiki/Quicksort">From Wikipedia: </a>Quicksort is a divide and conquer algorithm. Quicksort first divides a large list into two smaller sub-lists: the low elements and the high elements. Quicksort can then recursively sort the sub-lists.</p><p>The steps are:</p><ol><li>Pick an element, called a pivot, from the list.</li><li>Reorder the list so that all elements with values less than the pivot come before the pivot, while all elements with values greater than the pivot come after it (equal values can go either way). After this partitioning, the pivot is in its final position. This is called the partition operation.</li><li>Recursively apply the above steps to the sub-list of elements with smaller values and separately the sub-list of elements with greater values.</li></ol><p>The base case of the recursion are lists of size zero or one, which never need to be sorted.</p>',
    heapSort: '<p><a href="http://en.wikipedia.org/wiki/Heapsort">From Wikipedia: </a>The heapsort algorithm can be divided into two parts.</p><p>In the first step, a heap is built out of the data.</p><p>In the second step, a sorted array is created by repeatedly removing the largest element from the heap, and inserting it into the array. The heap is reconstructed after each removal. Once all objects have been removed from the heap, we have a sorted array. The direction of the sorted elements can be varied by choosing a min-heap or max-heap in step one.</p><p>Heapsort can be performed in place. The array can be split into two parts, the sorted array and the heap. The storage of heaps as arrays is diagrammed here. The heap\'s invariant is preserved after each extraction, so the only cost is that of extraction.</p>'
  };

	// graphics class variables
	canvas = new Array();
	context:CanvasRenderingContext2D[] = new Array();

	swapSpeed = [100,50,25];
	flashSpeed = [300,150,75];
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
	lineWidth = 1;
	thickLineWidth = 3;
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

	clearTimer() {
		if (this.timer !== null) {
			clearTimeout(this.timer);
			this.timer = null;
		}
		if (this.timer2 !== null) {
			clearTimeout(this.timer2);
			this.timer2 = null;
		}
	}

  ngAfterViewInit() {

    this.baseCanvas = this.baseCanvas.nativeElement;
    this.midCanvas = this.midCanvas.nativeElement;
    this.topCanvas = this.topCanvas.nativeElement;
		//console.log("canvas: " + this.baseCanvas + " " + this.midCanvas + " " + this.topCanvas);

		// create array to be sorted
		this.gItemArray.create();

    // create a graphics object for the canvas
		this.canvas[0] = this.baseCanvas;
    this.context[0] = this.baseCanvas.getContext("2d");
		this.canvas[1] = this.midCanvas;
    this.context[1] = this.midCanvas.getContext("2d");
		this.canvas[2] = this.topCanvas.nativeElement;
    this.context[2] = this.topCanvas.getContext("2d");

		this.bars = new Array(this.numItems);
		this.sortedBars = new Array(this.numItems);
		this.nodeLocations = new Array(this.numItems);

		this.createBars();
    this.drawScreen(0);
  }

  initSort():void {
    this.gItemArray.reset();
		this.graphicsReset();
  }

  getNewValues() {
    this.gItemArray.create();
		this.graphicsReset();
  }

	setInfo() {
    if (this.sortType === "none") {
      this.message = "";
    } else {
      this.message = "Running " + this.sortType + " sort";
    }
    this.desc = this.sortInfo[this.sortType];
	}

	reset() {
    this.sortType = "none";
    this.clearTimer();
    this.gItemArray.reset(); 
		this.graphicsReset();
    this.setInfo();
  }

  startSort() {
    this.clearTimer();
    this.gItemArray.reset();
    this.graphicsReset();
    this.setInfo();
  }
    
  runSort(type) {
		this.sortType = type;
    this.startSort();
    this[type]();
  }

  selectionSort() {
    this.selSortOuter(-1, 0, this.numItems);			
  }

  bubbleSort() {
    this.bubbleSortOuter(-1, true, 0, this.numItems);			
  }

  insertionSort() {	
    this.insertionSortOuter(-1, 0, this.numItems);
  }

  quickSort() {			
    this.stack = new StackObj();
    this.stack.push(new QuickSortObj(0, this.numItems-1, this.stack.top));
    this.quickSortOuter();
  }

  mergeSort() {			
    this.mergeSortOuter(1, new Array());
  }

  heapSort() {			
    this.drawTree(1, this. textColor, this.activeColor, this.lineColor, 0, ()=> {
      this.buildHeap(Math.floor((this.numItems-2)/2));
    });
        
  }

	/* swaps the values of two array elements */
	swapValues(i, j) {
		this.gItemArray.swap(i,j);
		var temp = this.bars[i];
		this.bars[i] = this.bars[j];
		this.bars[j] = temp;
	}


  /* Note:  Use setTimeout functions (instead of 'sleep') to delay start of next step in sort process in order to allow 
  user to see the change on screen.  After setTimeout is called, processing on current thread continues, which keeps
  the interface from getting tied up waiting for the timer call to execute.  This allows the application to 
  capture and respond to the user pressing other buttons on the screen in the middle of a sort processing.  To
  make it work, no further statements are included in the current function path after a 'setTimeout' call.  */

	/*************************************** Selection Sort ***********************************/
	selSortOuter(i, start, end) {
		i++;
		this.drawInPlaceSort(0, start, end, i, this.sortedColor, this.stdColor);
		if (i < end) {
			this.markSwapBase(0, i);
			this.timer = setTimeout( ()=>{this.selSortInner(i, i, i, start, end);}, this.compareSpeed[this.speed]);
		}
		else {
			this.message = 'Selection sort finished.';
			this.drawInPlaceSort(0, start, end, i, this.sortedColor, this.stdColor);
		}
	}

	selSortInner(i, j, min, start, end) {
		// change previous 'compare' highlight back to standard
		if (j > 0 && j != min) this.drawStandard(0, j);

		// highlight current min
		this.highlightMin(0, min);

		// continue comparisons against current min
		j++;
		if (j < end) {
			this.showNextCompare(0, j);
			if (this.gItemArray.compare(j, min) === -1) {
				this.drawStandard(0, min);
				min = j;
				this.highlightMin(0, min);
			}
			this.timer = setTimeout( ()=>{this.selSortInner(i, j, min, start, end);}, this.compareSpeed[this.speed]);
		}
		else {
			if (i !== min) {
				// pass the function that should be called after the swap animation is complete
				var funct = ()=>{this.swapValues(i, min); this.selSortOuter(i, start, end);}
				this.swapElements(0, 1, i, min, 'min', funct);
			} else {
				this.selSortOuter(i, start, end);
			}
		}
	}

	/**************************** End Selection Sort *****************************************/

	/*************************************** Bubble Sort ***********************************/
	bubbleSortOuter(i, swap, start, end) {
		i++;
		this.drawInPlaceSort(0, start, end, end - i, this.stdColor, this.sortedColor);
		if (swap && i < end) {
			this.timer = setTimeout( ()=>{this.bubbleSortInner(i, -1, false, start, end);}, this.compareSpeed[this.speed]);
		} else {
			this.message = 'Bubble sort finished.';
			this.drawInPlaceSort(0, start, end, -1, this.stdColor, this.sortedColor);
		}
	}

	bubbleSortInner(i, j, swap, start, end) {
		j++;
		this.drawInPlaceSort(0, start, end, end - i, this.stdColor, this.sortedColor);
		if (j < end - i - 1) {
			this.markSwapBase(0, j+1);
			this.showNextCompare(0, j);
			this.showNextCompare(0, j+1);
			if (this.gItemArray.compare(j+1, j) === -1) {
				this.highlightMin(0, j+1);
				// pass the function that should be called after the swap animation is complete
				this.swapElements(0, 1, j, j+1, 'min', ()=> {this.swapValues(j, j+1);this.bubbleSortInner(i, j, true, start, end);});
			} else {
				this.highlightMin(0, j);
				this.timer = setTimeout( ()=>{this.bubbleSortInner(i, j, swap, start, end);}, this.compareSpeed[this.speed]);
			}
		} else {
			this.bubbleSortOuter(i, swap, start, end);
		}
	}

	/**************************** End Bubble Sort *****************************************/

	/*************************************** Insertion Sort ***********************************/
	insertionSortOuter(i, start, end) {
		i++;
		this.drawInPlaceSort(0, start, end, end, this.stdColor, this.sortedColor);
		if (i < end - 1) {
			this.timer = setTimeout( ()=>{this.insertionSortInner(i, i + 1, start, end);}, this.compareSpeed[this.speed]);
		} else {
			this.message = 'Insertion sort finished.';
			this.drawInPlaceSort(0, start, end, -1, this.stdColor, this.sortedColor);
		}
	}

	insertionSortInner(i, j, start, end) {
		this.drawInPlaceSort(0, start, end, end, this.stdColor, this.sortedColor);
		if (j > start) {
			this.markSwapBase(0, j-1);
			this.markRange(0, j);
			this.showNextCompare(0, j);
			this.showNextCompare(0, j-1);
			if (this.gItemArray.compare(j, j-1) === -1) {
				this.highlightMin(0, j);
				// pass the function that should be called after the swap animation is complete
				this.swapElements(0, 1, j-1, j, 'min', ()=> {this.swapValues(j, j-1);this.insertionSortInner(i, j-1, start, end);});
			} else {
				this.highlightMin(0, j-1);
				this.timer = setTimeout( ()=>{this.insertionSortOuter(i, start, end);}, this.compareSpeed[this.speed]);
			}
		} else {
			this.insertionSortOuter(i, start, end);
		}
	}

	/**************************** End Insertion Sort *****************************************/

	/*************************************** QuickSort ***********************************/
	quickSortOuter() {
		var obj = this.stack.pop();
		console.log("obj: left=" + obj.left + ", right=" + obj.right);
		if (obj !== null) {
			console.log("object not null");
			if (obj.left < obj.right) {
				console.log("left < right");
				this.message = 'Choosing new pivot within range ' + obj.left + ' to ' + obj.right;
				var pivot = this.chooseMedian(obj.left, obj.left + Math.floor((obj.right-obj.left)/2), obj.right);
				this.drawDivideAndConquerSort(0, obj.left, obj.right, pivot);
				this.timer = setTimeout( ()=>{this.partition(obj.left, obj.right, pivot, null);}, this.compareSpeed[this.speed]);
			} else {
				console.log("left !< right");
				this.timer = setTimeout( ()=>{this.quickSortOuter();}, this.compareSpeed[this.speed]);
			}
		} else {
			this.message = 'Quicksort finished.';
			this.drawInPlaceSort(0, 0, this.numItems, this.numItems, this.sortedColor, this.stdColor);
		}
	}

	chooseMedian(first, middle, last) {
		console.log("in choosemedian: " + first + ", " + middle + ", " + last);
		if ((this.gItemArray.compare(first, middle) !== 1 && this.gItemArray.compare(middle, last) !== 1) ||
		(this.gItemArray.compare(last, middle) !== 1 && this.gItemArray.compare(middle, first) !== 1)) {
			console.log("return middle");
			return middle;
		} else if ((this.gItemArray.compare(middle, first) !== 1 
		&& this.gItemArray.compare(first, last) !== 1) ||
					(this.gItemArray.compare(last, first) !== 1 
						&& this.gItemArray.compare(first, middle) !== 1)) {
			console.log("return first");
			return first;
		} else {
			console.log("return last");
			return last;
		}
	}

	partition(left, right, pivot, i) {
		console.log("in partition: " + left + ", " + right + ", " + pivot + ", " + i);
		this.markSwapBase(0, pivot);
		if (i == null) {
			// pass the function that should be called after the swap animation is complete
			this.swapElements(0, 1, pivot, right, 'pivot', ()=> {this.swapValues(pivot, right);this.partition(left, right, left, left-1);});
		} 
		else {
			this.message = 'Partitioning elements ' + left + ' to ' + right;
			this.drawDivideAndConquerSort(0, left, right, right);
			this.markSwapBase(0, pivot);
			i++;
			if (i < right) {
				this.showNextCompare(0, i);
				if (this.gItemArray.compare(i, right) === -1) {	
					this.swapElements(0, 1, pivot, i, 'min', ()=> {this.swapValues(pivot, i);this.partition(left, right, pivot+1, i);});
				} else {
					this.timer = setTimeout( ()=>{this.partition(left, right, pivot, i);}, this.compareSpeed[this.speed]);
				}
			} else {
				this.message += '...DONE';		
				this.swapElements(0, 1, pivot, right, 'reversePivot', ()=> {this.swapValues(right, pivot);this.quickSortTail(left, right, pivot);});
			}
		}
	}

	quickSortTail(left, right, pivot) {
		console.log("in quickSortTail");
		/* though the sort is optimized by partitioning the smaller subarray first,
			it's less intuitive to watch the sort "jump around" during animation
			so will always partition the lower subarray first */
		//if (pivot - left < this.gItemArray.length - right) {
			this.stack.push(new QuickSortObj(pivot+1, right, this.stack.top));
			this.stack.push(new QuickSortObj(left, pivot-1, this.stack.top));
		//} else {
		//	stack.push(new QuickSortObj(left, pivot-1, stack.top));
		//	stack.push(new QuickSortObj(pivot+1, right, stack.top));
		//}
		this.quickSortOuter();
	} 


	/**************************** End QuickSort *****************************************/

	/*************************************** MergeSort ***********************************/
	/* Merge sort -- refactor using setTimeouts to allow for animation to be viewed */
	/*
	function mergeSort(sorted) { 

		// starting with runs of 2, sort each run, then double the run length
		// and repeat sort until entire array is merged
		for (var width = 1; width < this.gItemArray.length; width = 2 * width) {
			// call sort on current 'width' run of array
			for (var i = 0; i < this.gItemArray.length; i = i + 2 * width) {
				mergeSubsort(i, Math.min(i+width, this.gItemArray.length), Math.min(i+2*width, this.gItemArray.length), sorted);
			}
			this.gItemArray.elements = sorted.slice(0);
			sorted.length = 0;
		}
		this.drawScreen(0);
	} 

	function mergeSubsort(left, right, end, sorted) {
		// left and right are pointers to the next element in the left and right, respectively, sublists
		var lptr = left, rptr = right;
		for (var i = left; i < end; i++) {
			if (lptr < right && (this.gItemArray.elements[lptr] <= this.gItemArray.elements[rptr] || rptr >= end)) {
				// use Array's slice function to ensure deep copy
				sorted[i] = this.gItemArray.elements[lptr];
				lptr++;
			} else {
				sorted[i] = this.gItemArray.elements[rptr];
				rptr++;
			}
		}
	}
	*/

	mergeSortOuter(width, sorted) { 
		// starting with runs of 2, sort each run, then double the run length
		// and repeat sort until entire array is merged
		if (width < this.numItems) {
			this.mergeSortInner(width, sorted, 0);			
		} else {
			this.message = 'Merge Sort finished.';
			this.drawInPlaceSort(0, 0, this.numItems, this.numItems, this.sortedColor, this.stdColor);
		}
		
	} 

	mergeSortInner(width, sorted, i) {
		if (i < this.numItems) {
			var right = Math.min(i+width, this.numItems);
			var end = Math.min(i+2*width, this.numItems);
			// draw items on baseline, highlighting just the active range
			this.drawDivideAndConquerSort(0, i, end-1, this.numItems);
			// hide the active range
			this.hideRangeOfItems(0, i, end);
			
			
			if (i+width < this.numItems) {
				// even though the left half of the animation could conceivably complete before the right half, which would mean'
				// processing will continue on the sort even if the bars aren't all the way at the top, it's unlikely so for now, I'm
				// going to rely on it not happening enough to cause a problem.  If it does, I'll have to set a conditional to check 
				// before calling 'mergeSubSort' that indicates whether both halves of the sublist have reached their destination points.

				// slide the right half of the active range up
				this.slideRangeOfBars(1, i, width, this.bars[i].x, this.bars[i].y, this.bars[i].x-2, this.startY*0.6, this.stdColor, 1, ()=>{});
				// slide the left half of the active range up
				this.slideRangeOfBars(1, i+width, width, this.bars[i+width].x, this.bars[i+width].y, this.bars[i+width].x+2, this.startY*0.6, this.stdColor, 2, ()=>{this.markDivide(1, right); this.mergeSubsort(i, right, end, sorted, i, i, right);});
			} else {
				// slide the right half of the active range up
				this.slideRangeOfBars(1, i, width, this.bars[i].x, this.bars[i].y, this.bars[i].x-2, this.startY*0.6, this.stdColor, 1,  ()=>{this.markDivide(1, right); this.mergeSubsort(i, right, end, sorted, i, i, right);});
			}
			
		} else {
			// copy the sorted values back to the elements array
			// use Array's slice function to ensure deep copy
			this.gItemArray.updateElements(sorted.slice(0));
			sorted.length = 0;
			this.mergeSortOuter(width*2, sorted);
		}
	}

	mergeSubsort(left, right, end, sorted, i, lptr, rptr) {
		// lptr and rptr are pointers to the next element in the left and right, respectively, sublists
		if (i < end) {
			if (lptr < right) this.drawBar(1, this.bars[lptr].x, this.bars[lptr].y, this.bars[lptr].h, this.compareColor);
			if (rptr < end) this.drawBar(1, this.bars[rptr].x, this.bars[rptr].y, this.bars[rptr].h, this.compareColor);
			if (lptr < right && (this.gItemArray.compare(lptr, rptr) !== 1 || rptr >= end)) {
				sorted[i] = this.gItemArray.get(lptr);
				this.hideBar(1, lptr);
				this.flashAndMoveBar(2, lptr, this.calculateX(i), this.startY, 0, ()=>{this.sortBar(i, lptr); this.mergeSubsort(left, right, end, sorted, i+1, lptr+1, rptr);});
				//timer = setTimeout(()=> {mergeSubsort(left, right, end, sorted, i+1, lptr+1, rptr);}, compareSpeed[speed]);
			} else {
				sorted[i] = this.gItemArray.get(rptr);	
				this.hideBar(1, rptr);
				this.flashAndMoveBar(2, rptr, this.calculateX(i), this.startY, 0, ()=>{this.sortBar(i, rptr); this.mergeSubsort(left, right, end, sorted, i+1, lptr, rptr+1);});
				//timer = setTimeout(()=> {mergeSubsort(left, right, end, sorted, i+1, lptr, rptr+1);}, compareSpeed[speed]);
			}
		} else {
			this.copyBars(left, end);
			this.clearLayer(1);
			this.clearLayer(2);
			this.mergeSortInner(right-left, sorted, left+2*(right-left));
		}
		
	}

	/**************************** End MergeSort *****************************************/

	/*************************************** HeapSort ***********************************/
	
	/* Reorders array as max heap */
	buildHeap(i) {
		this.message = 'Building max heap...';
		if (i >= 0) {
			this.drawNode(1, i, this.textColor, this.compareColor, this.lineColor, this.lineWidth)
			this.timer = setTimeout( ()=>{
				this.drawNode(1, i, this.textColor, this.activeColor, this.lineColor, this.lineWidth);
				this.siftDown(i, this.numItems-1, ()=>{this.buildHeap(i-1);})
			}, this.heapSpeed[this.speed]);
		} else {
			this.heapSortOuter(this.numItems-1);
		}
	}

	heapSortOuter(i) { 
		this.message = 'Sorting array from heap values...';
		// reorder array from min to max
		// swap first element with one less than last sorted element (or
		// last element if first pass) then sift down first element
		if (i > 0) {
			this.hideNode(1, 0);
			this.swapValues(0, i);
			this.swapCoordinates(0, i);
			this.drawSortedItem(0, i);
			this.timer = setTimeout( ()=>{
				this.drawNode(1, 0, this.textColor, this.activeColor, this.lineColor, this.lineWidth);
				this.hideNode(1, i);
				this.timer = setTimeout(()=> {this.siftDown(0, i-1, ()=>{this.heapSortOuter(i-1);});}, this.heapSpeed[this.speed]);
			}, this.heapSpeed[this.speed]);	
		} else {
			this.clearLayer(2);
			this.clearLayer(1);
			this.message = 'Heapsort finished.';
			this.drawInPlaceSort(0, 0, this.numItems, this.numItems, this.sortedColor, this.stdColor);
		}
	} 

	siftDown(start, end, funct) {
		// end is last element
		var swap = start;
		if (2*start + 1 <= end && this.gItemArray.compare(swap, 2*start + 1) === -1) {
			swap =  2*start + 1;
		}
		if (2*start + 2 <= end && this.gItemArray.compare(swap, 2*start + 2) === -1) {
			swap =  2*start + 2;
		}

		if (swap !== start) {
			this.swapValues(swap, start);
			this.markParentChild(1, swap, start, this.textColor, this.nodeHighlight, this.nodeHighlight);
			this.swapCoordinates(swap, start);
			this.timer = setTimeout( ()=>{this.markParentChild(1, swap, start, this.textColor, this.activeColor, this.lineColor); this.siftDown(swap, end, funct);}, this.heapSpeed[this.speed]);
		} else {
			// placeholder
			this.timer = setTimeout( ()=>{funct();}, this.heapSpeed[this.speed]);
		}
	}

	/**************************** End HeapSort *****************************************/

	/************************ Graphics Functions ****************************/
	
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
			var xGap = Math.floor(this.attr.width / Math.pow(2,level));
			this.nodeLocations[i] = {l: level, x: xGap*(i - (sum - iPerRow)) + 0.5*xGap, y: yGap*0.5 + yGap*level};
			//this.bars[i] = new this.bar(this.calculateX(i), this.startY, this.calculateHt(i));
		}
	}

	graphicsReset() {
		this.resetBars();
		for (var i = 0; i < this.context.length; i++) {
			this.clearLayer(i);
		}
		this.drawScreen(0);
	}

	resetBars() {
		for (var i = 0; i < this.numItems; i++) {
			this.bars[i].x = this.calculateX(i);
			this.bars[i].y = this.startY;
			this.bars[i].h = this.calculateHt(i);
			this.bars[i].v = this.gItemArray.get(i);
		}
	}

	/* store a canvas and context for a layer */
	setCanvasLayer(layerNo, canvasId) {
		if (!isNaN(layerNo)) {
			this.canvas.splice(layerNo, 0, canvasId);
			var cxt = this.canvas[layerNo].getContext('2d');
			this.context.splice(layerNo, 0, cxt);
		}
	}

	/* clear a layer's entire canvas */
	clearLayer(layer) {
		this.context[layer].clearRect(0, 0, this.attr.width, this.attr.height);
	}

	/* draw the entire array of items in base color on the baseline and with labels */
	drawScreen(layer) {
		this.context[layer].clearRect(0, 0, this.attr.width, this.attr.height);

		// draw bars & labels
		for (var i = 0; i < this.numItems; i++) {
			this.drawItem(layer, i, this.stdColor);
		}
	}

	/* draw the horizontal line on which the item bars sit */
	drawBaseline(layer) {
		this.context[layer].beginPath();
		this.context[layer].strokeStyle = this.lineColor;
		this.context[layer].lineWidth = this.lineWidth;
		this.context[layer].moveTo(this.startX, this.startY+1);
		this.context[layer].lineTo(this.attr.width - this.startX, this.startY+1);
		this.context[layer].stroke();
		this.context[layer].closePath();
	}

	/* draw the item bars, coloring them according to which are already sorted and which
		remain to be sorted
	*/
	drawInPlaceSort(layer, start, end, switchPt, lowColor, hiColor) {
		this.context[layer].clearRect(0, 0, this.attr.width, this.attr.height);

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
	drawDivideAndConquerSort(layer, left, right, pivot) {
		this.context[layer].clearRect(0, 0, this.attr.width, this.attr.height);
		this.clearSwapBaseMark(0);
		this.markRange(0, left);
		this.markRange(0, right);

		for (var k = 0; k < this.numItems; k++) {
			var color = this.activeColor;
			if (k == pivot) color = this.pivotColor;
			else if (k < left || k > right) color = this.inactiveColor;
			this.drawItem(layer, k, color);
		}
	}

	/* Slide a range of bars */
/*	this.slideRangeOfBars(layer, left, barCt, startX, startY, currX, currY, endX, endY, color, funct)  {
		//this.context[layer].clearRect(0, 0, this.attr.width, this.attr.height);	
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

	slideRangeOfBars(layer, left, barCt, startX, startY, endX, endY, color, whichTimer, funct)  {
		
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
				this.timer = setTimeout(()=> {this.slideRangeOfBars(layer, left, barCt, startX, startY, endX, endY, color, 1, funct);}, this.swapSpeed[this.speed]);
			else 
				this.timer2 = setTimeout(()=> {this.slideRangeOfBars(layer, left, barCt, startX, startY, endX, endY, color, 2, funct);}, this.swapSpeed[this.speed]);
		} else {
			funct();
		}		
	}

	flashAndMoveBar(layer, bar, endX, endY, nComplete, funct) {
		if (nComplete > 2) {
			// flashing complete, move
			this.hideBar(layer, bar);
			this.drawBar(layer, endX, endY, this.bars[bar].h, this.stdColor);
			this.timer = setTimeout(()=> {funct();}, this.compareSpeed[this.speed]);
		} else {
			var color = this.compareColor;
			if (nComplete % 2 == 0) {
				color = this.minColor;
			} 
			this.drawBar(layer, this.bars[bar].x, this.bars[bar].y, this.bars[bar].h, color);
			this.timer = setTimeout(()=> {this.flashAndMoveBar(layer, bar, endX, endY, nComplete+1, funct);}, this.flashSpeed[this.speed]);
		}
	}

	sortBar(i, old) {
		this.sortedBars[i] = this.bars[old];
		this.sortedBars[i].x = this.calculateX(i);
		this.sortedBars[i].y = this.startY;
	}

	copyBars(left, end) {
		var temp = this.bars.slice(0, left).concat(this.sortedBars.slice(left, end)).concat(this.bars.slice(end));
		this.bars = temp;
	}

	/* swap the coordinates of two bars */
	swapCoordinates(i, j) {
		var tempX = this.bars[i].x;
		var tempY = this.bars[i].y;
		this.bars[i].x = this.bars[j].x;
		this.bars[i].y = this.bars[j].y;
		this.bars[j].x = tempX;
		this.bars[j].y = tempY;
	}		

	/* move a bar from its current coordinates to new coordinates */
	moveBar(layer, idx, newX, newY, color) {
		//var ht = this.calculateHt(idx);
		this.hideBar(layer, idx);
		this.bars[idx].x = newX;
		this.bars[idx].y = newY;
		this.drawBar(layer, this.bars[idx].x, this.bars[idx].y, this.bars[idx].h, color);
	}

	/* hide a range of bars */
	hideRangeOfItems(layer, start, end) {
		for (var i = start; i < end; i++) {
			this.hideItem(layer, i);
		}
	}


	/* (re)draw a bar, its label, and the baseline on which it sits */
	drawItem(layer, i, color) {
		this.context[layer].clearRect(this.bars[i].x, this.arrowHt + this.arrowY, this.barWd, this.startY);
		this.drawBar(layer, this.bars[i].x, this.bars[i].y, this.bars[i].h, color);
		this.drawLabel(layer, i, color);
		this.drawBaseline(layer);
	}

	/* hide the bars, usually in the base layer, that are going to be moving in an animation */
	hideItem(layer, i) {
		this.context[layer].clearRect(this.bars[i].x-this.barWd/2, this.arrowHt + this.arrowY, this.barWd*2, this.startY);
		this.drawBaseline(layer);
	}

	hideBar(layer, idx) {
		this.context[layer].clearRect(this.bars[idx].x-this.barWd/4, this.bars[idx].y-this.bars[idx].h-2, this.barWd*1.5, this.bars[idx].h+4);
	}

	/* calculate the lower left X position of a bar based on its index in the array */
	calculateX(i) {
		return this.startX + this.barWd/2 + (this.barWd * 2 * i);
	}

	/* calculate the height of a bar based on its value */
	calculateHt(i) {
		let v = this.gItemArray.get(i);
		let ht = this.maxHeight * (v / this.numItems);
		return ht;
	}

	/* calculate the level in the tree at which an element's node should be displayed based on the index of the element in the array */
	calculateLevel(idx) {
		var level = 0, sum = 1;
		while (idx >= sum)  {
			level++;
			sum += Math.pow(2,level);
		}
		return level;
	}

	/* draw a bar */
	drawBar(layer, x, y, ht, color) {
		//this.context[layer].clearRect(x, this.arrowHt + this.arrowY, this.barWd, this.startY);
		this.context[layer].beginPath();
		this.context[layer].fillStyle = color;
		this.context[layer].rect(x, y - ht, this.barWd, ht);
		this.context[layer].stroke();
		this.context[layer].fill();
		this.context[layer].closePath();
	}

	/* draw a bar's label */
	drawLabel(layer, i, color) {
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
	drawNode(layer, i, textColor, fillColor, lineColor, lineWd) {
		var offset = this.bars[i].v.toString().length*2.5;
		this.context[layer].beginPath();
		this.context[layer].font = this.nodeFont;
		this.context[layer].fillStyle = fillColor;
		this.context[layer].strokeStyle = lineColor;
		this.context[layer].lineWidth = lineWd;
		this.context[layer].arc(this.nodeLocations[i].x, this.nodeLocations[i].y, 8, 0, 360, true);
		this.context[layer].stroke();
		this.context[layer].fill();
		this.context[layer].fillStyle = textColor;
		this.context[layer].fillText(this.bars[i].v.toString(), this.nodeLocations[i].x-offset, this.nodeLocations[i].y+3);
		this.context[layer].closePath();
	}

	/* draw all tree branches */
 	drawBranches(layer) {
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
	drawBranch(layer, parent, child, color) {
		this.context[layer].beginPath();
		this.context[layer].strokeStyle = color;
		this.context[layer].moveTo(this.nodeLocations[parent].x, this.nodeLocations[parent].y);
		this.context[layer].lineTo(this.nodeLocations[child].x, this.nodeLocations[child].y);
		this.context[layer].stroke();
		this.context[layer].closePath();
	}

	/* draw all nodes in the active color */
	drawNodesActive(layer) {
		for (var i = 0; i < this.numItems; i++) {
			this.drawNode(layer, i, this.textColor, this.activeColor, this.lineColor, this.lineWidth);
		}
	}

	/* draw the tree, one node at a time */
	drawTree(layer, textColor, fillColor, lineColor, i, funct) {
		if (i < this.numItems) {
			this.hideItem(0, i);
			if (i%2 === 0 && (i-2)/2 >= 0) {
				this.markParentChild(layer, (i-2)/2, i, textColor, fillColor, lineColor);
			} else if (i%2 !== 0 && (i-1)/2 >= 0) {
				this.markParentChild(layer, (i-1)/2, i, textColor, fillColor, lineColor);
			}
			else this.drawNode(layer, i, textColor, fillColor, lineColor, this.lineWidth);
			this.timer = setTimeout(()=> {this.drawTree(layer, textColor, fillColor, lineColor, i+1, funct);}, this.heapSpeed[this.speed]);
		} else {
			funct();
		}
	}

	/* color a parent-child relationship */
	markParentChild(layer, parent, child, textColor, fillColor, lineColor) {
		this.drawBranch(layer, parent, child, lineColor);
		this.drawNode(layer, parent, textColor, fillColor, lineColor, this.lineWidth);
		this.drawNode(layer, child, textColor, fillColor, lineColor, this.lineWidth);	
	}

	/* Hide a node and branch to it */
	hideNode(layer, node) {
		if (node >= 0 && node < this.numItems) {
			this.drawNode(layer, node, this.backgroundColor, this.backgroundColor, this.backgroundColor, this.thickLineWidth);
			if (node%2 === 0 && (node-2)/2 >= 0) {
				this.drawBranch(layer, (node-2)/2, node, this.backgroundColor);
				this.drawNode(layer, (node-2)/2, this.textColor, this.activeColor, this.lineColor, this.lineWidth);
			} else if (node%2 !== 0 && (node-1)/2 >= 0) {
				this.drawBranch(layer, (node-1)/2, node, this.backgroundColor);
				this.drawNode(layer, (node-1)/2, this.textColor, this.activeColor, this.lineColor, this.lineWidth);
			}
		}
	}

	/* draw a black arrow pointing to a bar that is being compared and/or swapped */
	markSwapBase(layer, i) {
		var x = this.calculateX(i);
		this.drawDownArrow(layer, x, this.arrowY, "black");
	}

	markRange(layer, i) {
		var x = this.calculateX(i);
		this.drawDownArrow(layer, x, this.arrowY, this.activeColor);
	}

	markDivide(layer, r) {
		if (r < this.numItems) {
			this.context[layer].strokeStyle = this.divideColor;
			this.context[layer].lineWidth = this.lineWidth;
			this.context[layer].beginPath();
			this.context[layer].moveTo(this.bars[r].x-2-this.barWd/2, this.bars[r].y);
			this.context[layer].lineTo(this.bars[r].x-2-this.barWd/2, this.bars[r].y-this.maxHeight);
			this.context[layer].stroke();
			this.context[layer].closePath();
		}
		
	}

	/* hide a black arrow */
	clearSwapBaseMark(layer) {
		this.context[layer].clearRect(0, 0, this.attr.width, this.arrowY+this.arrowHt);
	}

	/* draw a bar and its label using the color that denotes the item has already been sorted */
	drawSortedItem(layer, i) {
		this.drawItem(layer, i, this.sortedColor);
	}

	/* draw a bar and its label using the color that denotes it is the current minimum value */
	highlightMin(layer, min) {
		this.drawItem(layer, min, this.minColor);
	}

	/* draw a bar and its label using the color that denotes it is the current minimum value */
	highlightPivotPoint(layer, pivot) {
		this.drawItem(layer, pivot, this.pivotPtColor);
	}

	/* draw a bar and its label using the base (unsorted) color */
	drawStandard(layer, i) {
		this.drawItem(layer, i, this.stdColor);
	}

	/* draw and bar and its label using the color that denotes it is part of the current comparison */
	showNextCompare(layer, i) {
		this.drawItem(layer, i, this.compareColor);
	}

	/* draw a black arrow that points downward */
	drawDownArrow(layer, x,y,color) {
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
	swapElements(baseLayer, swapLayer, i, j, type, funct) {

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
	slideBars(layer, dir, i, j, icolor, jcolor, nComplete, funct) {
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
				
				this.timer = setTimeout(()=>{this.slideBars(layer, "up", i, j, icolor, jcolor, nComplete+1, funct);}, this.swapSpeed[this.speed]);
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
				this.drawBar(layer, this.bars[i].x, this.bars[i].y, this.bars[i].h, icolor);
				this.drawBar(layer, this.bars[j].x, this.bars[j].y, this.bars[j].h, jcolor);
				this.timer = setTimeout(()=>{this.slideBars(layer, "side", i, j, icolor, jcolor, nComplete+1, funct);}, this.swapSpeed[this.speed]);
			} else {
				this.slideBars(layer, "down", i, j, icolor, jcolor, 0, funct);
			}
		} else if (dir == "down") {
			if (nComplete < 5) {
				if (i != j) {
					this.hideBar(layer, i);
					this.bars[i].y += nComplete;
					this.drawBar(layer, this.bars[i].x, this.bars[i].y, this.bars[i].h, icolor);
				}
				this.hideBar(layer, j);
				this.bars[j].y += nComplete;
				this.drawBar(layer, this.bars[j].x, this.bars[j].y, this.bars[j].h, jcolor);
				this.timer = setTimeout(()=>{this.slideBars(layer, "down", i, j, icolor, jcolor, nComplete+1, funct);}, this.swapSpeed[this.speed]);
			} else {
				this.bars[i].y = this.startY;
				this.bars[j].y = this.startY;
				funct();
			}
		}
	}

}  // end VisalgoComponent Class

  /* stack for simulating recursive sorts */
class	QuickSortObj {
  right:number;
  left:number;
  next:QuickSortObj;

  constructor(left, right, next) {
    this.right = right;
    this.left = left;
    this.next = next;
  }

}

class	StackObj {
  top:QuickSortObj = null;

  push(obj) {
    this.top = obj;
  }

  pop() {
    var obj = this.top;
    if (this.top !== null) {
      this.top = this.top.next;
    } 
    return obj;
  }
}

