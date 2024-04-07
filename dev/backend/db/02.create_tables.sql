USE digit_sum_graphs;

CREATE TABLE Users(
	user_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL UNIQUE,
	email VARCHAR(255) NOT NULL UNIQUE,
	password_hash VARCHAR(255) NOT NULL,
  user_points INT
);

CREATE TABLE GraphPuzzles(
	puzzle_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  number_of_nodes int NOT NULL,
  initial_node_idx int NOT NULL, 
  initial_node_val int NOT NULL,
  str_representation VARCHAR(255) NOT NULL
);