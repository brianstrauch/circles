import React from 'react';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';

import { getPeople, insertPerson, updatePerson, deletePerson } from '../api';

import './People.css';

export default class People extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      people: [],
      isEditing: false,
      showModal: false
    };

    this.insertPerson = this.insertPerson.bind(this);
    this.updatePerson = this.updatePerson.bind(this);
    this.deletePerson = this.deletePerson.bind(this);

    this.toggleModal = this.toggleModal.bind(this);
    this.submitModal = this.submitModal.bind(this);
  }

  componentDidMount() {
    getPeople().then(people => {
      this.setState({people: people});
    });
  }

  insertPerson() {
    this.setState({isEditing: false});
    this.toggleModal();
  }

  updatePerson(idx) {
    this.setState({isEditing: true});
    this.toggleModal();
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

    insertPerson(person).then(person => {
      this.setState({people: [...this.state.people, person]});
    });
  }

  deletePerson(idx) {
    let id = this.state.people[idx].id;
    deletePerson(id);

    let people = this.state.people;
    people.splice(idx, 1);
    this.setState({people: people});
  }

  render() {
    let { people } = this.state;
    people = people.map((person, idx) => {
      let fullName = person.firstName + ' ' + person.lastName;
      return (
        <ListGroup.Item className="person" key={idx}>
          <input type="checkbox" />
          {fullName}
          <Button variant="danger" onClick={() => this.deletePerson(idx)}>Delete</Button>
          <Button variant="warning" onClick={() => this.updatePerson(idx)}>Edit</Button>
        </ListGroup.Item>
      );
    });

    let command = this.state.isEditing ? 'Edit' : 'Add';
    let modal = (
      <Modal show={this.state.showModal} onHide={this.toggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>{command} Person</Modal.Title>
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
            <Button type="submit">{command}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );

    return (
      <Card id="people" className="shadow-sm">
        <Card.Body>
          <Card.Title>
            People
            <Button className="float-right" onClick={this.insertPerson}>Add</Button>
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
