from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import os

app = Flask(__name__)
CORS(app, origins=['https://digit-sum-graphs.vercel.app', 'http://localhost:3000'])

config = {
  'user': 'digitsumgraphs',
  'password': 'cs161proj',
  'host': 'digitsumgraphs.mysql.pythonanywhere-services.com',
  'port': '3306',
  'database': 'digitsumgraphs$default'
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
    return str(e)
  

@app.route('/')
def home():
    return jsonify({
        'message': 'Hi hi hiii'
    })

from apis import users_api, puzzles_api, gameplays_api

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')