import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ItemArray } from './item-array';
import { GraphicsControl } from './graphics-control';

@Component({
  selector: 'app-visalgo',
  templateUrl: './visalgo.component.html',
  styleUrls: ['./visalgo.component.css']
})
export class VisalgoComponent implements AfterViewInit {

  @ViewChild("canvasLayer0") baseCanvas;
  @ViewChild("canvasLayer1") midCanvas;
  @ViewChild("canvasLayer1") topCanvas;

  // class variables
  numItems:number = 24;
	gItemArray = new ItemArray(this.numItems);
	gGraphics = null;
	timer = null;
	timer2 = null;
	compareSpeed = [200,100,50];
	sortType = "none";
	stack = null;
  speed = 1;
  speeds = [
    { value: 0, label: 'Slow' },
    { value: 1, label: 'Medium' },
    { value: 2, label: 'Fast' }
  ];

  // sort info
  desc:String;
  message:String;
  sortInfo = {
    none: "",
    selection: "<p><a href='http://en.wikipedia.org/wiki/Selection_sort'>From Wikipedia: </a>A simple, in-place comparison sort with O(n^2) complexity.  Generally performs worse than insertion sort.</p><p>The algorithm divides the input list into two parts: the sublist of items already sorted, which is built up from left to right at the front (left) of the list, and the sublist of items remaining to be sorted that occupy the rest of the list. Initially, the sorted sublist is empty and the unsorted sublist is the entire input list. The algorithm proceeds by finding the smallest (or largest, depending on sorting order) element in the unsorted sublist, exchanging it with the leftmost unsorted element (putting it in sorted order), and moving the sublist boundaries one element to the right.</p>",
    bubble: '<p><a href="http://en.wikipedia.org/wiki/Bubble_sort">From Wikipedia: </a>A simple sorting algorithm that works by repeatedly stepping through the list to be sorted, comparing each pair of adjacent items and swapping them if they are in the wrong order. The pass through the list is repeated until no swaps are needed, which indicates that the list is sorted. The algorithm gets its name from the way smaller elements "bubble" to the top of the list. Because it only uses comparisons to operate on elements, it is a comparison sort with 0(n^2) complexity. Although the algorithm is simple, most of the other sorting algorithms are more efficient for large lists.</p><p> The bubble sort algorithm can be easily optimized by observing that the n-th pass finds the n-th largest element and puts it into its final place. So, the inner loop can avoid looking at the last n-1 items when running for the n-th time</p>',
    insertion: '<p><a href="http://en.wikipedia.org/wiki/Insertion_sort">From Wikipedia: </a>Insertion sort iterates, consuming one input element each repetition, and growing a sorted output list. Each iteration, insertion sort removes one element from the input data, finds the location it belongs within the sorted list, and inserts it there. It repeats until no input elements remain.</p><p>Sorting is typically done in-place, by iterating up the array, growing the sorted list behind it. At each array-position, it checks the value there against the largest value in the sorted list (which happens to be next to it, in the previous array-position checked). If larger, it leaves the element in place and moves to the next. If smaller, it finds the correct position within the sorted list, shifts all the larger values up to make a space, and inserts into that correct position.</p><p>The resulting array after k iterations has the property where the first k + 1 entries are sorted ("+1" because the first entry is skipped). In each iteration the first remaining entry of the input is removed, and inserted into the result at the correct position, thus extending the result:</p>',
    merge: '<p><a href="http://en.wikipedia.org/wiki/Merge_sort">From Wikipedia: </a>An O(n log n) comparison-based sorting algorithm. Conceptually, a merge sort works as follows:<ol><li>Divide the unsorted list into n sublists, each containing 1 element (a list of 1 element is considered sorted).</li><li>Repeatedly merge sublists to produce new sublists until there is only 1 sublist remaining. This will be the sorted list.</li></ol>This screen shows a bottom-up sort, which begins by assuming the initial array consists of 24 length-1 sublists.  It sorts and merges adjacent sublists, begining with lists that are length 1, then 2, 4, 8, ... until the final width that is the length of the entire array.</p>',
    quick: '<p><a href="http://en.wikipedia.org/wiki/Quicksort">From Wikipedia: </a>Quicksort is a divide and conquer algorithm. Quicksort first divides a large list into two smaller sub-lists: the low elements and the high elements. Quicksort can then recursively sort the sub-lists.</p><p>The steps are:</p><ol><li>Pick an element, called a pivot, from the list.</li><li>Reorder the list so that all elements with values less than the pivot come before the pivot, while all elements with values greater than the pivot come after it (equal values can go either way). After this partitioning, the pivot is in its final position. This is called the partition operation.</li><li>Recursively apply the above steps to the sub-list of elements with smaller values and separately the sub-list of elements with greater values.</li></ol><p>The base case of the recursion are lists of size zero or one, which never need to be sorted.</p>',
    heap: '<p><a href="http://en.wikipedia.org/wiki/Heapsort">From Wikipedia: </a>The heapsort algorithm can be divided into two parts.</p><p>In the first step, a heap is built out of the data.</p><p>In the second step, a sorted array is created by repeatedly removing the largest element from the heap, and inserting it into the array. The heap is reconstructed after each removal. Once all objects have been removed from the heap, we have a sorted array. The direction of the sorted elements can be varied by choosing a min-heap or max-heap in step one.</p><p>Heapsort can be performed in place. The array can be split into two parts, the sorted array and the heap. The storage of heaps as arrays is diagrammed here. The heap\'s invariant is preserved after each extraction, so the only cost is that of extraction.</p>'
  };

