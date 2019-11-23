import React from 'react';
import Card from 'react-bootstrap/Card';
import { StaticGoogleMap, Marker } from 'react-static-google-map';

export default class GoogleMap extends React.Component {
  render() {
    return (
      <Card id="map" className="shadow-sm">
        <Card.Body>
          <Card.Title>Map</Card.Title>
          <StaticGoogleMap size="500x500" apiKey={process.env.REACT_APP_KEY}>
            <Marker location="40.1020, -88.2272" />
          </StaticGoogleMap>
        </Card.Body>
      </Card>
    );
  }
}
