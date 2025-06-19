CREATE TABLE IF NOT EXISTS users
(
    id         INTEGER PRIMARY KEY AUTOINCREMENT, -- Unique identifier for each user
    username   TEXT NOT NULL UNIQUE,              -- Unique username for each user
    email      TEXT NOT NULL UNIQUE,              -- Unique email for each user
    first_name TEXT NOT NULL,                     -- First name of the user
    last_name  TEXT NOT NULL,                     -- Last name of the user
    password   TEXT NOT NULL                      -- Hashed password for security
)
