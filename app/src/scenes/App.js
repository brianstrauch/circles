import React from 'react';

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
      people: [],
      assignments: []
    };

    this.handleAdd = this.handleAdd.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  handleAdd(person) {
    let people = this.state.people;
    if (people.indexOf(person) < 0) {
      this.setState({people: [...people, person]});
    }
  }

  handleUpdate(assignments) {
    this.setState({assignments: assignments});
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
              <People onAdd={this.handleAdd} />
            </Col>
            <Col>
              <Map people={this.state.people} assignments={this.state.assignments} />
            </Col>
          </Row>
          <Row>
            <Col>
              <Assignments people={this.state.people} onUpdate={this.handleUpdate} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
