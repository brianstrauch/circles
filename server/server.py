import flask
import mysql.connector

app = flask.Flask(__name__)

db = mysql.connector.connect(
  user='root',
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
  filters = flask.request.args
  people = db_get_people(filters)
  people = [sql_to_json(PERSON_SCHEMA, person) for person in people]
  return flask.jsonify(people)

def db_get_people(filters):
  cursor = db.cursor()

  query = 'SELECT * FROM person'

  conditions = []
  for key, vals in filters.items():
    vals = vals.split(',') if len(vals) > 0 else []
    if len(vals) == 0:
      condition = f'{key} = NULL'
    else:
      condition = ' OR '.join([f'{key} = {repr(val)}' for val in vals])
    condition = f'({condition})'
    conditions.append(condition)

  if len(conditions) > 0:
    conditions = ' AND '.join(conditions)
    query += f' WHERE {conditions}'

  query += ' ORDER BY firstName, lastName'

  cursor.execute(query)
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
