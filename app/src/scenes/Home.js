import React from 'react';

import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';

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
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>Map</Card.Title>
              </Card.Body>
            </Card>
          </Row>
          <Row>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>Cars</Card.Title>
              </Card.Body>
            </Card>
          </Row>
        </Container>
      </div>
    );
  }
}