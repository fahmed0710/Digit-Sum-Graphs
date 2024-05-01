from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import os

app = Flask(__name__)
CORS(app)

config={
  'user': 'root',
  'password': 'root',
  'host': 'db',
  'port': '3306',
  'database': "digit_sum_graphs"
}

def execute_query(query, params=None, fetch=True, fetchone=False, fetchall=False):
  try:
    connection = mysql.connector.connect(**config)
    cursor = connection.cursor(dictionary=True)
    
    cursor.execute(query, params)

    if fetch:
      if fetchone:
        result = cursor.fetchone()
      else:
        result = cursor.fetchall()
    else:
      connection.commit()
      result = None

    cursor.close()
    connection.close()

    return result
  except Exception as e:
    return None
  


@app.route('/')
def home():
    return jsonify({
        'message': 'Hi hi hiii'
    })

from apis import users_api, puzzles_api

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')