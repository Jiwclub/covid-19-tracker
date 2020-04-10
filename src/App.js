import React, { useState, useEffect, useCallback } from "react";

import "leaflet/dist/leaflet.css";
import "./Css/App.scss";
import Axios from "axios";
import { MapView } from "./Components/MapView";
import { ListView } from "./Components/ListView";
import { DetailView } from "./Components/DetailView";

const api = "https://coronavirus-tracker-api.herokuapp.com/v2/locations";

function App() {
  const [locationArray, setLocationArray] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([13, 100]);

  const sortedLocationArray = (locations) => {
    return [...locations].sort((location1, location2) => {
      return location2.latest.confirmed - location1.latest.confirmed;
    });
  };

  const onSelectLocation = useCallback(
    (id) => {
      const location = locationArray.find((_location) => _location.id === id);

      if (location === undefined) {
        setSelectedLocation(null);
        return;
      }
      setSelectedLocation(location);
      const {
        coordinates: { latitude, longitude },
      } = location;
      setMapCenter([latitude, longitude]);
    },
    [locationArray]
  );

  const onDeselecLocation = useCallback(() => {
    setSelectedLocation(null);
  }, []);

  // useEffectจะโหลด api หลังจาก components app rander แล้ว
  useEffect(() => {
    Axios.get(api)
      .then((response) => {
        const sortedLocations = sortedLocationArray(response.data.locations);
        setLocationArray(sortedLocations);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  // console.log(locationArray)
  let detailView = null;
  if (selectedLocation != null) {
    detailView = (
      <DetailView
        location={selectedLocation}
        onClickClose={onDeselecLocation}
      />
    );
  }
  return (
    <div className="App">
      <ListView
        locationArray={locationArray}
        selectedLocation={selectedLocation}
        onSelectItem={onSelectLocation}
        onDeselectItem={onDeselecLocation}
      />
      <MapView locationArray={locationArray}
      mapCenter={mapCenter} 
      onSelectMarker={onSelectLocation}/>
      {detailView}
    </div>
  );
}

export default App;
