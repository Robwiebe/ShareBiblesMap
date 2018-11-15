import React, { Component } from "react";
import LogInView from "./LogInView";
import { withRouter } from "react-router";
import app from "../base";
import axios from 'axios';
import Table from '../components/Table'

class LogInContainer extends Component {
  state = {
    regionalKeys: [],
    // selectedRegion: 'MEX-SIN',
    selectedRegion: 'MNG',
    // selectedRegion: 'USA-CAL-Z06',
    pins: [],
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

  getPinsFromRegion = async () => {
    const pinsArray = [];
    for (let i = 0; i < this.state.regionalKeys.length; i++) {
      await axios.get(`https://sharebibles.firebaseio.com/locations/${this.state.regionalKeys[i]}.json?auth=${this.state.token}`)
      .then(response => {
        pinsArray.push(response.data)
      })
      .catch(error => console.log(error))
    }
    this.setState({pins: [...pinsArray]})
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
        <h2>Showing {this.state.regionalKeys.length} locations</h2>
        <Table pins={this.state.pins} />
      </div>
    );
  }
}

export default withRouter(LogInContainer);
