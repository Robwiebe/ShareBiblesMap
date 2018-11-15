import React, { Component } from "react";
import LogInView from "./LogInView";
import { withRouter } from "react-router";
import app from "../base";
import axios from 'axios';



class LogInContainer extends Component {
  state = {
    regionalKeys: [],
    selectedRegion: 'MEX-SIN',
    // selectedRegion: 'USA-CAL-Z06',
    pins: [0],
    indexNumber: 0
  }
  handleSignUp = async event => {
    event.preventDefault();
    const { email, password } = event.target.elements;
    try {
      const user = await app
        .auth()
        .signInWithEmailAndPassword(email.value, password.value)
        .then(function(user) {
          user.getIdToken().then(function(token) {
            localStorage.setItem("savedToken", token);
            console.log("I logged in successfully", token) // store the token
          });
        })
    } catch (error) {
      alert(error);
    }
  };

  getActiveRegions = (region) => {
    const token = localStorage.getItem('savedToken')
    const selectedRegion = region
    axios.get(`https://sharebibles.firebaseio.com/geofireRegion/${selectedRegion}.json?auth=${token}`)
      .then(response => {
        let keys = Object.keys(response.data)
        this.setState({
          regionalKeys: keys,
          token: token
        })
        console.log(this.state)
      })
      .catch(error => console.log(error))
  }

  getPinsFromRegion = () => {
    const index = this.state.indexNumber
    axios.get(`https://sharebibles.firebaseio.com/locations/${this.state.regionalKeys[index]}.json?auth=${this.state.token}`)
      .then(response => {
        this.state.pins.push(response.data)
        if (this.state.indexNumber < this.state.regionalKeys.length) {
        this.setState({indexNumber: index + 1})}
        console.log(this.state)
      })
      .catch(error => console.log(error))
  }

  render() {
    return (
      <div>
        <LogInView onSubmit={this.handleSignUp} />
        <hr />
        <button onClick={() => this.getActiveRegions(this.state.selectedRegion)}>GET REGIONAL KEYS</button>  
        <hr />
        <button onClick={this.getPinsFromRegion}>GET REGIONAL PINS</button>  
        <hr />
        <h2>Showing {this.state.indexNumber} of {this.state.regionalKeys.length} locations</h2>
        <table>
          <caption>Table of pin data in region</caption>
          <thead> <tr> <th>Key</th> <th>Longitude</th> <th>Latitude</th> <th>Status</th> </tr> </thead>
          {this.state.pins.map(pin => <tr> <th>{pin.key}</th> <th>{pin.longitude}</th> <th>{pin.latitude}</th> <th>{pin.status}</th> </tr>)}
        </table>
      </div>
    );
  }
}

export default withRouter(LogInContainer);
