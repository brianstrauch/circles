export function getPeople() {
  return request('GET', '/people');
}

export function insertPerson(person) {
  return request('POST', '/person', person);
}

export function updatePerson(person) {
  return request('PUT', '/person', person);
}

export function deletePerson(id) {
  return request('DELETE', `/person?id=${id}`);
}

export function getCars() {
  return request('GET', '/car');
}

export function editCar(car) {
  return request('POST', '/car', car);
}

function request(method, endpoint, body) {
  return fetch(endpoint, {
    headers: {'Content-Type': 'application/json'},
    method: method, 
    body: JSON.stringify(body)
  }).then(res => res.json());
}
