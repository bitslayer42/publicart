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
      tileLayer: null,
      geojsonLayer: null,
      geojson: null,
    };
    this._mapNode = null;
    this.onEachFeature = this.onEachFeature.bind(this);
    this.pointToLayer = this.pointToLayer.bind(this);

  }

  componentDidMount() {
    // create the Leaflet map object
    if (!this.state.map) this.init(this._mapNode);
    if( this.props.geojson){
      this.update();
    }
  }

  componentDidUpdate(prevProps, prevState) { 
    if(prevProps.geojson !== this.props.geojson){
      this.update();
    }
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

  update(){
    this.setState({
      geojson: this.props.geojson,
    },()=>{
      // code to run when the component receives new props or state
      // check to see if geojson is stored, map is created, and geojson overlay needs to be added
        if (this.state.geojson && this.state.map && !this.state.geojsonLayer) {
          // add the geojson overlay
          this.addGeoJSONLayer(this.state.geojson);
        }
    });

  }

  componentWillUnmount() {
    // code to run just before unmounting the component
    // this destroys the Leaflet map object & related event listeners
    this.state.map.remove();
  }


  addGeoJSONLayer(geojson) {
    // create a native Leaflet GeoJSON SVG Layer to add as an interactive overlay to the map
    // an options object is passed to define functions for customizing the layer
    const geojsonLayer = L.geoJson(geojson, {
      onEachFeature: this.onEachFeature,
      pointToLayer: this.pointToLayer,
      //filter: ()=>true,
    });
    // add our GeoJSON layer to the Leaflet map object
    geojsonLayer.addTo(this.state.map);
    // store the Leaflet GeoJSON layer in our component state for use later
    this.setState({ geojsonLayer });
    // fit the geographic extent of the GeoJSON layer within the map's bounds / viewport
    this.zoomToFeature(geojsonLayer);

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
      // assemble the HTML for the markers' popups (Leaflet's bindPopup method doesn't accept React JSX)
      const popupContent = (feature.properties.ut_station>0)
        ? `<h3>${feature.properties.name}</h3>
        <img src="${feature.properties.image}" width="140px">
        <div>Urban Trail Station Number <strong>${feature.properties.ut_station}</strong>
        </div>`
        : `<h3>${feature.properties.name}</h3>
        <img src="${feature.properties.image}" width="140px">`;

      // add our popups
      layer.bindPopup(popupContent);
  }

  init(id) {
    if (this.state.map) return;
    // this function creates the Leaflet map object and is called after the Map component mounts
    let map = L.map(id, config.params);
    L.control.zoom({ position: "bottomleft"}).addTo(map);
    L.control.scale({ position: "bottomleft"}).addTo(map);

    // a TileLayer is used as the "basemap"
    const tileLayer = L.tileLayer(config.tileLayer.uri, config.tileLayer.params).addTo(map);

    // set our state to include the tile layer
    this.setState({ map, tileLayer });
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
