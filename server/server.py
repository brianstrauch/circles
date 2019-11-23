import db
import flask
import threading

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

CAR_SCHEMA = (
  'id',
  'model',
  'capacity',
  'mpg'
)

@app.route('/people', methods=['GET'])
def get_people():
  search = flask.request.args['search']

  people = []
  cars_and_people = db.joined_filtered_sorted_get(
    'car', 'id',
    'person', 'carId',
    'firstName', search,
    'firstName'
  )

  for car_and_person in cars_and_people:
    car, person = car_and_person[:4], car_and_person[4:]
    person = sql_to_json(PERSON_SCHEMA, person)
    person['car'] = sql_to_json(CAR_SCHEMA, car)
    people.append(person)

  return flask.jsonify(people)

@app.route('/person', methods=['POST'])
def insert_person():
  person = flask.request.get_json()
  person['id'] = db.insert('person', person)
  return flask.jsonify(person)

@app.route('/car', methods=['POST'])
def insert_car():
  car = flask.request.get_json()
  car['id'] = db.insert('car', car)
  return flask.jsonify(car)
  
@app.route('/person', methods=['PUT'])
def update_person():
  person = flask.request.get_json()
  db.update('person', person)
  return flask.jsonify(person)

@app.route('/car', methods=['PUT'])
def update_car():
  car = flask.request.get_json()
  db.update('car', car)
  return flask.jsonify(car)

@app.route('/person', methods=['DELETE'])
def delete_person():
  id = int(flask.request.args.get('id'))
  db.delete('person', id)
  return flask.jsonify({})

@app.route('/car', methods=['DELETE'])
def delete_car():
  id = int(flask.request.args.get('id'))
  db.delete('car', id)
  return flask.jsonify({})

import time
def generate():
  global thread_running
  while thread_running:
    time.sleep(1)

thread = None
thread_running = False

@app.route('/generate/start', methods=['POST'])
def start():
  global thread_running
  thread_running = True
  global thread
  thread = threading.Thread(target=generate)
  thread.start()
  return flask.jsonify({})

@app.route('/generate/assignments', methods=['GET'])
def get_assignments():
  return flask.jsonify({})

@app.route('/generate/stop', methods=['POST'])
def stop():
  global thread_running
  thread_running = False
  global thread
  thread.join()
  return flask.jsonify({})

def sql_to_json(schema, tuple):
  return dict(zip(schema, tuple))

if __name__ == '__main__':
  app.run(debug=True)
