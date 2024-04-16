from flask import jsonify, request
from app import app, execute_query
import bcrypt

@app.route('/users', methods=['GET'])
def get_users():
  try:
    users = execute_query("SELECT * FROM Users", fetchall=True)
      
    if users is not None:
      return jsonify({'success': True, 'message': 'Fetched all users successfully', 'users': users})
    else:
      return jsonify({'success': False, 'message': 'Failed to fetch users'})
  except Exception as e:
    return jsonify({'success': False, 'message': f'Error: {str(e)}'})

@app.route('/users/login', methods=['POST'])
def login():
  try:
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = execute_query("SELECT * FROM Users WHERE username = %s", (username,), fetchone=True)
    
    if user and bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
      return jsonify({'success': True, 'message': 'Login successful', 'result': user})
    else:
      return jsonify({'success': False, 'message': 'Invalid username or password.' })
  except Exception as e:
    return jsonify({'success': False, 'message': f'Error: {str(e)}'})

@app.route('/users/add', methods=['POST'])
def add_user():
  try:
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    existing_users  = execute_query("SELECT * FROM Users WHERE username = %s OR email = %s", (username, email), fetchall=True)
    if existing_users:
      return jsonify({'success': False, 'message': 'Account(s) with the provided username or email already exists.'})

    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    execute_query("INSERT INTO Users(username, email, password_hash, user_points) VALUES (%s, %s, %s, %s)", (username, email, password_hash, 0), fetch=False)

    return jsonify({'success': True, 'message': 'User added successfully.'})
  except Exception as e:
    return jsonify({'success': False, 'message': f'Error: {str(e)}'})

@app.route('/users/delete/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
  try: 
    user = execute_query("SELECT * FROM Users WHERE user_id = %s", (user_id,))

    if user:
      execute_query("DELETE FROM Users WHERE user_id = %s", (user_id,), fetch=False)

      return jsonify({'success': True, 'message': f'User with ID {user_id} deleted successfully.'})
    else:
      return jsonify({'success': False, 'message': f'User with ID {user_id} does not exist.'})
  except Exception as e:
    return jsonify({'success': False, 'message': f'Error: {str(e)}'})