import React, {Component } from 'react';
import axios from 'axios'; //ajax library
import Map from './Map';
import './App.css'; 
import Card from './Card';
import ReactModal from 'react-modal';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      geojson: null,
      selectedStation: null,
      showModal: false,
    }; 
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleShowOnMap = this.handleShowOnMap.bind(this);   
  }

  componentDidMount() { 
    this.fetchData();
  }
  
  fetchData(){ 
    axios.get('https://opendata.arcgis.com/datasets/78096ab7dcc745719ce6e4bd55122e62_0.geojson')
    .then(res => { 
      const geojson = res.data; 
      this.setState({
        geojson
      },()=>{console.log('geojson',this.state.geojson)});
    })
    .catch(err => {
      console.log(err);
    }); 
  }

  handleOpenModal () {
    this.setState({
      selectedStation: null,
      showModal: true ,
    });
  }
  
  handleCloseModal () {
    this.setState({ showModal: false });
  }
  
  handleShowOnMap(selectedStation) { 
    this.setState({
      selectedStation,
      showModal: true ,
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Asheville Urban Trail</h1>
          Public Art in Asheville, NC
        </header>
        <div>
        <button onClick={this.handleOpenModal}>Show Map</button>
        </div>
        <ReactModal isOpen={this.state.showModal} contentLabel="Map" >
          <button onClick={this.handleCloseModal}>Close Map</button>
          <Map geojson={this.state.geojson} selectedStation={this.state.selectedStation} />
        </ReactModal>
        <div className="App-body">
        { 
          this.state.geojson && this.state.geojson.features
          .filter((feature)=>{return feature.properties.ut_station!==0;})
          .sort((a,b)=>{return parseInt(a.properties.ut_station, 10) - parseInt(b.properties.ut_station, 10)})
          .map((feature,ix) => {
            const art = feature;
            return (
              <div key={ix} style={{width:"800px",margin:"0 auto",position:"relative"}}>
                <div className="App-ut-num">{art.properties.ut_station}</div>
                <Card art={art} handleShowOnMap={this.handleShowOnMap}/>
              </div>
            )
          })
        }         
        </div>
      </div>
    );
  }

}

