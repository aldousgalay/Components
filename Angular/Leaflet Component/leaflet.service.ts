/*
    Leaftlet Service for Angular + Angular Universal
*/

import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LeafletService {

  public L = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {

    // Only import leaflet client side
    if (isPlatformBrowser(platformId)) {
      this.L = require('leaflet');
    }
  }
}