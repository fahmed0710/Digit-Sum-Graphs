from flask import jsonify, request
from app import app, execute_query
from datetime import datetime as dt 

@app.route('/gameplays', methods=['GET'])
def get_gameplays():
  try:
    gameplays = execute_query("SELECT * FROM Gameplays", fetchall=True)
      
    return jsonify({'success': True, 'message': 'Fetched all gameplays successfully', 'result': gameplays})
  except Exception as e:
    return jsonify({'success': False, 'message': f'Error: {str(e)}'})

@app.route('/gameplays/get/<int:user_id>', methods=['GET'])
def get_user_gameplays(user_id):
  try:
    gameplays = execute_query("SELECT * FROM Gameplays WHERE user_id = %s", (user_id,), fetchall=True)
      
    return jsonify({'success': True, 'message': 'Fetched all gameplays successfully', 'result': gameplays})
  except Exception as e:
    return jsonify({'success': False, 'message': f'Error: {str(e)}'})

@app.route('/gameplays/add', methods=['POST'])
def add_gameplay():
  try:
    data = request.get_json()
    user_id = data.get('user_id')
    puzzle_id = data.get('puzzle_id')
    completion_time = data.get('completion_time')

    date_completed = dt.now().strftime('%Y-%m-%d %H:%M:%S')

    execute_query("INSERT INTO Gameplays(user_id, puzzle_id, date_completed, completion_time) VALUES (%s, %s, %s, %s)", (user_id, puzzle_id, date_completed, completion_time), fetch=False)

    return jsonify({'success': True, 'message': 'Gameplay created successfully.'})
  except Exception as e:
    return jsonify({'success': False, 'message': f'Error: {str(e)}'})
