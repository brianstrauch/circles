import React from 'react';

import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';

import Assignments from './Assignments';
import Map from './Map';
import People from './People';

import './App.css';

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedPeople: []
    };

    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(person, selected) {
    let people = this.state.selectedPeople;
    if (selected) {
      people.push(person);
    } else {
      // Remove
    }
    this.setState({selectedPeople: people});
  }

  render() {
    return (
      <div id="home" className="bg-light">
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand>Circles</Navbar.Brand>
        </Navbar>

        <Container>
          <Row>
            <Col>
              <People onSelect={this.handleSelect} />
            </Col>
            <Col>
              <Map />
            </Col>
          </Row>
          <Row>
            <Col>
              <Assignments selectedPeople={this.state.selectedPeople} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
