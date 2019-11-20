import React from 'react';
import {
  StaticGoogleMap,
  Marker,
  //Path,
} from 'react-static-google-map';

const mapStyles = {
  width: '100%',
  height: '100%',
};


export default class GoogleMap extends React.Component {


  render() {
    console.log(process.env.REACT_APP_KEY);
    return(
      <StaticGoogleMap size="600x600" className="img-fluid" apiKey={process.env.REACT_APP_KEY}>
        <Marker location="6.4488387,3.5496361" color="blue" label="P" />
      </StaticGoogleMap>
    );

  }
}
