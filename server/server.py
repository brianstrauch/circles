import flask

app = flask.Flask(__name__)

# In-Memory SQL Database
database = {
  'people': [
    {
      'firstName': 'Brian',
      'lastName': 'S',
      'address': '610 E Stoughton St, Champaign, IL'
    }
  ],
  'cars': [
    {'seats': 5, 'mpg': 40}
  ]
}

@app.route('/person', methods=['GET'])
def get_people():
  return flask.jsonify(database['people'])

@app.route('/person', methods=['POST'])
def post_person():
  person = flask.request.get_json()
  database['people'].append(person)
  return flask.jsonify(person)

@app.route('/car', methods=['GET'])
def get_cars():
  return flask.jsonify(database['cars'])

@app.route('/car', methods=['POST'])
def post_car():
  car = flask.request.get_json()
  database['cars'].append(car)
  return flask.jsonify(car)

if __name__ == '__main__':
  app.run(debug=True)
