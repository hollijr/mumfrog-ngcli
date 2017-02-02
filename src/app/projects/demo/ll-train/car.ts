export class Car {

  mNext;
  mPrev;
  mScreenPos;

  constructor(
      private mId, 
      private mColor, 
      private mType ) 
  {
    this.mNext = null;
    this.mPrev = null;
    this.mScreenPos = { "x" : 0, "y": 0};
  }

}