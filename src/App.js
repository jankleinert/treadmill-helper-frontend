import React, { Component } from 'react';
import logo from './logo.svg';
import axios from 'axios';
import './App.css';

function MphPanel(props) {
    return (
      <div className="treadmill-wrapper">
      <div className="treadmill-title">Imperial (mph)</div>
      <span>{props.value} mph</span>
      <button className="treadmill-control" onClick={props.onUpClick}>+</button>
      <button className="treadmill-control" onClick={props.onDownClick}>-</button>
      </div>
    );
}

function KphPanel(props) {
    return (
      <div className="treadmill-wrapper">
      <div className="treadmill-title">Metric (km/h)</div>
      <span>{props.value} kph</span>
      <button className="treadmill-control" onClick={props.onUpClick}>+</button>
      <button className="treadmill-control" onClick={props.onDownClick}>-</button>
      </div>
    );
}

class Treadmill extends React.Component {
constructor(props) {
  super(props);
  this.state = {
    mph: (6).toFixed(1),
    kph: (1.609344 * 6.0).toFixed(1),
  };
}


handleClick(direction, unit) {
  var newMph, newKph;
  if (direction.indexOf("up") !== -1) { // up button was clicked
    if (unit.indexOf("mph") !== -1) { // increment mph
      newMph = halfStepIncrement(this.state.mph);

      this.setState({
        mph: newMph,
      })

      axios
        .get("http://treadmill-helper-treadmill-helper.6923.rh-us-east-1.openshiftapps.com/convert/?mph="+ newMph)
        .then(response => {
          console.log(response.data);
          this.setState({
            kph: response.data.result.toFixed(1),
          })
        })
        .catch(error => console.log(error));
    } else if (unit.indexOf("kph") !== -1) { // increment kph
      newKph = halfStepIncrement(this.state.kph);

      this.setState({
        kph: newKph,
      })

      axios
        .get("http://treadmill-helper-treadmill-helper.6923.rh-us-east-1.openshiftapps.com/convert/?kph="+ newKph)
        .then(response => {
          console.log(response.data);
          this.setState({
            mph: response.data.result.toFixed(1),
          })
        })
        .catch(error => console.log(error));
    }
      
  } else if (direction.indexOf("down") !== -1) { // down button was clicked
    if (unit.indexOf("mph") !== -1) { // increment mph
      newMph = halfStepDecrement(this.state.mph);

      this.setState({
        mph: newMph,
      })

      axios
        .get("http://treadmill-helper-treadmill-helper.6923.rh-us-east-1.openshiftapps.com/convert/?mph="+ newMph)
        .then(response => {
          console.log(response.data);
          this.setState({
            kph: response.data.result.toFixed(1),
          })
        })
        .catch(error => console.log(error));
    } else if (unit.indexOf("kph") !== -1) { // increment kph
      newKph = halfStepDecrement(this.state.kph);

      this.setState({
        kph: newKph,
      })
      
      axios
        .get("http://treadmill-helper-treadmill-helper.6923.rh-us-east-1.openshiftapps.com/convert/?kph="+ newKph)
        .then(response => {
          console.log(response.data);
          this.setState({
            mph: response.data.result.toFixed(1),
          })
        })
        .catch(error => console.log(error));
    }  
  } 
}

renderMphPanel(i) {
    return (
      <MphPanel
        value={this.state.mph}
        onUpClick={() => this.handleClick("up", "mph")}
        onDownClick={() => this.handleClick("down", "mph")}
      />
    );
  }

renderKphPanel(i) {
    return (
      <KphPanel
        value={this.state.kph}
        onUpClick={() => this.handleClick("up", "kph")}
        onDownClick={() => this.handleClick("down", "kph")}
      />
    );
  }
  render() {
    return (
        <div className="treadmill-panels">
          <div className="treadmill-panel">
            {this.renderMphPanel()}
          </div>
          <div className="treadmill-panel">
            {this.renderKphPanel()}
          </div>
       </div>
      );
  }
}

class App extends React.Component {
  render() {
    return (
      <div className="treadmill">
        <Treadmill />
      </div>
    );
  }
}

function halfStepIncrement(value) {
  var remainder = value % 1;
  if (remainder < 0.5) { // round to floor of value + 0.5
    return (Math.floor(value) + 0.5).toFixed(1);
  } else { // round to ceiling of value
    return Math.ceil(value).toFixed(1);
  }
}

function halfStepDecrement(value) {
  var remainder = value % 1;

  if (value <= 0.5) { // don't let it go below 0xs
    return 0;
  }

  if (remainder > 0.5) { // round to floor of value + 0.5
    return (Math.floor(value) + 0.5).toFixed(1);
  } else if (remainder >= 0.5 && remainder > 0) { // round to floor of value
    return Math.floor(value).toFixed(1);
  } else if (remainder === 0) { // round to floor of value - 0.5
    return (Math.floor(value) - 0.5).toFixed(1);
  }
}

export default App;
