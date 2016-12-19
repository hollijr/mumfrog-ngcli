/* The Train object is an analogy for a linked list */
export class Train {

  // lookup table index associated with the current input level of gauge
  mHead = null;
  mTail = null;
  mNumCars:number = 0;

  size():number {
    return this.mNumCars;
  }

  isEmpty():boolean {
    return this.mNumCars === 0;
  }

  insert(loc, car):void {
    var ptr = this.mHead;
    
    // add to beginning
    if (this.mHead === null) {
      this.mHead = car;
      this.mTail = car;
      this.mNumCars++;
      return;
    }

    // add to end
    if (loc > this.mNumCars) {
      car.mPrev = this.mTail;
      if (this.mTail !== null) this.mTail.mNext = car;
      this.mTail = car;
    } else {
      var i = 0;
      while (ptr !== null) {
        i++;
        if (i == loc) {
          car.mPrev = ptr.mPrev;
          car.mNext = ptr;
          if (ptr.mPrev !== null) ptr.mPrev.mNext = car;
          else this.mHead = car;
          ptr.mPrev = car;
          break;
        }
        ptr = ptr.mNext;
      }
    }

    this.mNumCars++;
  }

  add(car):void {
    if (this.mHead === null) this.mHead = car;
    car.mPrev = this.mTail;
    if (this.mTail !== null) this.mTail.mNext = car;
    this.mTail = car;
  }

  delete(car):boolean {
    var ptr = this.mHead;
    while (ptr !== null) {
      if (ptr === car) {
        if (ptr.mPrev !== null) {
          ptr.mPrev.mNext = ptr.mNext;
        } else {
          this.mHead = ptr.mNext;
        }
        if (ptr.mNext !== null) {
          ptr.mNext.mPrev = ptr.mPrev;
        } else {
          this.mTail = ptr.mPrev;
        }
        this.mNumCars--;
        return true;
      }
      ptr = ptr.mNext;
    }
    return false;
  }

  deleteAt(loc):boolean {
    if (loc > this.size) return;
    var ptr = this.mHead;
    var i = 0;
    while (ptr !== null) {
      i++;
      if (i === loc) {
        if (ptr.mPrev !== null) {
          ptr.mPrev.mNext = ptr.mNext;
        } else {
          this.mHead = ptr.mNext;
        }
        if (ptr.mNext !== null) {
          ptr.mNext.mPrev = ptr.mPrev;
        } else {
          this.mTail = ptr.mPrev;
        }
        this.mNumCars--;
        return true;
      }
      ptr = ptr.mNext;
    }
    return false;
  }

  get(id)  {
    var ptr = this.mHead;
    while (ptr !== null) {
      if (ptr.mId == id) {
        return ptr;
      }
      ptr = ptr.mNext;
    }
    return null;
  }

  getAt(loc)  {
    var ptr = this.mHead;
    var i = 0;
    while (ptr !== null) {
      i++;
      if (i == loc) {
        return ptr;
      }
      ptr = ptr.mNext;
    }
    return null;
  }
}