CREATE SCHEMA IF NOT EXISTS digit_sum_graphs;

USE digit_sum_graphs;

CREATE TABLE Users(
	user_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL UNIQUE,
	email VARCHAR(255) NOT NULL UNIQUE,
	password_hash VARCHAR(255) NOT NULL,
  user_points INT
);

-- Insert initial data for user table
INSERT INTO Users(username, email, password_hash, user_points) VALUES
	("sarah123", "sarahlee@gmail.com", "password", 0);

INSERT INTO Users(username, email, password_hash, user_points) VALUES
	("dondraper", "ddraper@gmail.com", "password", 0);


