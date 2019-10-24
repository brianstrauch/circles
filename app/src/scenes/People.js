import React from 'react';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';

import { getPeople, addPerson } from '../api';

import './People.css';

export default class People extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      people: [],
      showModal: false
    };

    this.toggleModal = this.toggleModal.bind(this);
    this.submitModal = this.submitModal.bind(this);
  }

  componentDidMount() {
    getPeople().then(people => {
      this.setState({people: people});
    });
  }

  toggleModal() {
    this.setState({showModal: !this.state.showModal});
  }

  submitModal(event) {
    this.toggleModal();

    event.persist();
    event.preventDefault();

    let person = {
      firstName: event.target[0].value,
      lastName: event.target[1].value
    };

    addPerson(person).then(person => {
      this.setState({people: [...this.state.people, person]});
    });
  }

  render() {
    let { people } = this.state;
    people = people.map((person, idx) => {
      let fullName = person.firstName + ' ' + person.lastName;
      return (
        <ListGroup.Item className="person" key={idx}>
          <input type="checkbox" />
          {fullName}
          <Button variant="danger">Delete</Button>
          <Button variant="warning" onClick={this.toggleModal}>Edit</Button>
        </ListGroup.Item>
      );
    });

    let modal = (
      <Modal show={this.state.showModal} onHide={this.toggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Person</Modal.Title>
        </Modal.Header>

        <Form onSubmit={this.submitModal}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>First Name</Form.Label>
              <Form.Control placeholder="Brian" />
            </Form.Group>

            <Form.Group>
              <Form.Label>Last Name</Form.Label>
              <Form.Control placeholder="Strauch" />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button type="submit">Add</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );

    return (
      <Card id="people" className="shadow-sm">
        <Card.Body>
          <Card.Title>
            People
            <Button className="float-right" onClick={this.toggleModal}>Add</Button>
          </Card.Title>
          <ListGroup id="people-list">
            {people}
          </ListGroup>
          {modal}
        </Card.Body>
      </Card>
    );
  }
}
