import { OnInit } from '@angular/core';
	
export class TimerMgr {
	timer = null;
	timer2 = null;
	
	/* getters and setters so timers can be shared by visalgo.component */
	setTimer(which, func, after) {
		if (which === 1) {
			this.timer = setTimeout(func, after);
		} else {
			this.timer2 = setTimeout(func, after);
		}
	}

	getTimer(which) {
		if (which === 1) {
			return this.timer;
		} else {
			return this.timer2;
		}
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

}