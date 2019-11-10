import React from 'react';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';

import {
  deleteCar,
  getCars,
  insertCar,
  updateCar
} from '../api.js';

import './Cars.css';

export default class Cars extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cars: [],

      showModal: false,
      isEditing: false,
      idx: 0
    };

    this.onAdd = this.onAdd.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);

    this.toggleModal = this.toggleModal.bind(this);
    this.submitModal = this.submitModal.bind(this);
  }

  componentDidMount() {
    getCars().then(cars => {
      this.setState({cars: cars});
    });
  }

  onAdd() {
    this.setState({isEditing: false});
    this.toggleModal();

    getCars().then(cars => {
      this.setState({cars: cars});
    });
  }

  onEdit(idx) {
    this.setState({isEditing: true, idx: idx});
    this.toggleModal();

    getCars().then(cars => {
      this.setState({cars: cars});
    });
  }

  toggleModal() {
    this.setState({showModal: !this.state.showModal});
  }

  submitModal(event) {
    this.toggleModal();

    event.persist();
    event.preventDefault();

    let car = {
      model: event.target[0].value,
      capacity: event.target[1].value,
      mpg: event.target[2].value
    };

    if (this.state.isEditing) {
      let { cars, idx } = this.state;
      car.id = cars[idx].id;
      updateCar(car).then(car => {
        getCars().then(cars => {
          this.setState({cars: cars});
        });
      });
      this.setState({isEditing: false});
    } else {
      insertCar(car).then(car => {
        getCars().then(cars => {
          this.setState({cars: cars});
        });
      });
    }
  }

  onDelete(idx) {
    let id = this.state.cars[idx].id;
    deleteCar(id);

    let cars = this.state.cars;
    cars.splice(idx, 1);
    this.setState({cars: cars});
  }

  render() {
    let { cars } = this.state;
    cars = cars.map((car, idx) => {
      return (
        <ListGroup.Item className="car" key={idx}>
          <input type="checkbox" />
          {car.driver}
          <Button variant="danger" onClick={() => this.onDelete(idx)}>Delete</Button>
          <Button variant="warning" onClick={() => this.onEdit(idx)}>Edit</Button>
        </ListGroup.Item>
      );
    });

    let command, car;
    if (this.state.isEditing) {
      command = 'Edit';
      car = this.state.cars[this.state.idx];
    } else {
      command = 'Add';
      car = {firstName: '', lastName: '', team: '', gender: ''};
    }

    let modal = (
      <Modal show={this.state.showModal} onHide={this.toggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>{command} Car</Modal.Title>
        </Modal.Header>

        <Form onSubmit={this.submitModal}>
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
      <Card id="cars">
        <Card.Body>
          <Card.Title>
            Cars
            <Button className="float-right" onClick={this.onAdd}>Add</Button>
          </Card.Title>

          <ListGroup id="car-list" className="list-group-flush border-bottom">
            {cars}
          </ListGroup>

          {modal}
        </Card.Body>
      </Card>
    );
  }
}
