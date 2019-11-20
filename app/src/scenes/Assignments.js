import React from 'react';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

export default class Assignments extends React.Component {
  render() {
    return (
      <Card id="assignments" className="shadow-sm">
        <Card.Body>
          <Card.Title>
            Assignments
            <Button className="float-right">Generate</Button>
          </Card.Title>
        </Card.Body>
      </Card>
    );
  }
}
