import React, { Component } from 'react';
import axios from 'axios'; //ajax library
import './App.css';
import Card from './Card';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      features: [],
    };  
    //this.onClick = this.onClick.bind(this);
  }

  componentDidMount() { 
    this.fetchData();
  }
  
  fetchData(){ 
    axios.get('https://opendata.arcgis.com/datasets/78096ab7dcc745719ce6e4bd55122e62_0.geojson')
    .then(res => { 
      const features = res.data.features; 
      this.setState({
        features
      },()=>{console.log('result',this.state.features)});
    })
    .catch(err => {
      console.log(err);
    }); 
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Asheville Urban Trail</h1>
          Public Art in Asheville, NC
        </header>
        <div className="App-body">
        {
          this.state.features
          .filter((feature)=>{return feature.properties.ut_station!==0;})
          .sort((a,b)=>{return parseInt(a.properties.ut_station, 10) - parseInt(b.properties.ut_station, 10)})
          .map((feature,ix) => {
            const art = feature;
            return (
              <div key={ix} style={{width:"800px",margin:"0 auto",position:"relative"}}>
                <div className="App-ut-num">{art.properties.ut_station}</div>
                <Card art={art} />
              </div>
            )
          })
        }         
        </div>
      </div>
    );
  }
}

export default App;
