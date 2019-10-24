import flask

app = flask.Flask(__name__)

# In-Memory SQL Database
database = {
  'cars': [],
  'location': [],
  'people': {
    0: {
      'id': 0,
      'firstName': 'Brian',
      'lastName': 'Strauch'
    }
  },
  'person_count': 1
}

@app.route('/people', methods=['GET'])
def get_people():
  people = list(database['people'].values())
  return flask.jsonify(people)

@app.route('/person', methods=['POST'])
def insert_person():
  id = database['person_count']
  database['person_count'] += 1

  person = flask.request.get_json()
  person['id'] = id
  database['people'][id] = person
  return flask.jsonify(person)

@app.route('/person', methods=['PUT'])
def update_person():
  person = flask.request.get_json()
  id = person['id']
  database['people'][id] = person
  return flask.jsonify(person)

@app.route('/person', methods=['DELETE'])
def delete_person():
  id = int(flask.request.args.get('id'))
  person = database['people'][id]
  del database['people'][id]
  return person

@app.route('/car', methods=['GET'])
def get_cars():
  return flask.jsonify(database['cars'])

@app.route('/car', methods=['POST'])
def add_car():
  car = flask.request.get_json()
  database['cars'].append(car)
  return flask.jsonify(car)

if __name__ == '__main__':
  app.run(debug=True)
