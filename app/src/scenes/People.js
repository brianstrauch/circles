import React from 'react';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';

import { getPeople, getVarsity, insertPerson, updatePerson, deletePerson } from '../api';

import './People.css';

export default class People extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      people: [],
      filters: {
        varsity: false
      },

      showModal: false,
      isEditing: false,
      idx: 0
    };

    this.toggleFilter = this.toggleFilter.bind(this);

    this.onAdd = this.onAdd.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);

    this.toggleModal = this.toggleModal.bind(this);
    this.submitModal = this.submitModal.bind(this);
  }

  componentDidMount() {
    getPeople().then(people => {
      this.setState({people: people});
    });
  }

  toggleFilter() {
    let isVarsity = !this.state.filters.varsity;

    this.setState({filters: {varsity: isVarsity}});
    
    if (isVarsity) {
      getVarsity().then(people => {
        this.setState({people: people});
      });
    } else {
      getPeople().then(people => {
        this.setState({people: people});
      });
    }
  }

  onAdd() {
    this.setState({isEditing: false});
    this.toggleModal();
  }

  onEdit(idx) {
    this.setState({isEditing: true, idx: idx});
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

    if (this.state.isEditing) {
      let { people, idx } = this.state;
      person.id = people[idx].id;
      updatePerson(person).then(person => {
        people.splice(idx, 1, person);
        this.setState({people: people});
      });
      this.setState({isEditing: false});
    } else {
      insertPerson(person).then(person => {
        this.setState({people: [...this.state.people, person]});
      });
    }
  }

  onDelete(idx) {
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
          <Button variant="danger" onClick={() => this.onDelete(idx)}>Delete</Button>
          <Button variant="warning" onClick={() => this.onEdit(idx)}>Edit</Button>
        </ListGroup.Item>
      );
    });

    let command, person;
    if (this.state.isEditing) {
      command = 'Edit';
      person = this.state.people[this.state.idx];
    } else {
      command = 'Add';
      person = {firstName: '', lastName: ''};
    }

    let modal = (
      <Modal show={this.state.showModal} onHide={this.toggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>{command} Person</Modal.Title>
        </Modal.Header>

        <Form onSubmit={this.submitModal}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>First Name</Form.Label>
              <Form.Control placeholder="Brian" defaultValue={person.firstName} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Last Name</Form.Label>
              <Form.Control placeholder="Strauch" defaultValue={person.lastName} />
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
            <Button className="float-right" onClick={this.onAdd}>Add</Button>
          </Card.Title>

          <ListGroup id="people-list">
            {people}
          </ListGroup>

          <div id="filters">
            <input type="checkbox" onClick={this.toggleFilter} />Varsity
          </div>

          {modal}
        </Card.Body>
      </Card>
    );
  }
}
