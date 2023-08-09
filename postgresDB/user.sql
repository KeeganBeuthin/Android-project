CREATE TABLE accounts (
    user_id serial PRIMARY KEY,
    username VARCHAR (50)  NOT  NULL,
    password VARCHAR (50) NOT NULL,
    email VARCHAR (255)  NOT NULL,
    created_on TIMESTAMP NOT NULL
);
INSERT INTO accounts(username, password, email, created_on)
VALUES('user', 'pass', 'test@gmail.com', CURRENT_TIMESTAMP);

CREATE TABLE tokens (
    id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
)