  ngAfterViewInit() {

    this.baseCanvas = this.baseCanvas.nativeElement;
    this.midCanvas = this.midCanvas.nativeElement;
    this.topCanvas = this.topCanvas.nativeElement;

		// create array to be sorted
		this.gItemArray.create();

    // create a graphics object for the canvas
		this.gGraphics = new GraphicsControl(this.numItems, this.gItemArray, this.baseCanvas, this.midCanvas, this.topCanvas);
		this.gGraphics.createBars();
    this.gGraphics.drawScreen(0);
  }

  initSort():void {
    this.gItemArray.reset();
		this.gGraphics.reset();
  }

  getNewValues() {
    this.gItemArray.create();
		this.gGraphics.reset();
  }

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
    this.setInfo();
  }

  startSort() {
    this.clearTimer();
    this.gItemArray.reset();
    this.gGraphics.reset();
    this.setInfo = this.sortInfo[this.sortType];
  }
    
  runSort(type) {
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
    this.gGraphics.drawTree(1, this.gGraphics.textColor, this.gGraphics.activeColor, this.gGraphics.lineColor, 0, function() {
      this.buildHeap(Math.floor((this.numItems-2)/2));
    });
        
  }

	/* swaps the values of two array elements */
	swapValues(i, j) {
		this.gItemArray.swap(i,j);
		var temp = this.gGraphics.bars[i];
		this.gGraphics.bars[i] = this.gGraphics.bars[j];
		this.gGraphics.bars[j] = temp;
	}


  /* Note:  Use setTimeout functions (instead of 'sleep') to delay start of next step in sort process in order to allow 
  user to see the change on screen.  After setTimeout is called, processing on current thread continues, which keeps
  the interface from getting tied up waiting for the timer call to execute.  This allows the application to 
  capture and respond to the user pressing other buttons on the screen in the middle of a sort processing.  To
  make it work, no further statements are included in the current function path after a 'setTimeout' call.  */

	/*************************************** Selection Sort ***********************************/
	/* Selection Sort -- refactored into separate 'outer' and 'inner' functions 
		called using setTimeout) */
	/*	function selectionSortOuter() {
		for (var i = 0; i < this.gItemArray.length - 1; i++) {
			var min = i;
			for (var j = i+1; j < this.gItemArray.length; j++) {
				if (this.gItemArray.elements[j] < this.gItemArray.elements[min]) {
					min = j;
				}
			}
			swapValues(i, min);
		}
		this.gGraphics.drawScreen(0);
	} */

	selSortOuter(i, start, end) {
		i++;
		this.gGraphics.drawInPlaceSort(0, start, end, i, this.gGraphics.sortedColor, this.gGraphics.stdColor);
		if (i < end) {
			this.gGraphics.markSwapBase(0, i);
			this.timer = setTimeout(function() {this.selSortInner(i, i, i, start, end);}, this.compareSpeed[this.speed]);
		}
		else {
			this.message = 'Selection sort finished.';
			this.gGraphics.drawInPlaceSort(0, start, end, i, this.gGraphics.sortedColor, this.gGraphics.stdColor);
		}
	}

	selSortInner(i, j, min, start, end) {
		// change previous 'compare' highlight back to standard
		if (j > 0 && j != min) this.gGraphics.drawStandard(0, j);

		// highlight current min
		this.gGraphics.highlightMin(0, min);

		// continue comparisons against current min
		j++;
		if (j < end) {
			this.gGraphics.showNextCompare(0, j);
			if (this.gItemArray.compare(j, min) === -1) {
				this.gGraphics.drawStandard(0, min);
				min = j;
				this.gGraphics.highlightMin(0, min);
			}
			this.timer = setTimeout(function() {this.selSortInner(i, j, min, start, end);}, this.compareSpeed[this.speed]);
		}
		else {
			if (i !== min) {
				// pass the function that should be called after the swap animation is complete
				var funct = function() {this.swapValues(i, min); this.selSortOuter(i, start, end);}
				this.gGraphics.swapElements(0, 1, i, min, 'min', funct);
			} else {
				this.selSortOuter(i, start, end);
			}
		}
	}

	/**************************** End Selection Sort *****************************************/

	/*************************************** Bubble Sort ***********************************/
	/* Bubble Sort -- refactor using setTimeouts to allow for animation to be viewed */
	/*function bubbleSortOuter() {
		var swap = false;
		for (var i = 0; i < this.gItemArray.length; i++) {
			for (var j = 0; j < this.gItemArray.length - 1; j++) {
				if (this.gItemArray.elements[j+1] < this.gItemArray.elements[j]) {
					swapValues(j, j+1);
					swap = true;
				}
			}
			if (!swap) break;
		}
		this.gGraphics.drawScreen(0);
	}*/

	/* Bubble Sort */
	bubbleSortOuter(i, swap, start, end) {
		i++;
		this.gGraphics.drawInPlaceSort(0, start, end, end - i, this.gGraphics.stdColor, this.gGraphics.sortedColor);
		if (swap && i < end) {
			this.timer = setTimeout(function() {this.bubbleSortInner(i, -1, false, start, end);}, this.compareSpeed[this.speed]);
		} else {
			this.message = 'Bubble sort finished.';
			this.gGraphics.drawInPlaceSort(0, start, end, -1, this.gGraphics.stdColor, this.gGraphics.sortedColor);
		}
	}

	bubbleSortInner(i, j, swap, start, end) {
		j++;
		this.gGraphics.drawInPlaceSort(0, start, end, end - i, this.gGraphics.stdColor, this.gGraphics.sortedColor);
		if (j < end - i - 1) {
			this.gGraphics.markSwapBase(0, j+1);
			this.gGraphics.showNextCompare(0, j);
			this.gGraphics.showNextCompare(0, j+1);
			if (this.gItemArray.compare(j+1, j) === -1) {
				this.gGraphics.highlightMin(0, j+1);
				// pass the function that should be called after the swap animation is complete
				this.gGraphics.swapElements(0, 1, j, j+1, 'min', function() {this.swapValues(j, j+1);this.bubbleSortInner(i, j, true, start, end);});
			} else {
				this.gGraphics.highlightMin(0, j);
				this.timer = setTimeout(function() {this.bubbleSortInner(i, j, swap, start, end);}, this.compareSpeed[this.speed]);
			}
		} else {
			this.bubbleSortOuter(i, swap, start, end);
		}
	}

	/**************************** End Bubble Sort *****************************************/

	/*************************************** Insertion Sort ***********************************/
	/* Insertion sort -- refactor using setTimeouts to allow for animation to be viewed */
	/*
	function insertionSortOuter() {
		for (var i = 0; i < this.gItemArray.length - 1; i++) {
			for (var j = i + 1; j > 0; j--) {
				if (this.gItemArray.elements[j] >= this.gItemArray.elements[j-1]) break;
				swapValues(j, j-1);
			}
		}
		this.gGraphics.drawScreen(0);
	} */

	insertionSortOuter(i, start, end) {
		i++;
		this.gGraphics.drawInPlaceSort(0, start, end, end, this.gGraphics.stdColor, this.gGraphics.sortedColor);
		if (i < end - 1) {
			this.timer = setTimeout(function() {this.insertionSortInner(i, i + 1, start, end);}, this.compareSpeed[this.speed]);
		} else {
			this.message = 'Insertion sort finished.';
			this.gGraphics.drawInPlaceSort(0, start, end, -1, this.gGraphics.stdColor, this.gGraphics.sortedColor);
		}
	}

	insertionSortInner(i, j, start, end) {
		this.gGraphics.drawInPlaceSort(0, start, end, end, this.gGraphics.stdColor, this.gGraphics.sortedColor);
		if (j > start) {
			this.gGraphics.markSwapBase(0, j-1);
			this.gGraphics.markRange(0, j);
			this.gGraphics.showNextCompare(0, j);
			this.gGraphics.showNextCompare(0, j-1);
			if (this.gItemArray.compare(j, j-1) === -1) {
				this.gGraphics.highlightMin(0, j);
				// pass the function that should be called after the swap animation is complete
				this.gGraphics.swapElements(0, 1, j-1, j, 'min', function() {this.swapValues(j, j-1);this.insertionSortInner(i, j-1, start, end);});
			} else {
				this.gGraphics.highlightMin(0, j-1);
				this.timer = setTimeout(function() {this.insertionSortOuter(i, start, end);}, this.compareSpeed[this.speed]);
			}
		} else {
			this.insertionSortOuter(i, start, end);
		}
	}

	/**************************** End Insertion Sort *****************************************/

	/*************************************** QuickSort ***********************************/
	/* Quick sort -- refactor using setTimeouts to allow for animation to be viewed */
	/*
	function quickSort(left, right) { 
		if (left < right) {
			var pivot = chooseMedian(left, left + Math.floor((right-left)/2), right);
			pivot = partition(left, right, pivot);
			if (pivot - left < this.gItemArray.length - right) {
				quickSort(left, pivot-1);
				quickSort(pivot+1, right);
			} else {
				quickSort(pivot+1, right);
				quickSort(left, pivot-1);
			}
		}
		this.gGraphics.drawScreen(0);
	} 

	function chooseMedian(first, middle, last) {
		if ((this.gItemArray.elements[first] <= this.gItemArray.elements[middle] && this.gItemArray.elements[middle] <= this.gItemArray.elements[last]) ||
			(this.gItemArray.elements[last] <= this.gItemArray.elements[middle] && this.gItemArray.elements[middle] <= this.gItemArray.elements[first])) {
			return middle;
		} else if ((this.gItemArray.elements[middle] <= this.gItemArray.elements[first] 
						&& this.gItemArray.elements[first] <= this.gItemArray.elements[last]) ||
					(this.gItemArray.elements[last] <= this.gItemArray.elements[first] 
						&& this.gItemArray.elements[first] <= this.gItemArray.elements[middle])) {
			return first;
		} else {
			return last;
		}
	}

	function partition(left, right, pivot) {
		swapValues(pivot, right);
		pivot = left;
		for (var i = left; i < right; i++) {
			if (this.gItemArray.elements[i] < this.gItemArray.elements[right]) {
				swapValues(pivot, i);
				pivot++;
			}
		}
		swapValues(right, pivot);
		return pivot;
	}
	*/

	/* Need to use stack to simulate recursion.  Can't use actual recursion because need to use setTimeout for
		animation, which means calls have to be sequential.
	*/

	quickSortOuter() {
		var obj = this.stack.pop();
		if (obj !== null) {
			if (obj.left < obj.right) {
				this.message = 'Choosing new pivot within range ' + obj.left + ' to ' + obj.right;
				var pivot = this.chooseMedian(obj.left, obj.left + Math.floor((obj.right-obj.left)/2), obj.right);
				this.gGraphics.drawDivideAndConquerSort(0, obj.left, obj.right, pivot);
				this.timer = setTimeout(function() {this.partition(obj.left, obj.right, pivot, null);}, this.compareSpeed[this.speed]);
			} else {
				this.timer = setTimeout(function() {this.quickSortOuter();}, this.compareSpeed[this.speed]);
			}
		} else {
			this.message = 'Quicksort finished.';
			this.gGraphics.drawInPlaceSort(0, 0, this.numItems, this.numItems, this.gGraphics.sortedColor, this.gGraphics.stdColor);
		}
	}

	chooseMedian(first, middle, last) {
		if ((this.gItemArray.compare(first, middle) !== 1 && this.gItemArray.compare(middle, last) !== 1) ||
		(this.gItemArray.compare(last, middle) !== 1 && this.gItemArray.compare(middle, first) !== 1)) {
			return middle;
		} else if ((this.gItemArray.compare(middle, first) !== 1 
		&& this.gItemArray.compare(first, last) !== 1) ||
					(this.gItemArray.compare(last, first) !== 1 
						&& this.gItemArray.compare(first, middle) !== 1)) {
			return first;
		} else {
			return last;
		}
	}

	partition(left, right, pivot, i) {
		this.gGraphics.markSwapBase(0, pivot);
		if (i == null) {
			// pass the function that should be called after the swap animation is complete
			this.gGraphics.swapElements(0, 1, pivot, right, 'pivot', function() {this.swapValues(pivot, right);this.partition(left, right, left, left-1);});
		} 
		else {
			this.message = 'Partitioning elements ' + left + ' to ' + right;
			this.gGraphics.drawDivideAndConquerSort(0, left, right, right);
			this.gGraphics.markSwapBase(0, pivot);
			i++;
			if (i < right) {
				this.gGraphics.showNextCompare(0, i);
				if (this.gItemArray.compare(i, right) === -1) {	
					this.gGraphics.swapElements(0, 1, pivot, i, 'min', function() {this.swapValues(pivot, i);this.partition(left, right, pivot+1, i);});
				} else {
					this.timer = setTimeout(function() {this.partition(left, right, pivot, i);}, this.compareSpeed[this.speed]);
				}
			} else {
				this.message += '...DONE';		
				this.gGraphics.swapElements(0, 1, pivot, right, 'reversePivot', function() {this.swapValues(right, pivot);this.quickSortTail(left, right, pivot);});
			}
		}
	}

	quickSortTail(left, right, pivot) {
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
		this.gGraphics.drawScreen(0);
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
			this.gGraphics.drawInPlaceSort(0, 0, this.numItems, this.numItems, this.gGraphics.sortedColor, this.gGraphics.stdColor);
		}
		
	} 

	mergeSortInner(width, sorted, i) {
		if (i < this.numItems) {
			var right = Math.min(i+width, this.numItems);
			var end = Math.min(i+2*width, this.numItems);
			// draw items on baseline, highlighting just the active range
			this.gGraphics.drawDivideAndConquerSort(0, i, end-1, this.numItems);
			// hide the active range
			this.gGraphics.hideRangeOfItems(0, i, end);
			
			
			if (i+width < this.numItems) {
				// even though the left half of the animation could conceivably complete before the right half, which would mean'
				// processing will continue on the sort even if the bars aren't all the way at the top, it's unlikely so for now, I'm
				// going to rely on it not happening enough to cause a problem.  If it does, I'll have to set a conditional to check 
				// before calling 'mergeSubSort' that indicates whether both halves of the sublist have reached their destination points.

				// slide the right half of the active range up
				this.gGraphics.slideRangeOfBars(1, i, width, this.gGraphics.bars[i].x, this.gGraphics.bars[i].y, this.gGraphics.bars[i].x-2, this.gGraphics.startY*0.6, this.gGraphics.stdColor, 1, function(){});
				// slide the left half of the active range up
				this.gGraphics.slideRangeOfBars(1, i+width, width, this.gGraphics.bars[i+width].x, this.gGraphics.bars[i+width].y, this.gGraphics.bars[i+width].x+2, this.gGraphics.startY*0.6, this.gGraphics.stdColor, 2, function(){this.gGraphics.markDivide(1, right); this.mergeSubsort(i, right, end, sorted, i, i, right);});
			} else {
				// slide the right half of the active range up
				this.gGraphics.slideRangeOfBars(1, i, width, this.gGraphics.bars[i].x, this.gGraphics.bars[i].y, this.gGraphics.bars[i].x-2, this.gGraphics.startY*0.6, this.gGraphics.stdColor, 1,  function(){this.gGraphics.markDivide(1, right); this.mergeSubsort(i, right, end, sorted, i, i, right);});
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
			if (lptr < right) this.gGraphics.drawBar(1, this.gGraphics.bars[lptr].x, this.gGraphics.bars[lptr].y, this.gGraphics.bars[lptr].h, this.gGraphics.compareColor);
			if (rptr < end) this.gGraphics.drawBar(1, this.gGraphics.bars[rptr].x, this.gGraphics.bars[rptr].y, this.gGraphics.bars[rptr].h, this.gGraphics.compareColor);
			if (lptr < right && (this.gItemArray.compare(lptr, rptr) !== 1 || rptr >= end)) {
				sorted[i] = this.gItemArray.get(lptr);
				this.gGraphics.hideBar(1, lptr);
				this.gGraphics.flashAndMoveBar(2, lptr, this.gGraphics.calculateX(i), this.gGraphics.startY, 0, function(){this.gGraphics.sortBar(i, lptr); this.mergeSubsort(left, right, end, sorted, i+1, lptr+1, rptr);});
				//timer = setTimeout(function() {mergeSubsort(left, right, end, sorted, i+1, lptr+1, rptr);}, compareSpeed[speed]);
			} else {
				sorted[i] = this.gItemArray.get(rptr);	
				this.gGraphics.hideBar(1, rptr);
				this.gGraphics.flashAndMoveBar(2, rptr, this.gGraphics.calculateX(i), this.gGraphics.startY, 0, function(){this.gGraphics.sortBar(i, rptr); this.mergeSubsort(left, right, end, sorted, i+1, lptr, rptr+1);});
				//timer = setTimeout(function() {mergeSubsort(left, right, end, sorted, i+1, lptr, rptr+1);}, compareSpeed[speed]);
			}
		} else {
			this.gGraphics.copyBars(left, end);
			this.gGraphics.clearLayer(1);
			this.gGraphics.clearLayer(2);
			this.mergeSortInner(right-left, sorted, left+2*(right-left));
		}
		
	}

	/**************************** End MergeSort *****************************************/

	/*************************************** HeapSort ***********************************/
	/* Heapsort -- refactor using setTimeouts to allow for animation to be viewed */
	/*
	function heapSort() { 

		// build heap
		for (var i = Math.floor((numItems-2)/2); i >= 0; i--) {
			siftDown(i, numItems-1);
		}

		// reorder array
		// swap first element with one less than last sorted element (or
		// last element if first pass) then sift down first element
		for (var i = numItems-1; i > 0; i--) {
			swapValues(0, i);
			this.gGraphics.swapCoordinates(0, i);
			siftDown(0, i-1);
		}
		document.getElementById('message').innerHTML = 'Heapsort finished.';
		this.gGraphics.drawInPlaceSort(0, 0, this.gItemArray.length, this.gItemArray.length, this.gGraphics.sortedColor, this.gGraphics.stdColor);
	} 

	function siftDown(start, end) {
		// end is last element
		var swap = start;
		if (2*start + 1 <= end && this.gItemArray.elements[swap] < this.gItemArray.elements[2*start + 1]) {
			swap =  2*start + 1;
		}
		if (2*start + 2 <= end && this.gItemArray.elements[swap] < this.gItemArray.elements[2*start + 2]) {
			swap =  2*start + 2;
		}

		if (swap !== start) {
			swapValues(swap, start);
			this.gGraphics.swapCoordinates(swap, start);
			siftDown(swap, end);
		} else {
			// placeholder
		}
	} 
	*/
	
	/* Reorders array as max heap */
	buildHeap(i) {
		this.message = 'Building max heap...';
		if (i >= 0) {
			this.gGraphics.drawNode(1, i, this.gGraphics.textColor, this.gGraphics.compareColor, this.gGraphics.lineColor, 1)
			this.timer = setTimeout(function() {this.gGraphics.drawNode(1, i, this.gGraphics.textColor, this.gGraphics.activeColor, this.gGraphics.lineColor, 1);this.siftDown(i, this.numItems-1, function(){this.buildHeap(i-1);})}, this.heapSpeed[this.speed]);
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
			this.gGraphics.hideNode(1, 0);
			this.swapValues(0, i);
			this.gGraphics.swapCoordinates(0, i);
			this.gGraphics.drawSortedItem(0, i);
			this.timer = setTimeout(function() {
				this.gGraphics.drawNode(1, 0, this.gGraphics.textColor, this.gGraphics.activeColor, this.gGraphics.lineColor);
				this.gGraphics.hideNode(1, i);
				this.timer = setTimeout(function() {this.siftDown(0, i-1, function(){this.heapSort(i-1);});}, this.heapSpeed[this.speed]);
			}, this.heapSpeed[this.speed]);	
		} else {
			this.gGraphics.clearLayer(2);
			this.gGraphics.clearLayer(1);
			this.message = 'Heapsort finished.';
			this.gGraphics.drawInPlaceSort(0, 0, this.numItems, this.numItems, this.gGraphics.sortedColor, this.gGraphics.stdColor);
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
			this.gGraphics.markParentChild(1, swap, start, this.gGraphics.textColor, this.gGraphics.nodeHighlight, this.gGraphics.nodeHighlight);
			this.gGraphics.swapCoordinates(swap, start);
			this.timer = setTimeout(function() {this.gGraphics.markParentChild(1, swap, start, this.gGraphics.textColor, this.gGraphics.activeColor, this.gGraphics.lineColor); this.siftDown(swap, end, funct);}, this.heapSpeed[this.speed]);
		} else {
			// placeholder
			this.timer = setTimeout(function() {funct();}, this.heapSpeed[this.speed]);
		}
	}

	/**************************** End HeapSort *****************************************/


}  // end VisalgoComponent Class

  /* stack for simulating recursive sorts */
class	QuickSortObj {
  right:number;
  left:number;
  next:QuickSortObj;

  constructor(right, left, next) {
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
