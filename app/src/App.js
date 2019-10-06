import React from 'react';

import { getCars, getPeople, postCar, postPerson } from './api';
import './App.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      people: [],
      cars: []
    };

    this.addPerson = this.addPerson.bind(this);
    this.addCar = this.addCar.bind(this);
  }

  componentDidMount() {
    getCars().then(cars => {
      this.setState({cars: cars});
    });
    getPeople().then(people => {
      this.setState({people: people});
    });
  }

  addPerson() {
    let person = {firstName: 'Brian', lastName: 'S'}
    postPerson(person).then(person => {
      this.setState({people: [...this.state.people, person]});
    });
  }

  addCar() {
    let car = {seats: 10, mpg: 20};
    postCar(car).then(car => {
      this.setState({cars: [...this.state.cars, car]});
    });
  }

  render() {
    let { people, cars } = this.state;

    people = people.map((person, idx) => {
      let fullName = person.firstName + ' ' + person.lastName;
      return (
        <div key={idx}>
          <input type="checkbox" />{fullName}
        </div>
      );
    });

    cars = cars.map((car, idx) => {
      return (
        <div key={idx}>
          <p>Seats: {car.seats}</p>
        </div>
      );  
    });

    return (
      <div>
        <div className="people">
          <h2>People</h2>
          <div className="list">{people}</div>
          <button onClick={this.addPerson}>+</button>
        </div>
        <div className="map">
          <h2>Map</h2>
        </div>
        <div className="cars">
          <h2>Cars</h2>
          <div>{cars}</div>
          <button onClick={this.addCar}>+</button>
        </div>
      </div>
    );
  }
}
