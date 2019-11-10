export function getCars() {
  return request('GET', '/cars');
}

export function getPeople(filters) {
  let params = new URLSearchParams(filters);
  return request('GET', '/people?' + params);
}

export function insertCar(car) {
  return request('POST', '/car', car);
}

export function insertPerson(person) {
  return request('POST', '/person', person);
}

export function updateCar(car) {
  return request('PUT', '/car', car);
}

export function updatePerson(person) {
  return request('PUT', '/person', person);
}

export function deleteCar(id) {
  return request('DELETE', `/car?id=${id}`);
}

export function deletePerson(id) {
  return request('DELETE', `/person?id=${id}`);
}

function request(method, endpoint, body) {
  return fetch(endpoint, {
    headers: {'Content-Type': 'application/json'},
    method: method, 
    body: JSON.stringify(body)
  }).then(res => {
    return res.json();
  });
}
