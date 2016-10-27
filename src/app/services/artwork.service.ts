import { Injectable } from '@angular/core';

import { Art } from '../artworks/art';
import { ARTWORK } from '../api/mock-artwork';

@Injectable()
export class ArtworkService {

  getArtworks():Promise<[Art[]]> {
    return Promise.resolve(ARTWORK);  // returns an array of artwork arrays
  }

  getSubset(category:number):Promise<Art[]> {
    return Promise.resolve(ARTWORK[category]);
  }

  getArtwork(id:number):Promise<Art> {
    let n = id;
    // find first digit of id
    while (n > 9) {
      n = Math.trunc(n/10);
    }
    
    return this.getSubset(n-1)
                .then(subset => subset.find(art => art.id === id));
  }

}
