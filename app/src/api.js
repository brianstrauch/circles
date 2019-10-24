export function getPeople() {
  return request('GET', '/person');
}

export function addPerson(person) {
  return request('POST', '/person', person);
}

export function getCars() {
  return request('GET', '/car');
}

export function postCar(car) {
  return request('POST', '/car', car);
}

function request(method, endpoint, body) {
  return fetch(endpoint, {
    headers: {'Content-Type': 'application/json'},
    method: method, 
    body: JSON.stringify(body)
  }).then(res => res.json());
}
