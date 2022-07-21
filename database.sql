CREATE TABLE person(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255),
    middle_name VARCHAR(255),
    last_name VARCHAR(255),
    passport INTEGER,
    tin BIGINTEGER
);

CREATE TABLE account(
    id SERIAL PRIMARY KEY,
    balance INTEGER,
    currency VARCHAR(255),
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES person (id)
);

CREATE TABLE history(
    id SERIAL PRIMARY KEY,
    operation INTEGER,
    date TIMESTAMP,
    account_id INTEGER,
    FOREIGN KEY (account_id) REFERENCES account (id)
);

CREATE TABLE password(
    id SERIAL PRIMARY KEY,
    token VARCHAR(255),
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES person (id)
);
