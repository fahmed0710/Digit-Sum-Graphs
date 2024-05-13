USE digit_sum_graphs;

-- Insert admin user
INSERT INTO Users(user_id, user_type, username, email, password_hash, user_points) VALUES
(1, "admin", "adminf", "farihaaahmed@gmail.com", "$2b$12$o6LsMx8xbk.OP1Fje8XRnO7EsRYObvFEkCt88.V5U/UtFMEWyjsGS", 0);

-- Insert graph puzzles
INSERT INTO GraphPuzzles(number_of_nodes, initial_node, initial_val, str_representation, connections, solution) VALUES
  (3, 2, 18, "1-2-3", '[ [2], [1, 3], [2] ]', "9-18-9");

INSERT INTO GraphPuzzles(number_of_nodes, initial_node, initial_val, str_representation, connections, solution) VALUES
  (4, 1, 9, "1-2-3\n  |  \n  4  ", '[ [2], [1, 3, 4], [2], [2] ]', "9-27-9\n  |  \n  9  ");

INSERT INTO GraphPuzzles(number_of_nodes, initial_node, initial_val, str_representation, connections, solution) VALUES
  (4, 1, 12, "1-2\n| |\n3-4", '[ [2, 3], [1, 4], [1, 4], [2, 3] ]', "12-6\n| |\n6-12");

INSERT INTO GraphPuzzles(number_of_nodes, initial_node, initial_val, str_representation, connections, solution) VALUES
  (4, 1, 18, "1-2\n| |\n3-4", '[ [2, 3], [1, 4], [1, 4], [2, 3] ]', "18-18\n| |\n18-18");

-- INSERT INTO GraphPuzzles(number_of_nodes, initial_node, initial_val, str_representation, connections) VALUES
--  (5, 1, 6, "1-2-3-4-5", '[ [2], [1, 3], [2, 4], [3, 5], [4] ]');

-- INSERT INTO GraphPuzzles(number_of_nodes, initial_node, initial_val, str_representation, connections) VALUES
--  (8, 1, 4, "1-2-3-4-5-6-7-8", '[ [2], [1, 3], [2, 4], [3, 5], [4, 6], [5, 7], [6, 8], [7] ]');

INSERT INTO GraphPuzzles(number_of_nodes, initial_node, initial_val, str_representation, connections, solution) VALUES
  (5, 3, 18, "1---2\n|\\ /|\n| 3 |\n|/ \\|\n4---5", '[ [2, 3, 4], [1, 3, 5], [1, 2, 4, 5], [1, 3, 5], [2, 3, 4] ]', "15---21\n|\\ /|\n| 18 |\n|/ \\|\n21---15");

-- INSERT INTO GraphPuzzles(number_of_nodes, str_representation) VALUES
--   (3, "1-2\n\\ /\n 3 ");

-- INSERT INTO GraphPuzzles(number_of_nodes, str_representation) VALUES
--   (6, " 1-2 \n/   \\\n3   4\n\\   /\n 5-6 ");