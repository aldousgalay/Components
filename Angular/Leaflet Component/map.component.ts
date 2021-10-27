/*
    Map Component using Leaflet.js for Angular + Angular Universal
*/


import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LeafletService } from './leaflet.service';
import { MapOptions, Annotation } from './map.models'

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  // Find map container
  @ViewChild('map1') mapContainer: ElementRef<HTMLElement>;

  private mapOptionsSubject = new BehaviorSubject<MapOptions[]>([]);
  private map;

  @Input()
  set mapOptions(value) {
    this.mapOptionsSubject.next(value);
  };
  get mapOptions() {
    return this.mapOptionsSubject.getValue();
  };

  @Input() markLocations: any[];
  @Output() seletedLocation = new EventEmitter<any>();

  defaultZoom: number = 14;

  constructor(public leafletService: LeafletService) { }

  mainIcon: any;
  normalIcon: any;

  ngOnInit(): void {
    this.generateIcons();
  }

  // Create map icons with configuration
  private generateIcons() {
    let iconSizeX = 40;
    let iconSizeY = 40;
    this.mainIcon = this.leafletService.L.icon({
      //iconUrl: 'https://img.icons8.com/offices/80/000000/marker.png',
      iconUrl: "../../../assets/map-pin.svg",
      //shadowUrl: 'leaf-shadow.png',

      iconSize:     [iconSizeX, iconSizeY], // size of the icon
      //shadowSize:   [50, 50], // size of the shadow
      iconAnchor:   [iconSizeX/2, iconSizeY], // point of the icon which will correspond to marker's location
      //shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [0, -iconSizeY+(iconSizeY*0.125)] // point from which the popup should open relative to the iconAnchor

    });

    iconSizeX = 30;
    iconSizeY = 30;
    this.normalIcon = this.leafletService.L.icon({
      //iconUrl: 'https://img.icons8.com/offices/80/000000/marker.png',
      iconUrl: "../../../assets/map-pin-2.svg",
      //shadowUrl: 'leaf-shadow.png',

      iconSize:     [iconSizeX, iconSizeY], // size of the icon
      //shadowSize:   [50, 50], // size of the shadow
      iconAnchor:   [iconSizeX/2, iconSizeY], // point of the icon which will correspond to marker's location
      //shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [0, -iconSizeY+(iconSizeY*0.125)] // point from which the popup should open relative to the iconAnchor
    });
  }

  /**
   * Changes map position to coordinates
   * @param {number} lat - coordinate, latitude (-90 - 90).
   * @param {number} lon - coordinate, longitude (-180 - 180).
   * @param {number} z - map zoom, default 14.
   */
  public jumpToCoord(lat: number, lon: number, z?: number) {
    let zoom = z ?? this.defaultZoom; 
    this.map.setView([lat, lon], zoom);
  }

  ngAfterViewInit(): void {
    let mapOptionsData: any = this.mapOptions;
    
    const myAPIKey = mapOptionsData.token;
    const initialState = {
      lng: mapOptionsData.coord.lon,
      lat: mapOptionsData.coord.lat,
      zoom: this.defaultZoom
    };

    // declare map object with initial values
    this.map = new this.leafletService.L.Map(this.mapContainer.nativeElement, { "tap": false }).setView(
      [initialState.lat, initialState.lng],
      initialState.zoom
    );

    // add main map marker
    this.leafletService.L
      .marker([mapOptionsData.coord.lat, mapOptionsData.coord.lon], {icon: this.mainIcon})
      .bindPopup(`${mapOptionsData.text}`, {className: 'location-popup'})
      .addTo(this.map)
      .on('click', this.onClick)
      .openPopup();

    // add other annotations
    if(this.markLocations?.length > 0) {
      this.markLocations.map(res => {
        this.leafletService.L.marker([res.coord.lat, res.coord.lon], {icon: this.normalIcon})
          .bindPopup(`${res.landmark}`, {className: 'location-popup'})
          .on('click', this.onClick)
          .addTo(this.map)
      })
    }

    // Mapbox Implementation
    this.leafletService.L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: '<a href="https://www.openstreetmap.org/copyright">OSM</a> | <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: myAPIKey,
    }).addTo(this.map);

    // Open Street Map Implementation
    /* this.leafletService.L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map); */
  }

  // Click event for markers
  private onClick(event) {
    let coord = event.target.getPopup().getLatLng();
  }
}