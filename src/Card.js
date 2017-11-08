import React from 'react';
import './Card.css';
  
export default class Card extends React.Component { 

 constructor(props) { 
    super(props);
    this.state = {
      picClasses: ['pics'],
    };      
    this.animateMe = this.animateMe.bind(this);
    this.handleShowOnMap = this.handleShowOnMap.bind(this);
  }
  
  animateMe(){ 
    let origpicClasses = this.state.picClasses;
    let newpicClasses = [];
    let ix = origpicClasses.indexOf('large');
    if (ix === -1){
      newpicClasses = [ ...origpicClasses,'large'];
    }else{
      origpicClasses.splice(ix, 1);
      newpicClasses = origpicClasses;
    }
    this.setState({
      picClasses: newpicClasses
    });
  }
  
  handleShowOnMap(){
    this.props.handleShowOnMap(this.props.art);
  }

  render() {
    const art = this.props.art.properties;
    //const loc = this.props.art.geometry.coordinates; 
    const imgName = {backgroundImage:`url('${art.image}')`};
    //const maploc = "https://maps.google.com/maps?q=" + loc[1] + "," + loc[0] + "&z=18";
    return (
      <div className="card">
        <div className={this.state.picClasses.join(' ')} style={imgName} onClick={this.animateMe}>
          <div className="ovaltext">
            {art.name}
          </div>
        </div>

        <div style={{padding:"10px",textAlign:"left",width:"500px"}}>
          <div style={{color:"grey",fontSize:"0.8em"}}>Urban Trail Station {art.ut_station}</div>
          <div style={{fontSize:"2.0em",lineHeight:"1.2em"}}><b>{art.name}</b></div>
          <div style={{fontSize:"1.0em"}}><em>{art.type}</em></div>
          <div style={{color:"green",fontSize:"1.2em"}}>{art.location}</div>

          <div style={{textAlign:"left",width:"200px"}}><button onClick={this.handleShowOnMap}>
            Show on map
            </button>
          </div>
        </div>
      </div>                
    )
  }
}