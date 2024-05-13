USE digit_sum_graphs;

CREATE TABLE Users(
	user_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  user_type VARCHAR(6) NOT NULL,
  username VARCHAR(255) NOT NULL UNIQUE,
	email VARCHAR(255) NOT NULL UNIQUE,
	password_hash VARCHAR(255) NOT NULL,
  user_points INT
);

CREATE TABLE GraphPuzzles(
	puzzle_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  number_of_nodes int NOT NULL,
  initial_node int NOT NULL, 
  initial_val int NOT NULL,
  str_representation VARCHAR(255) NOT NULL,
  connections JSON NOT NULL,
  solution VARCHAR(255)
);

CREATE TABLE Gameplays(
  gameplay_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  puzzle_id INT NOT NULL,
  date_completed DATETIME NOT NULL,
  completion_time VARCHAR(10) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES Users(user_id),
  FOREIGN KEY (puzzle_id) REFERENCES GraphPuzzles(puzzle_id)
);