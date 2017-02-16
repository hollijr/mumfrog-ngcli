import { Component, OnInit } from '@angular/core';
import { StackPy } from './code/stack.py';
import { BinarySearchPy } from './code/binary_search_nonrecurs.py';
import { CombinationGraphPy } from './code/combinationGraph.py';
import { ClusterCoefficientPy } from './code/computeClusterCoeff.py';
import { EulerianTourPy } from './code/eulerianTour.py';
import { GraphPy } from './code/graph.py';
import { LinkedListPy } from './code/linked_list.py';
import { QueuePy } from './code/queue.py';
import { FibonacciPy } from './code/recursion_fibseq.py';

@Component({
  selector: 'app-python-samples',
  templateUrl: './python-samples.component.html',
  styleUrls: ['./python-samples.component.css']
})
export class PythonSamplesComponent implements OnInit {

  prog:String = "";
  public programs = [
    { value: 'graph', display: 'Graph' },
    { value: 'linkedlist', display: 'Linked List' },
    { value: 'queue', display: 'Queue' },
    { value: 'stack', display: 'Stack' },
    { value: 'binsearch', display: 'Binary Search' },
    { value: 'clustercoeff', display: 'Clustering Coefficient'},
    { value: 'combograph', display: 'Combination Graph' },
    { value: 'eulariantour', display: 'Eulerian Tour' },
    { value: 'fibsequence', display: 'Fibonacci Sequence'}
  ];

  ngOnInit() {
    this.onChange('graph');
  }

  // TODO: improve implementation
  // just want the code text from the files; not going to execute them.
  // probably not the best way to go but works for now.

  onChange(choice):void {
    switch(choice) {
      case 'graph':
        this.prog = new GraphPy().code;
        break;
      case 'linkedlist':
        this.prog = new LinkedListPy().code;
        break;
      case 'queue':
        this.prog = new QueuePy().code;
        break;
      case 'stack':
        this.prog = new StackPy().code;
        break;
      case 'binsearch':
        this.prog = new BinarySearchPy().code;
        break;
      case 'clustercoeff':
        this.prog = new ClusterCoefficientPy().code;
        break;
      case 'combograph':
        this.prog = new CombinationGraphPy().code;
        break;
      case 'eulariantour':
        this.prog = new EulerianTourPy().code;
        break;
      case 'fibsequence':
        this.prog = new FibonacciPy().code;
        break;
      default:
        this.prog = "UNKOWN SELECTION";
    }
  }

}
