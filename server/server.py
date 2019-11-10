import db
import flask

app = flask.Flask(__name__)

PERSON_SCHEMA = (
  'id',
  'firstName',
  'lastName',
  'team',
  'gender',
  'locationId',
  'carId'
)

@app.route('/people', methods=['GET'])
def get_people():
  filters = flask.request.args
  people = db.filtered_get('people', filters)
  people = [sql_to_json(PERSON_SCHEMA, person) for person in people]
  return flask.jsonify(people)

@app.route('/person', methods=['POST'])
def insert_person():
  person = flask.request.get_json()
  person['id'] = db.insert('person', person)
  return flask.jsonify(person)

@app.route('/person', methods=['PUT'])
def update_person():
  person = flask.request.get_json()
  db.update('person', person)
  return flask.jsonify(person)

@app.route('/person', methods=['DELETE'])
def delete_person():
  id = int(flask.request.args.get('id'))
  db.delete('person', id)
  return flask.jsonify({})

CAR_SCHEMA = (
  'id',
  'model',
  'capacity',
  'mpg'
)

@app.route('/cars', methods=['GET'])
def get_cars():
  cars = db.get('car')
  cars = [sql_to_json(CAR_SCHEMA, car) for car in cars]
  return flask.jsonify(cars)

def sql_to_json(schema, tuple):
  return dict(zip(schema, tuple))

if __name__ == '__main__':
  app.run(debug=True)
