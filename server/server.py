import flask

app = flask.Flask(__name__)

@app.route('/car')
def car():
  car = {
    'driver': 'Brian',
    'passengers': ['Danny', 'Chelsea', 'Vishal']
  }
  return wrap_res(car)

def wrap_res(res):
  res = flask.jsonify(res)
  res.headers.add('Access-Control-Allow-Origin', '*')
  return res

if __name__ == '__main__':
  app.run(debug=True)
