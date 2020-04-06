import React, { useState, useEffect } from "react";

import "leaflet/dist/leaflet.css";
import "./Css/App.scss";
import Axios from "axios";
import { MapView } from "./Components/MapView";
import {ListView} from './Components/ListView'

const api = "https://coronavirus-tracker-api.herokuapp.com/v2/locations";

function App() {
  const [locationArray, setLocationArray] = useState([]);

  const sortedLocationArray = (locations) => {
		return [...locations].sort((location1, location2) => {
			return location2.latest.confirmed - location1.latest.confirmed;
		});
	}

  // useEffectจะโหลด api หลังจาก components app rander แล้ว
  useEffect(() => {
    Axios.get(api).then(response =>{
      const sortedLocations = sortedLocationArray(response.data.locations);
      setLocationArray(sortedLocations);
    }).catch(error =>{
      console.log(error);
    })
  },[]);
  // console.log(locationArray)
  return (
    <div className="App">
      
      
      <ListView
      locationArray={locationArray}
       />
      <MapView 
      locationArray={locationArray}
       />
      
     
    </div>
  );
}

export default App;
