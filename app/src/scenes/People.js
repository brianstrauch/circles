import React from 'react';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';

import {
  deleteCar,
  deletePerson,
  getPeople,
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
      filters: {
        team: ['Novice', 'Varsity'],
        gender: ['M', 'F']
      },
      people: [],

      showModal: false,
      person: {},
      isEditing: false
    };

    this.onSearch = this.onSearch.bind(this);
    this.toggleFilter = this.toggleFilter.bind(this);

    this.refresh = this.refresh.bind(this);

    this.submit = this.submit.bind(this);
    this.onDeletePerson = this.onDeletePerson.bind(this);
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

  toggleFilter(category, tag) {
    let { filters } = this.state;

    let idx = filters[category].indexOf(tag);
    if (idx >= 0) {
      filters[category].splice(idx, 1);
    } else {
      filters[category].push(tag);
    }

    this.setState({filters: filters}, () => {
      this.refresh();
    });
  }

  submit(event) {
    this.setState({showModal: false});

    event.persist();
    event.preventDefault();

    let person = {
      firstName: event.target[0].value,
      lastName: event.target[1].value,
      team: event.target[2].value,
      gender: event.target[3].value
    };

    let car = {
      model: event.target[4].value,
      capacity: parseInt(event.target[5].value),
      mpg: parseInt(event.target[6].value)
    };

    if (this.state.isEditing) {
      person.id = this.state.person.id;
      if (car.model || car.capacity || car.mpg) {
        if (person.car) {
          car.id = person.car.id;
          updateCar(car).then(car => {
            updatePerson(person).then(person => {
              this.refresh();
            });
          });
        } else {
          insertCar(car).then(car => {
            person.carId = car.id;
            updatePerson(person).then(person => {
              this.refresh();
            });
          });
        }
      }
    } else {
      if (car.model || car.capacity || car.mpg) {
        insertCar(car).then(car => {
          person.carId = car.id;
          insertPerson(person).then(person => {
            this.refresh();
          });
        });
      } else {
        insertPerson(person).then(person => {
          this.refresh();
        });
      }
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
    getPeople(this.state.filters, this.state.search).then(people => {
      this.setState({people: people});
    });
  }

  render() {
    let people = this.state.people.map(person => {
      let { carId, id, firstName, lastName } = person;

      return (
        <ListGroup.Item key={id}>
          <div className="person">
            <Button
              className="left-button"
              onClick={() => this.props.onAdd(person)}>Add</Button>
            {firstName} {lastName} {carId && '🚗'}
            <Button
              className="right-button"
              variant="danger"
              onClick={() => this.onDeletePerson(id)}>Delete</Button>
            <Button
              className="right-button"
              variant="warning"
              onClick={() => this.setState({showModal: true, isEditing: true, person: person})}>Edit</Button>
          </div>
        </ListGroup.Item>
      );
    });

    let command, person;
    if (this.state.isEditing) {
      command = 'Edit';
      person = this.state.person;
    } else {
      command = 'Add';
      person = {firstName: '', lastName: '', team: '', gender: '', car: {}};
    }

    let modal = (
      <Modal show={this.state.showModal} onHide={() => this.setState({showModal: false})}>
        <Modal.Header closeButton>
          <Modal.Title>{command} Person</Modal.Title>
        </Modal.Header>

        <Form onSubmit={this.submit}>
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

            <div className="car">
              <Form.Group>
                <Form.Label>Model</Form.Label>
                <Form.Control placeholder="Tesla" defaultValue={person.car.model} />
              </Form.Group>

              <Form.Group>
                <Form.Label>Capacity</Form.Label>
                <Form.Control placeholder="5" defaultValue={person.car.capacity} />
              </Form.Group>

              <Form.Group>
                <Form.Label>MPG</Form.Label>
                <Form.Control placeholder="Infinity" defaultValue={person.car.mpg} />
              </Form.Group>
            </div>
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
            <Button onClick={() => this.setState({showModal: true, isEditing: false})}>New</Button>
            <input id="search" className="form-control" placeholder="Search" onChange={this.onSearch} value={this.state.search} />
          </Card.Title>

          <div id="filters">
            <input
              className="filter"
              type="checkbox"
              defaultChecked
              onClick={() => this.toggleFilter('team', 'Novice')} /> Novice
            <input
              className="filter"
              type="checkbox"
              defaultChecked
              onClick={() => this.toggleFilter('team', 'Varsity')} /> Varsity
            <input
              className="filter"
              type="checkbox"
              defaultChecked
              onClick={() => this.toggleFilter('gender', 'M')} /> Men
            <input
              className="filter"
              type="checkbox"
              defaultChecked
              onClick={() => this.toggleFilter('gender', 'F')} /> Women
          </div>

          <ListGroup id="people-list" className="list-group">
            {people}
          </ListGroup>

          {modal}
        </Card.Body>
      </Card>
    );
  }
}
