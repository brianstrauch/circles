import mysql.connector.pooling

pool = mysql.connector.pooling.MySQLConnectionPool(
  user='root',
  host='localhost',
  database='circles'
)

def get(table):
  query = f'SELECT * FROM {table}'
  return execute_read(query)

def joined_filtered_get(table_a, key_a, table_b, key_b, search_key, search_val):
  query = f'SELECT * FROM {table_a} a RIGHT JOIN {table_b} b ON a.{key_a} = b.{key_b} WHERE {search_key} LIKE \'%{search_val}%\''
  return execute_read(query)

def insert(table, obj):
  keys, vals = json_to_sql(obj)
  query = f'INSERT INTO {table} {keys} VALUES {vals}'
  return execute_write(query)

def update(table, obj):
  updates = ', '.join(f'{key} = {repr(val)}' for key, val in obj.items())
  id = obj['id']
  query = f'UPDATE {table} SET {updates} WHERE id = {id}'
  return execute_write(query)

def delete(table, id):
  query = f'DELETE FROM {table} WHERE id = {id}'
  return execute_write(query)

def execute_read(query):
  db = pool.get_connection()
  cursor = db.cursor()
  cursor.execute(query)
  rows = cursor.fetchall()
  db.close()
  return rows

def execute_write(query):
  db = pool.get_connection()
  cursor = db.cursor()
  cursor.execute(query)
  db.commit()
  id = cursor.lastrowid
  db.close()
  return id

def json_to_sql(obj):
  keys = ', '.join(obj.keys())
  keys = f'({keys})'
  vals = tuple(obj.values())
  return keys, vals

