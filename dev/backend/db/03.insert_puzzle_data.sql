USE digit_sum_graphs;

-- Insert admin user
INSERT INTO Users(user_id, user_type, username, email, password_hash, user_points) VALUES
(1, "admin", "adminf", "farihaaahmed@gmail.com", "$2b$12$o6LsMx8xbk.OP1Fje8XRnO7EsRYObvFEkCt88.V5U/UtFMEWyjsGS", 0);

-- Insert graph puzzles
INSERT INTO GraphPuzzles(number_of_nodes, initial_node, initial_val, str_representation, connections) VALUES
  (3, 2, 18, "1-2-3", '[ [2], [1, 3], [2] ]');

INSERT INTO GraphPuzzles(number_of_nodes, initial_node, initial_val, str_representation, connections) VALUES
  (4, 1, 9, "1-2-3\n  |  \n  4  ", '[ [2], [1, 3, 4], [2], [2] ]');

INSERT INTO GraphPuzzles(number_of_nodes, initial_node, initial_val, str_representation, connections) VALUES
  (4, 1, 12, "1-2\n| |\n3-4", '[ [2, 3], [1, 4], [1, 4], [2, 3] ]');

INSERT INTO GraphPuzzles(number_of_nodes, initial_node, initial_val, str_representation, connections) VALUES
  (4, 1, 18, "1-2\n| |\n3-4", '[ [2, 3], [1, 4], [1, 4], [2, 3] ]');

-- INSERT INTO GraphPuzzles(number_of_nodes, str_representation) VALUES
--   (5, "1-2-3-4-5");

-- INSERT INTO GraphPuzzles(number_of_nodes, str_representation) VALUES
--   (8, "1-2-3-4-5-6-7-8");

-- INSERT INTO GraphPuzzles(number_of_nodes, str_representation) VALUES
--   (11, "1-2-3-4-5-6-7-8-9-10-11");

-- INSERT INTO GraphPuzzles(number_of_nodes, str_representation) VALUES
--   (3, "1-2\n\\ /\n 3 ");

-- INSERT INTO GraphPuzzles(number_of_nodes, str_representation) VALUES
--   (6, " 1-2 \n/   \\\n3   4\n\\   /\n 5-6 ");

-- INSERT INTO GraphPuzzles(number_of_nodes, str_representation) VALUES
--   (5, "1---2\n|\\ /|\n| 3 |\n|/ \\|\n4---5");


