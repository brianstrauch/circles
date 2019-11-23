import React from 'react';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import { getAssignments, startGenerate, stopGenerate } from '../api';

import './Assignments.css';

export default class Assignments extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isGenerating: false,
      loop: undefined
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    if (this.state.isGenerating) {
      this.setState({isGenerating: false});
      clearInterval(this.state.loop);
      stopGenerate();
    } else {
      this.setState({isGenerating: true});
      startGenerate().then(() => {
        let loop = setInterval(getAssignments, 5 * 1000);
        this.setState({loop: loop});
      });
    }
  }

  render() {
    let people = this.props.people.map(person => (
      <p key={person.id}>{person.firstName} {person.lastName}</p>
    ));

    return (
      <Card id="assignments" className="shadow-sm">
        <Card.Body>
          <Card.Title>
            Assignments
            <Button onClick={this.toggle}>
              {this.state.isGenerating ? 'Stop' : 'Generate'}
            </Button>
          </Card.Title>

          {people}
        </Card.Body>
      </Card>
    );
  }
}
