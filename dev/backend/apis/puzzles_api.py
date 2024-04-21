from flask import jsonify, request
from app import app, execute_query
import json

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
    self.nodes = []

  def setInitial(self, node):
    if node not in self.nodes:
      self.nodes.append(node)
    self.initial = node

  def addNode(self, node):
    self.nodes.append(node)

  def getNodeIdx(self, node):
    for idx, n in enumerate(self.nodes):
      if n == node:
        return idx

  def setGraph(self, node_set, connections_set, init_node):
    for idx, node_val in enumerate(node_set):
      node = Node(node_val)
      self.addNode(node)

      if(idx == (init_node - 1)):
        self.setInitial(node)

    for idx, node in enumerate(self.nodes):
      connections = connections_set[idx]
      for c in connections:
        connection = self.nodes[c - 1]
        node.addConnection(connection)
    

  def isSolutionValid(self):
    visited = set()  
    invalid_nodes = []

    def dfs(node):
      if node not in visited:
        visited.add(node)
        digit_sum = 0
        
        for connection in node.connections:
          digit_sum += sum(numToDigits(connection.val))
          dfs(connection)

        if digit_sum != node.val:
          invalid_nodes.append(self.getNodeIdx(node))

    if self.initial:
      dfs(self.initial)

    return invalid_nodes

@app.route('/puzzles', methods=['GET'])
def get_puzzles():
  try:
    puzzles = execute_query("SELECT * FROM GraphPuzzles", fetchall=True)
      
    if puzzles:
      return jsonify({'success': True, 'message': 'Fetched all puzzles successfully.', 'result': puzzles})
    else:
      return jsonify({'success': False, 'message': 'Failed to fetch puzzles.'})
  except Exception as e:
    return jsonify({'success': False, 'message': f'Error: {str(e)}'})

@app.route('/puzzles/add', methods=['POST'])
def add_puzzle():
  try:
    data = request.get_json()
    string_representation = data.get('string_representation')

    execute_query("INSERT INTO GraphPuzzles(str_representation) VALUES (%s)", (string_representation,), fetch=False)

    return jsonify({'success': True, 'message': 'Puzzle added successfully.'})
  except Exception as e:
    return jsonify({'success': False, 'message': f'Error: {str(e)}'})

@app.route('/puzzles/get/<int:puzzle_id>', methods=['GET'])
def get_puzzle(puzzle_id):
  try: 
    puzzle = execute_query("SELECT * FROM GraphPuzzles WHERE puzzle_id = %s", (puzzle_id,), fetchone=True)

    if puzzle:
      return jsonify({'success': True, 'message': f'Puzzle with ID {puzzle_id} retrieved successfully.', 'result': puzzle})
    else:
      return jsonify({'success': False, 'message': f'Puzzle with ID {puzzle_id} does not exist.'})
  except Exception as e:
    return jsonify({'success': False, 'message': f'Error: {str(e)}'})

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
    return jsonify({'success': False, 'message': f'Error: {str(e)}'})

@app.route('/puzzles/check/solution/<int:puzzle_id>', methods=['POST'])
def validate_solution(puzzle_id):
  try:
    data = request.get_json()
    solution_set = data.get('solution_set')

    puzzle = execute_query("SELECT * FROM GraphPuzzles WHERE puzzle_id = %s", (puzzle_id,), fetchone=True)
    initial_node = int(puzzle['initial_node'])
    connections = json.loads(puzzle['connections'])

    graph = Graph()
    
    graph.setGraph(solution_set, connections, initial_node)
    result = graph.isSolutionValid()
    
    if result == []:
      return jsonify({'success': True, 'message': 'Solution is valid.', 'result': result})
    else:
      return jsonify({'success': False, 'message': 'Solution is not valid.', 'result': result })
  except Exception as e:
    return jsonify({'success': False, 'message': f'Error: {str(e)}'})
