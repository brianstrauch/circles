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
      filters: {
        team: ['Varsity', 'Novice'],
        gender: ['M', 'F']
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
    getPeople(this.state.filters).then(people => {
      this.setState({people: people});
    });
  }

  toggleFilter(key, val) {
    let { filters } = this.state;

    var idx = filters[key].indexOf(val);
    if (idx === -1) {
      filters[key].push(val);
    } else {
      filters[key].splice(idx, 1);
    }

    this.setState({ filters: filters });
    
    getPeople(this.state.filters).then(people => {
      this.setState({people: people});
    });
  }

  onAdd() {
    this.setState({isEditing: false});
    this.toggleModal();

    getPeople(this.state.filters).then(people => {
      this.setState({people: people});
    });
  }

  onEdit(idx) {
    this.setState({isEditing: true, idx: idx});
    this.toggleModal();

    getPeople(this.state.filters).then(people => {
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
      lastName: event.target[1].value,
      team: event.target[2].value,
      gender: event.target[3].value
    };

    if (this.state.isEditing) {
      let { people, idx } = this.state;
      person.id = people[idx].id;
      updatePerson(person).then(person => {
        getPeople(this.state.filters).then(people => {
          this.setState({people: people});
        });
      });
      this.setState({isEditing: false});
    } else {
      insertPerson(person).then(person => {
        getPeople(this.state.filters).then(people => {
          this.setState({people: people});
        });
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
      person = {firstName: '', lastName: '', team: '', gender: ''};
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

            <Form.Group>
              <Form.Label>Team</Form.Label>
              <Form.Control placeholder="Varsity" defaultValue={person.team} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Gender</Form.Label>
              <Form.Control placeholder="M" defaultValue={person.gender} />
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

          <div id="filters">
            <input type="checkbox" defaultChecked onChange={() => this.toggleFilter('team', 'Novice')} />Novice
            <input type="checkbox" defaultChecked onChange={() => this.toggleFilter('team', 'Varsity')} />Varsity
            <input type="checkbox" defaultChecked onChange={() => this.toggleFilter('gender', 'M')} />Men
            <input type="checkbox" defaultChecked onChange={() => this.toggleFilter('gender', 'F')} />Women
          </div>

          <ListGroup id="people-list" className="list-group-flush border-bottom">
            {people}
          </ListGroup>

          {modal}
        </Card.Body>
      </Card>
    );
  }
}
