from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import bcrypt
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

@app.route('/users', methods=['GET'])
def get_users():
    try:
      connection = mysql.connector.connect(**config)
      cursor = connection.cursor(dictionary=True)
      cursor.execute("SELECT * FROM Users")
      users = cursor.fetchall()
      cursor.close()
      connection.close()
      return jsonify({'success': True, 'message': 'Fetched all users successfully', 'users': users})
    except Exception as e:
      return jsonify({'error': str(e)})

@app.route('/users/login', methods=['POST'])
def login():
  try:
    connection = mysql.connector.connect(**config)
    cursor = connection.cursor(dictionary=True)

    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    cursor.execute("SELECT * FROM Users WHERE username = %s", (username,))
    user = cursor.fetchone()

    cursor.close()
    connection.close()
    if user and bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
      return jsonify({'success': True, 'message': 'Login successful'})
    else:
      return jsonify({'success': False, 'message': 'Invalid username or password.' })
  except Exception as e:
    return jsonify({'success': False, 'error': str(e)})

@app.route('/users/add_user', methods=['POST'])
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

    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    cursor.execute("INSERT INTO Users(username, email, password_hash, user_points) VALUES (%s, %s, %s, %s)", (username, email, password_hash, 0))
    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({'success': True, 'message': 'User added successfully.'})

  except Exception as e:
    return jsonify({'success': False, 'error': str(e)})

@app.route('/users/delete/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
  try:
    connection = mysql.connector.connect(**config)
    cursor = connection.cursor(dictionary=True)

    cursor.execute("SELECT * FROM Users WHERE user_id = %s", (user_id,))
    user = cursor.fetchone()

    if user:
      cursor.execute("DELETE FROM Users WHERE user_id = %s", (user_id,))
      connection.commit()
      
      cursor.close()
      connection.close()

      return jsonify({'success': True, 'message': f'User with ID {user_id} deleted successfully.'})
    else:
      cursor.close()
      connection.close()

      return jsonify({'success': False, 'message': f'User with ID {user_id} does not exist.'})
  except Exception as e:
    return jsonify({'error': str(e)})

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')