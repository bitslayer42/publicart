import React, { Component } from 'react';
import L from 'leaflet'; 
import 'leaflet/dist/leaflet.css';

// map configuration properties 
let config = {};
config.params = {
  center: [35.5954018, -82.5511644],
  zoomControl: false,
  zoom: 13,
  minZoom: 16,
  maxZoom: 18, 
  scrollwheel: false,
  legends: true,
  infoControl: false,
  attributionControl: true,
};
config.tileLayer = {
  uri: 'https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png',
  params: {
    minZoom: 16,
    maxZoom: 18,
    attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    id: '',
    accessToken: ''
  }
};

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map: null,
    };
    this._mapNode = null;
    this.onEachFeature = this.onEachFeature.bind(this);
    this.pointToLayer = this.pointToLayer.bind(this);

  }

  componentDidMount() { 
    // create the Leaflet map object
    if (!this.state.map) {
      this.init(this._mapNode); 
    }
  }

  componentDidUpdate(prevProps, prevState) { 

    if (this.state.map ) {
      this.addPolylineLayer(this.props.geojson);
      this.addGeoJSONLayer(this.props.geojson);
      this.addPoppedUp();
    }
  }

  addPoppedUp(){
    //If one station has been selected, pop it up.
    if(this.props.selectedStation){ 
      const station = this.props.selectedStation;
      const popupContent = (station.properties.ut_station>0)
      ? `<h3>${station.properties.name}</h3>
      <img src="${station.properties.image}" width="140px">
      <div>Urban Trail Station Number <strong>${station.properties.ut_station}</strong>
      </div>`
      : `<h3>${station.properties.name}</h3>
      <img src="${station.properties.image}" width="140px">`;

      L.popup()
      .setLatLng([station.geometry.coordinates[1],station.geometry.coordinates[0]])
      .setContent(popupContent)
      .openOn(this.state.map);  
    }
  }

  componentWillUnmount() {
    this.state.map.remove();
  }


  addGeoJSONLayer(geojson) {
    // Add stations
    const geojsonLayer = L.geoJson(geojson, {
      onEachFeature: this.onEachFeature,
      pointToLayer: this.pointToLayer,
      //filter: ()=>true,
    });

    geojsonLayer.addTo(this.state.map);

    this.zoomToFeature(geojsonLayer);

  }

  addPolylineLayer(geojson){
    //add polyline
    let latlngs = geojson.features
    .filter((feature)=>{return feature.properties.ut_station!==0;})
    .sort((a,b)=>{return parseInt(a.properties.ut_station, 10) - parseInt(b.properties.ut_station, 10)})
    .map((feature) => {
      return [feature.geometry.coordinates[1],feature.geometry.coordinates[0]];
    })
    L.polyline(latlngs, {color: '#4f4'}).addTo(this.state.map);
  }


  zoomToFeature(target) {
    // pad fitBounds()
    var fitBoundsParams = {
      paddingTopLeft: [10,10],
      paddingBottomRight: [10,10]
    };
    // set the map's center & zoom so that it fits the geographic extent of the layer
    this.state.map.fitBounds(target.getBounds(), fitBoundsParams);
  }


  pointToLayer(feature, latlng) { 
    // renders GeoJSON points as circle markers
    var markerParams = {
      radius: 6,
      fillColor: 'blue',
      color: '#fff',
      weight: 1,
      opacity: 0.6,
      fillOpacity: 0.8,
    };
    if(feature.properties.ut_station>0){
      markerParams.fillColor = 'green';
    }

    return L.circleMarker(latlng, markerParams);
  }

  onEachFeature(feature, layer) { 
      // marker popups 
      const popupContent = (feature.properties.ut_station>0)
        ? `<h3>${feature.properties.name}</h3>
        <img src="${feature.properties.image}" width="140px">
        <div>Urban Trail Station Number <strong>${feature.properties.ut_station}</strong>
        </div>`
        : `<h3>${feature.properties.name}</h3>
        <img src="${feature.properties.image}" width="140px">`;

      layer.bindPopup(popupContent);
  }

  init(id) {
    if (this.state.map) return;
    // create the Leaflet map object 
    let map = L.map(id, config.params);
    L.control.zoom({ position: "bottomleft"}).addTo(map);
    L.control.scale({ position: "bottomleft"}).addTo(map);

    // a TileLayer is used as the "basemap"
    L.tileLayer(config.tileLayer.uri, config.tileLayer.params).addTo(map);

    // set our state 
    this.setState({ map });
  }

  render() {
    return (
      <div id="mapUI">
        <div ref={(node) => { this._mapNode = node; }} id="map" />
      </div>
    );
  }
}

export default Map;
