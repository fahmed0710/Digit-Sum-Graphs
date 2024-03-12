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

@app.route('/')
def home():
    return jsonify({
        'message': 'Hello World'
    })

@app.route('/api/users', methods=['GET'])
def get_users():
    try:
      connection = mysql.connector.connect(**config)
      cursor = connection.cursor(dictionary=True)
      cursor.execute("SELECT * FROM Users")
      users = cursor.fetchall()
      cursor.close()
      connection.close()
      return jsonify(users)
    except Exception as e:
      return jsonify({'error': str(e)})

@app.route('/api/users/login', methods=['POST'])
def login():
  try:
    connection = mysql.connector.connect(**config)
    cursor = connection.cursor(dictionary=True)

    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    cursor.execute("SELECT * FROM Users WHERE username = %s AND password_hash = %s", (username, password))
    user = cursor.fetchone()

    cursor.close()
    connection.close()
    if user:
      return jsonify({'success': True, 'message': 'Login successful'})
    else:
      return jsonify({'success': False, 'message': 'Invalid username or password.'})
  except Exception as e:
    return jsonify({'error': str(e)})

@app.route('/api/users/add_user', methods=['POST'])
def add_user():
  try:
    connection = mysql.connector.connect(**config)
    cursor = connection.cursor(dictionary=True)

    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    cursor.execute("SELECT * FROM Users WHERE username = %s OR email = %s", (username, email))
    existing_user = cursor.fetchone()
    if existing_user:
      return jsonify({'success': False, 'message': 'Account with the provided username or email already exists.'})

    cursor.execute("INSERT INTO Users(username, email, password_hash, user_points) VALUES (%s, %s, %s, %s)", (username, email, password, 0))
    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({'success': True, 'message': 'User added successfully.'})

  except Exception as e:
    return jsonify({'error': str(e)})

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')