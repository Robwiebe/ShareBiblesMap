import React, {Component} from "react";
import axios from 'axios';

const getActiveRegions = () => {
  const token = localStorage.getItem('savedToken')
  axios.get(`https://sharebibles.firebaseio.com/geofireRegion.json?auth=${token}`)
    .then(response => console.log(response.data))
    .catch(error => console.log(error))
}

class Home extends Component {

  render() {
    getActiveRegions();
    return (
      <h1>
        HOME
      </h1>
    )
  }
}

export default Home;
