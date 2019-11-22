import React from 'react';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';

import {
  deleteCar,
  deletePerson,
  getPeopleWithCars,
  insertCar,
  insertPerson,
  updateCar,
  updatePerson,
} from '../api';

import './People.css';

export default class People extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
      people: [],

      onSelect: props.onSelect,
      selectedPeople: [],

      showPersonModal: false,
      showCarModal: false,

      person: {},
      isEditing: false
    };

    this.onSearch = this.onSearch.bind(this);
    this.refresh = this.refresh.bind(this);

    this.submitPerson = this.submitPerson.bind(this);
    this.onDeletePerson = this.onDeletePerson.bind(this);

    this.submitCar = this.submitCar.bind(this);
    this.onDeleteCar = this.onDeleteCar.bind(this);
  }

  componentDidMount() {
    this.refresh();
  }

  onSearch(event) {
    this.setState({search: event.target.value}, () => {
      this.refresh();
    });
  }

  submitPerson(event) {
    this.setState({showPersonModal: false});

    event.persist();
    event.preventDefault();

    let person = {
      firstName: event.target[0].value,
      lastName: event.target[1].value,
      team: event.target[2].value,
      gender: event.target[3].value
    };

    if (this.state.isEditing) {
      person.id = this.state.person.id;
      updatePerson(person).then(person => {
        this.refresh();
      });
    } else {
      insertPerson(person).then(person => {
        this.refresh();
      });
    }
  }

  submitCar(event) {
    this.setState({showCarModal: false});

    event.persist();
    event.preventDefault();

    let car = {
      model: event.target[0].value,
      capacity: event.target[1].value,
      mpg: event.target[2].value
    };

    if (this.state.isEditing) {
      car.id = this.state.person.carId;
      updateCar(car).then(car => {
        this.refresh();
      });
    } else {
      insertCar(car).then(car => {
        this.refresh();
      });
    }
  }

  onDeletePerson(id) {
    deletePerson(id).then(() => {
      this.refresh();
    });
  }

  onDeleteCar(id) {
    deleteCar(id).then(() => {
      this.refresh();
    });
  }

  refresh() {
    getPeopleWithCars(this.state.search).then(people => {
      this.setState({people: people});
    });
  }

  render() {
    let peopleWithCars = this.state.people.map(person => {
      let { car, carId, id, firstName, lastName } = person;

      person = (
        <div className="person">
          <Button
            className="left-button"
            onClick={() => this.state.onSelect(person)}>Add</Button>
          {firstName} {lastName} {carId && '🚗'}
          <Button
            className="right-button"
            variant="danger"
            onClick={() => this.onDeletePerson(id)}>Delete</Button>
          <Button
            className="right-button"
            variant="warning"
            onClick={() => this.setState({showPersonModal: true, isEditing: true, person: person})}>Edit</Button>
        </div>
      );

      return (
        <ListGroup.Item key={id}>
          {person}
        </ListGroup.Item>
      );
    });

    let command, person, car;
    if (this.state.isEditing) {
      command = 'Edit';
      person = this.state.person;
      car = this.state.person.car;
    } else {
      command = 'Add';
      person = {firstName: '', lastName: '', team: '', gender: ''};
      car = {model: '', capacity: '', mpg: ''};
    }

    let personModal = (
      <Modal show={this.state.showPersonModal} onHide={() => this.setState({showPersonModal: false})}>
        <Modal.Header closeButton>
          <Modal.Title>{command} Person</Modal.Title>
        </Modal.Header>

        <Form onSubmit={this.submitPerson}>
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

    let carModal = (
      <Modal show={this.state.showCarModal} onHide={() => this.setState({showCarModal: false})}>
        <Modal.Header closeButton>
          <Modal.Title>{command} Car</Modal.Title>
        </Modal.Header>

        <Form onSubmit={this.submitCar}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Model</Form.Label>
              <Form.Control placeholder="Tesla" defaultValue={car.model} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Capacity</Form.Label>
              <Form.Control placeholder="5" defaultValue={car.capacity} />
            </Form.Group>

            <Form.Group>
              <Form.Label>MPG</Form.Label>
              <Form.Control placeholder="Infinity" defaultValue={car.mpg} />
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
          <Card.Title id="title">
            <p>People</p>
            <Button onClick={() => this.setState({showPersonModal: true, isEditing: false})}>New</Button>
            <input id="search" className="form-control" placeholder="Search" onChange={this.onSearch} value={this.state.search} />
          </Card.Title>

          <ListGroup id="people-list" className="list-group">
            {peopleWithCars}
          </ListGroup>

          {personModal}
          {carModal}
        </Card.Body>
      </Card>
    );
  }
}
