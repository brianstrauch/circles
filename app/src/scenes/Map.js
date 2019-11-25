import React from 'react';

import Card from 'react-bootstrap/Card';
import { Marker, Path, StaticGoogleMap } from 'react-static-google-map';

export default class Map extends React.Component {
  render() {
    let markers = this.props.people.map(person => {
      let location = `${person.location.latitude}, ${person.location.longitude}`;
      let label = person.firstName[0];
      return <Marker key={person.id} label={label} location={location} />
    });

    let paths = this.props.assignments.map(assignment => {
      let people = [assignment.driver, ...assignment.passengers];
      let points = people.map(person => `${person.location.latitude}, ${person.location.longitude}`);
      return <Path key={assignment.driver.id} points={points} />
    });

    return (
      <Card id="map" className="shadow-sm">
        <Card.Body>
          <Card.Title>Map</Card.Title>
          <StaticGoogleMap size="400x400" apiKey={process.env.REACT_APP_KEY}>
            {markers}
            {paths}
          </StaticGoogleMap>
        </Card.Body>
      </Card>
    );
  }
}
