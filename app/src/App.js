import React from 'react';

import { getCars, postCar } from './api';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cars: []
    };

    this.addCar = this.addCar.bind(this);
  }

  componentDidMount() {
    getCars().then(cars => {
      this.setState({cars: cars});
    });
  }

  addCar() {
    let car = {seats: 10, mpg: 20};

    postCar(car).then(car => {
      this.setState({cars: [...this.state.cars, car]});
    });
  }

  render() {
    let { cars } = this.state;

    cars = cars.map((car, idx) => {
      return (
        <div key={idx}>
          <p>Seats: {car.seats}</p>
          <p>MPG: {car.mpg}</p>
        </div>
      );  
    });

    return (
      <div>
        <div>{cars}</div>
        <button onClick={this.addCar}>Add Car</button>
      </div>
    );
  }
}
