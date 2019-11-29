import React from 'react';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';

import Assignments from './Assignments';
import Map from './Map';
import People from './People';
import { loadState, saveState } from '../api';

import './App.css';

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSaving: false,
      isLoading: false,

      title: 'Example',
      people: [],
      assignments: []
    };

    this.handleAdd = this.handleAdd.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);

    this.handleSave = this.handleSave.bind(this);
    this.handleLoad = this.handleLoad.bind(this);
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

  handleSave(event) {
    this.setState({ isSaving: false });

    event.persist();
    event.preventDefault();

    let title = event.target[0].value;
    this.setState({title: title}, () => saveState(this.state));
  }

  handleLoad(event) {
    this.setState({ isLoading: false });

    event.persist();
    event.preventDefault();

    let title = event.target[0].value;
    loadState(title).then(state => {
      this.setState(state);
    });
  }

  render() {
    let saveModal = (
      <Modal show={this.state.isSaving} onHide={() => this.setState({isSaving: false})}>
        <Modal.Header closeButton>
          <Modal.Title>Save</Modal.Title>
        </Modal.Header>

        <Form onSubmit={this.handleSave}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control placeholder="Varsity Men" />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button type="submit">Save</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );

    let loadModal = (
      <Modal show={this.state.isLoading} onHide={() => this.setState({isLoading: false})}>
        <Modal.Header closeButton>
          <Modal.Title>Load</Modal.Title>
        </Modal.Header>

        <Form onSubmit={this.handleLoad}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control placeholder="Varsity Men" />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button type="submit">Load</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );

    return (
      <div id="home" className="bg-light">
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand>Circles</Navbar.Brand>

          <Button onClick={() => this.setState({isSaving: true})}>Save</Button>
          <Button onClick={() => this.setState({isLoading: true})}>Load</Button>
        </Navbar>

        <Container>
          <Row>
            <Col>
              <People onAdd={this.handleAdd} />
            </Col>
            <Col>
              <Map
                people={this.state.people}
                assignments={this.state.assignments} />
            </Col>
          </Row>
          <Row>
            <Col>
              <Assignments
                people={this.state.people}
                assignments={this.state.assignments}
                onUpdate={this.handleUpdate} />
            </Col>
          </Row>
        </Container>

        {saveModal}
        {loadModal}
      </div>
    );
  }
}
