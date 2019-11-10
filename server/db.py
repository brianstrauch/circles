import mysql.connector.pooling

pool = mysql.connector.pooling.MySQLConnectionPool(
  user='root',
  host='localhost',
  database='circles'
)

def get(table):
  db = pool.get_connection()
  cursor = db.cursor()
  cursor.execute(f'SELECT * FROM {table}')
  rows = cursor.fetchall()
  db.close()
  return rows

def filtered_get(table, filters):
  query = 'SELECT * FROM person'
  conds = []
  for key, vals in filters.items():
    vals = vals.split(',') if len(vals) > 0 else []
    if len(vals) == 0:
      cond = f'{key} = NULL'
    else:
      cond = ' OR '.join([f'{key} = {repr(val)}' for val in vals])
    cond = f'({cond})'
    conds.append(cond)

  if len(conds) > 0:
    conds = ' AND '.join(conds)
    query += f' WHERE {conds}'

  query += ' ORDER BY firstName, lastName'

  db = pool.get_connection()
  cursor = db.cursor()
  cursor.execute(query)
  rows = cursor.fetchall()
  db.close()
  return rows

def insert(table, obj):
  keys, vals = json_to_sql(obj)
  db = pool.get_connection()
  cursor = db.cursor()
  cursor.execute(f'INSERT INTO {table} {keys} VALUES {vals}')
  db.commit()
  id = cursor.lastrowid
  db.close()
  return id

def update(table, obj):
  updates = ', '.join(f'{key} = {repr(val)}' for key, val in obj.items())
  id = obj['id']

  db = pool.get_connection()
  cursor = db.cursor()
  cursor.execute(f'UPDATE {table} SET {updates} WHERE id = {id}')
  db.commit()
  db.close()

def delete(table, id):
  db = pool.get_connection()
  cursor = db.cursor()
  cursor.execute(f'DELETE FROM {table} WHERE id = {id}')
  db.commit()
  db.close()

def json_to_sql(obj):
  keys = '(' + ', '.join(obj.keys()) + ')'
  vals = tuple(obj.values())
  return keys, vals

