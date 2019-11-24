export function getPeople(search) {
  return request('GET', `/people?search=${search}`);
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

export function startGenerate(people) {
  return request('POST', '/generate/start', people);
}

export function getAssignments() {
  return request('GET', '/generate/assignments');
}

export function stopGenerate() {
  return request('POST', '/generate/stop');
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
