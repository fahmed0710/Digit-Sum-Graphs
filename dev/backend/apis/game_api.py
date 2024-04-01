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