import React from 'react';

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';

import Assignments from './Assignments';
import People from './People';

import './Home.css';

export default class Home extends React.Component {
  render() {
    return (
      <div id="home" className="bg-light">
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand>Circles</Navbar.Brand>
        </Navbar>

        <Container>
          <Row>
            <People />
          </Row>

          <Row>
            <Card id="map">
              <Card.Body className="shadow-sm">
                <Card.Title>Map</Card.Title>
              </Card.Body>
            </Card>
          </Row>

          <Row>
            <Assignments />
          </Row>
        </Container>
      </div>
    );
  }
}
