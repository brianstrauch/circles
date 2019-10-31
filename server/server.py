import flask
import mysql.connector

app = flask.Flask(__name__)

db = mysql.connector.connect(
  user='root',
  password='',
  host='localhost',
  database='circles'
)

PERSON_SCHEMA = (
  'id',
  'firstName',
  'lastName',
  'team',
  'gender',
  'locationId',
  'carId'
)

def sql_to_json(schema, tuple):
  return dict(zip(schema, tuple))

def json_to_sql(obj):
  keys = '(' + ', '.join(obj.keys()) + ')'
  values = tuple(obj.values())
  return keys, values

@app.route('/people', methods=['GET'])
def get_people():
  people = db_get_people()
  people = [sql_to_json(PERSON_SCHEMA, person) for person in people]
  return flask.jsonify(people)

def db_get_people():
  cursor = db.cursor()
  cursor.execute('SELECT * FROM person ORDER BY firstName, lastName')
  return cursor.fetchall()

@app.route('/varsity', methods=['GET'])
def get_varsity():
  people = db_get_varsity()
  people = [sql_to_json(PERSON_SCHEMA, person) for person in people]
  return flask.jsonify(people)

def db_get_varsity():
  cursor = db.cursor()
  cursor.execute("SELECT * FROM person WHERE team = 'Varsity' ORDER BY firstName, lastName")
  return cursor.fetchall()

@app.route('/person', methods=['POST'])
def insert_person():
  person = flask.request.get_json()
  person['id'] = db_insert_person(person)
  return flask.jsonify(person)

def db_insert_person(person):
  cursor = db.cursor()
  keys, values = json_to_sql(person)
  cursor.execute(f'INSERT INTO person {keys} VALUES {values}')
  db.commit()
  return cursor.lastrowid

@app.route('/person', methods=['PUT'])
def update_person():
  person = flask.request.get_json()
  db_update_person(person)
  return flask.jsonify(person)

def db_update_person(person):
  cursor = db.cursor()
  updates = ', '.join(f'{key} = {repr(value)}' for key, value in person.items())
  id = person['id']
  cursor.execute(f'UPDATE person SET {updates} WHERE id = {id}')
  db.commit()

@app.route('/person', methods=['DELETE'])
def delete_person():
  id = int(flask.request.args.get('id'))
  db_delete_person(id)
  return flask.jsonify({})

def db_delete_person(id):
  cursor = db.cursor()
  cursor.execute(f'DELETE FROM person WHERE id = {id}')
  db.commit()

if __name__ == '__main__':
  app.run(debug=True)
