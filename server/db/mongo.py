import pymongo

client = pymongo.MongoClient('mongodb://localhost:27017/')
db = client['circles']

def get(collection, condition):
  return db[collection].find_one(condition, {'_id': False})

def insert(collection, obj):
  db[collection].insert(obj.copy())

