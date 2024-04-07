from flask import jsonify, request
from app import app, execute_query

def numToDigits(num):
  return [int(digit) for digit in str(num)]

class Node:
  def __init__(self, val, connections=None):
    self.val = val
    self.connections = connections if connections is not None else []

  def setVal(self, val):
    self.val = val

  def addConnection(self, node):
    self.connections.append(node)


class Graph:
  def __init__(self):
    self.initial = None

  def setInitial(self, node):
    self.initial = node

  def isSolutionValid(self):
    visited = set()  # To keep track of visited nodes

    def dfs(node):
      if node not in visited:
        print(str(node.val))
        visited.add(node)
        digit_sum = 0
        
        for neighbor in node.connections:
          digit_sum += sum(numToDigits(neighbor.val))

        print("Digit sum: %s; Actual value: %s" % (digit_sum, node.val))
        if digit_sum != node.val:
          print("%s is an invalid node." % (node))
        
        for neighbor in node.connections:
          dfs(neighbor)

    if self.initial:
      print("Graph:")
      dfs(self.initial)
    else:
      print("Empty graph")
          
  def printGraph(self):
    visited = set()  # To keep track of visited nodes

    def dfs(node):
      if node not in visited:
        print(str(node.val))
        visited.add(node)
        for neighbor in node.connections:
          print("Connection: ", neighbor.val)
        for neighbor in node.connections:
          dfs(neighbor)

    if self.initial:
      print("Graph:")
      dfs(self.initial)
    else:
      print("Empty graph")

@app.route('/puzzles', methods=['GET'])
def get_puzzles():
  try:
    puzzles = execute_query("SELECT * FROM GraphPuzzles", fetchall=True)
      
    if puzzles:
      return jsonify({'success': True, 'message': 'Fetched all puzzles successfully.', 'result': puzzles})
    else:
      return jsonify({'success': False, 'message': 'Failed to fetch puzzles.'})
  except Exception as e:
    return jsonify({'success': False, 'message': str(e)})

@app.route('/puzzles/add', methods=['POST'])
def add_puzzle():
  try:
    data = request.get_json()
    string_representation = data.get('string_representation')

    execute_query("INSERT INTO GraphPuzzles(str_representation) VALUES (%s)", (string_representation,), fetch=False)

    return jsonify({'success': True, 'message': 'Puzzle added successfully.'})
  except Exception as e:
    return jsonify({'success': False, 'message': str(e)})

@app.route('/puzzles/get/<int:puzzle_id>', methods=['GET'])
def get_puzzle(puzzle_id):
  try: 
    puzzle = execute_query("SELECT * FROM GraphPuzzles WHERE puzzle_id = %s", (puzzle_id,), fetchone=True)

    if puzzle:
      return jsonify({'success': True, 'message': f'Puzzle with ID {puzzle_id} retrieved successfully.', 'result': puzzle})
    else:
      return jsonify({'success': False, 'message': f'Puzzle with ID {puzzle_id} does not exist.'})
  except Exception as e:
    return jsonify({'error': str(e)})

@app.route('/puzzles/delete/<int:puzzle_id>', methods=['DELETE'])
def delete_puzzle(puzzle_id):
  try: 
    puzzle = execute_query("SELECT * FROM GraphPuzzles WHERE puzzle_id = %s", (puzzle_id,))

    if puzzle:
      execute_query("DELETE FROM GraphPuzzles WHERE puzzle_id = %s", (puzzle_id,), fetch=False)

      return jsonify({'success': True, 'message': f'Puzzle with ID {puzzle_id} deleted successfully.'})
    else:
      return jsonify({'success': False, 'message': f'Puzzle with ID {puzzle_id} does not exist.'})
  except Exception as e:
    return jsonify({'error': str(e)})
