# Circles

1. `pip3 install -r requirements.txt`

2. Install MySQL
3. Change root password to `''`
4. `CREATE DATABASE circles;`
5. `CREATE TABLE person (id INT AUTO_INCREMENT PRIMARY KEY, firstName VARCHAR(25), lastName VARCHAR(25), team VARCHAR(25), gender CHAR(1), locationId INT, carId INT, FOREIGN KEY (locationId) REFERENCES location(id), FOREIGN KEY (carId) REFERENCES car(id));`
6. `CREATE TABLE location (id INT AUTO_INCREMENT PRIMARY KEY, address VARCHAR(225), latitude FLOAT, longitude FLOAT, description VARCHAR(225));`
7. `CREATE TABLE car (id INT AUTO_INCREMENT PRIMARY KEY, model VARCHAR(225), capacity INT, mpg INT);`

8. Install MongoDB

9. `python3 server.py`
