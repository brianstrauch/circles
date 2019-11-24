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
      loop: undefined,

      debug: '',
      assignments: []
    };

    this.toggle = this.toggle.bind(this);
    this.refreshAssignments = this.refreshAssignments.bind(this);
  }

  toggle() {
    if (this.state.isGenerating) {
      this.setState({
        isGenerating: false,
        debug: 'Done!'
      });
      clearInterval(this.state.loop);
      stopGenerate();
    } else {
      this.setState({
        isGenerating: true,
        debug: 'Generating...'
      });
      startGenerate(this.props.people).then(() => {
        let loop = setInterval(this.refreshAssignments, 5 * 1000);
        this.setState({loop: loop});
      });
    }
  }

  refreshAssignments() {
    getAssignments().then(assignments => {
      console.log(assignments);
      this.setState({assignments: assignments});
    });
  }

  render() {
    let assignments = this.state.assignments.map(assignment => (
      <div key={assignment.driver.id}>
        <p>{assignment.driver.firstName} {assignment.driver.lastName}</p>
        <ul>
          {assignment.passengers.map(passenger => <li key={passenger.id}>{passenger.firstName} {passenger.lastName}</li>)}
        </ul>
      </div>
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

          <p>People: {this.props.people.map(person => `${person.firstName} ${person.lastName}`).join(', ')}</p>
          <p>{this.state.debug}</p>
          {assignments}
        </Card.Body>
      </Card>
    );
  }
}
