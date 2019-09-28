import flask

app = flask.Flask(__name__)

database = {
  'cars': [
    {'seats': 5, 'mpg': 40}
  ]
}

@app.route('/cars', methods=['GET'])
def get_cars():
  return flask.jsonify(database['cars'])

@app.route('/car', methods=['POST'])
def post_car():
  car = flask.request.get_json()
  database['cars'].append(car)
  return flask.jsonify(car)

if __name__ == '__main__':
  app.run(debug=True)
