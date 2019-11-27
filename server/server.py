import db
import flask
import itertools
import random
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

LOCATION_SCHEMA = (
  'id',
  'address',
  'latitude',
  'longitude',
  'description'
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

  query = (
    'SELECT * FROM person '
    'LEFT JOIN location ON person.locationId = location.id '
    'LEFT JOIN car ON person.carId = car.id '
    'WHERE firstName LIKE "' + search + '%" '
    'ORDER BY firstName, lastName'
  )
  people_locations_cars = db.execute_read(query)

  people = []
  for person_location_car in people_locations_cars:
    person = sql_to_json(PERSON_SCHEMA, person_location_car[:len(PERSON_SCHEMA)])
    person['location'] = sql_to_json(LOCATION_SCHEMA, person_location_car[len(PERSON_SCHEMA):len(PERSON_SCHEMA)+len(LOCATION_SCHEMA)])
    person['car'] = sql_to_json(CAR_SCHEMA, person_location_car[len(PERSON_SCHEMA)+len(LOCATION_SCHEMA):])
    people.append(person)

  return flask.jsonify(people)

def sql_to_json(schema, tuple):
  return dict(zip(schema, tuple))

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

thread_running = False
thread = None
carpool = None

@app.route('/generate/start', methods=['POST'])
def start():
  global thread_running
  global thread
  people = flask.request.get_json()
  thread_running = True
  thread = threading.Thread(target=generate, args=(people,))
  thread.start()
  return flask.jsonify({})

@app.route('/generate/assignments', methods=['GET'])
def get_assignments():
  global carpool
  assignments = carpool.serialize()
  return flask.jsonify(assignments)

@app.route('/generate/stop', methods=['POST'])
def stop():
  global thread_running
  global thread
  thread_running = False
  thread.join()
  return flask.jsonify({})

def generate(people):
  global carpool

  drivers = []
  passengers = []

  for person in people:
    person = Person(person)
    if person.is_driver:
      drivers.append(person)
    else:
      passengers.append(person)

  carpool = Carpool(drivers, passengers)
  carpool.optimize()

class Person:
  def __init__(self, json):
    self.json = json
    self.location = Location(json['location'])

    self.is_driver = json['carId']
    self.car = Car(json['car'])

class Location:
  def __init__(self, json):
    self.json = json
    self.latitude = json['latitude']
    self.longitude = json['longitude']

class Car:
  def __init__(self, json):
    self.json = json
    self.capacity = json['capacity']
    self.mpg = json['mpg']

  def efficiency(self):
    return self.capacity * self.mpg

class Carpool:
  def __init__(self, drivers, passengers):
    self.drivers = drivers
    self.passengers = passengers

    self.assignments = {}
    self.debug = 'Generating...'

  def serialize(self):
    return {
      'assignments': [
        {
          'driver': driver.json,
          'passengers': [passenger.json for passenger in passengers]
        }
        for driver, passengers in self.assignments.items()
      ],
      'debug': self.debug
    }

  '''
  Random-restart hill climbing algorithm
  1. Randomly assign passengers to cars
  2. Swap passengers between cars until no cost improvement can be made
  3. Reset the car assignments, tracking the best solution
  '''
  def optimize(self):
    global thread_running

    self.remove_inefficient_cars()

    # Special case: 0 drivers
    if len(self.drivers) == 0:
      self.debug = 'Impossible.'
      return

    # Special case: 1 driver
    if len(self.drivers) == 1:
      driver = self.drivers[0]
      curr_assignments, _ = self.make_random_assignments()
      order, _ = self.optimize_order(driver, curr_assignments[driver])
      self.assignments = {driver: order}
      self.debug = 'Done.'
      return

    RESETS, THRESHOLD = 20, 1000
    best_score = float('inf')

    while thread_running:
      curr_assignments, costs = self.make_random_assignments()

      for driver in curr_assignments:
        order, cost = self.optimize_order(driver, curr_assignments[driver])
        curr_assignments[driver] = order
        costs[driver] = cost

      curr_score = sum(costs[driver] for driver in self.drivers)

      i = 0
      while i < THRESHOLD:
        driver_a, passenger_a = self.get_random_passenger(curr_assignments)

        same_driver = True
        while same_driver:
          driver_b, passenger_b = self.get_random_passenger(curr_assignments)
          same_driver = driver_a is driver_b

        assignment_a = curr_assignments[driver_a].copy()
        assignment_b = curr_assignments[driver_b].copy()

        if passenger_a:
          assignment_a.remove(passenger_a)
          assignment_b.append(passenger_a)
        if passenger_b:
          assignment_b.remove(passenger_b)
          assignment_a.append(passenger_b)

        order_a, cost_a = self.optimize_order(driver_a, assignment_a)
        order_b, cost_b = self.optimize_order(driver_b, assignment_b)
        new_score = curr_score - costs[driver_a] - costs[driver_b] + cost_a + cost_b

        if new_score < curr_score:
          curr_score = new_score
          curr_assignments[driver_a], costs[driver_a] = order_a, cost_a
          curr_assignments[driver_b], costs[driver_b] = order_b, cost_b
          i = 0
        else:
          i += 1

      if curr_score < best_score:
        self.assignments = curr_assignments.copy()
        best_score = curr_score
      
  '''
  Turn the drivers with the least efficient cars into passengers.
  '''
  def remove_inefficient_cars(self):
    needed_capacity = len(self.drivers) + len(self.passengers)
    total_capacity = sum(driver.car.capacity for driver in self.drivers)

    if needed_capacity > total_capacity:
      self.passengers.extend(self.drivers)
      self.drivers = []
      return

    for driver in sorted(self.drivers, key=lambda x: x.car.efficiency()):
      remaining_capacity = total_capacity - driver.car.capacity
      if remaining_capacity >= needed_capacity:
        self.drivers.remove(driver)
        total_capacity = remaining_capacity
        self.passengers.append(driver)

  '''
  Pair each passenger with a random driver. Cars may have empty seats.
  '''
  def make_random_assignments(self):
    assignments = {driver: [] for driver in self.drivers}
    for passenger in self.passengers:
      assigned = False
      while not assigned:
        driver = random.choice(self.drivers)
        if 1 + len(assignments[driver]) < driver.car.capacity:
          assignments[driver].append(passenger)
          assigned = True

    costs = {driver: 0 for driver in self.drivers}

    return assignments, costs

  '''
  Find the best pickup order for a driver.
  '''
  def optimize_order(self, driver, passengers):
    best_order, best_cost = [], float('inf')

    for order in itertools.permutations(passengers):
      path = [driver.location] + [passenger.location for passenger in order]
      cost = path_cost(path)
      if cost < best_cost:
        best_order = list(order)
        best_cost = cost

    return best_order, best_cost

  '''
  Swap two random passengers between cars.
  Either passenger may be None, signifying an empty seat.
  '''
  def get_random_passenger(self, assignments):
    driver, passenger = random.choice(self.drivers), None

    seat = random.randint(1, driver.car.capacity - 1) - 1
    if seat < len(assignments[driver]):
      passenger = assignments[driver][seat]

    return driver, passenger

'''
The total cost between every pair of points a, b in a path
'''
def path_cost(path):
  return sum(cost(a, b) for a, b in zip(path, path[1:]))

'''
Manhattan distance between two points
'''
def cost(a, b):
  return abs(a.latitude - b.latitude) + abs(a.longitude - b.longitude)

if __name__ == '__main__':
  app.run(debug=True)
