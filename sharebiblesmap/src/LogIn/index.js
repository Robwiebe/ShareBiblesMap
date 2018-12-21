import React, { Component } from "react";
import LogInView from "./LogInView";
import { withRouter } from "react-router";
import app from "../base";
import axios from 'axios';
import Table from '../components/Table'

class LogInContainer extends Component {
  state = {
    regionalKeys: [],
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

  getActiveRegions = () => {
    const token = localStorage.getItem('savedToken')
    axios.get(`https://sharebibles.firebaseio.com/geofireRegion.json?auth=${token}`)
      .then(response => {
        let regions = Object.keys(response.data)
        console.log(regions)
        this.setState({
          activeRegions: regions,
        })
        console.log(this.state)
      })
      .catch(error => console.log(error))
  }

  getRegionalKeys = (region) => {
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
    const regionalPins = [];
    await axios.get(`https://sharebibles.firebaseio.com/locations.json?auth=${this.state.token}`)
      .then(response => {
        const globalPinsArray = Object.entries(response.data);
        for (let i = 0; i < globalPinsArray.length; i++) {
          if (globalPinsArray[i][1].regionKey === this.state.selectedRegion) {
            regionalPins.push(globalPinsArray[i][1])
          }
        }
        this.setState({pins: regionalPins})
      })
      .catch(error => console.log(error));
      console.log(this.state)
}
  useCloudFunction = async () => {
    await axios.post(`https://us-central1-sharebibles.cloudfunctions.net/rob`, {region: 'USA-CAL-Z06'})
      .then(response => {console.log(response.data)})
      .catch(error => console.log(error))
  }

  render() {
    return (
      <div>
        <LogInView onSubmit={this.handleSignUp} />
        <hr />
        <button onClick={this.getActiveRegions}>WHAT REGIONS HAVE PINS?</button>  
        {(this.state.activeRegions) ? this.state.activeRegions.map(region => <div><button onClick={() => this.setState({selectedRegion: `${region}`})} key={region}>{region}</button><br /></div>) : null}
        <hr />
        <button onClick={() => this.getRegionalKeys(this.state.selectedRegion)}>GET REGIONAL KEYS</button>  
        <hr />
        <button onClick={this.getPinsFromRegion}>GET REGIONAL PINS</button>  
        <hr />
        <button onClick={this.useCloudFunction}>TRY CLOUD FUNCTION</button>  
        <hr />
        <h2>Showing {this.state.regionalKeys.length} locations</h2>
        <Table pins={this.state.pins} />
      </div>
    );
  }
}

export default withRouter(LogInContainer);
