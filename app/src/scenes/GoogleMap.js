import React from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';

const mapStyles = {
  width: '100%',
  height: '100%',
};


class MapContainer extends React.Component {


  render() {
    return(
      <Map
            google={this.props.google}
            zoom={8}
            style={mapStyles}
            initialCenter={{ lat: 47.444, lng: -122.176}}
          />
    );

  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBW55K4x0WemR2LZDZfWKhb2nVBNu3lH8g'
})(MapContainer);
