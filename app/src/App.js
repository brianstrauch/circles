import React from 'react';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      car: {
        driver: '',
        passengers: []
      }
    };
  }

  componentDidMount() {
    get('http://localhost:5000/car').then(car => {
      this.setState({car: car});
    });
  }

  render() {
    let { car } = this.state;

    let passengers = car.passengers.map((passenger, idx) => {
      return <li key={idx}>{passenger}</li>;
    });

    return (
      <div>
        <p>{car.driver}</p>
        <ul>{passengers}</ul>
      </div>
    );
  }
}

function get(url) {
  return fetch(url).then(res => res.json());
}
