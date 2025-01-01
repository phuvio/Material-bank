CREATE TABLE IF NOT EXISTS Materials (
    id SERIAL PRIMARY KEY,
    name VARCHAR (50) UNIQUE NOT NULL,
    description VARCHAR(500),
    visible BOOLEAN NOT NULL,
    user_id INTEGER NOT NULL,
    is_URL BOOLEAN,
    URL VARCHAR(120),
    material BYTEA,
    material_type VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR (128) UNIQUE NOT NULL,
    first_name VARCHAR (128) NOT NULL,
    last_name VARCHAR (128) NOT NULL,
    username_iv VARCHAR(128) NOT NULL,
    first_name_iv VARCHAR(128) NOT NULL,
    last_name_iv VARCHAR(128) NOT NULL,
    password VARCHAR(128) NOT NULL,
    role INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Favorites (
    id SERIAL PRIMARY KEY,
    material_id INTEGER REFERENCES Materials(id) ON DELETE CASCADE, 
    user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE
 );

CREATE TABLE IF NOT EXISTS Tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR (50) UNIQUE NOT NULL,
    color VARCHAR (10) NOT NULL
);

CREATE TABLE IF NOT EXISTS Tags_Materials (
    material_id INTEGER REFERENCES Materials(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES Tags(id) ON DELETE CASCADE,
    PRIMARY KEY (material_id, tag_id)
);

CREATE TABLE IF NOT EXISTS Groups (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    material_id INTEGER REFERENCES Materials(id) ON DELETE CASCADE,
    description VARCHAR (500),
    visible BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS Groups_Materials (
    id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES Groups(id) ON DELETE CASCADE,
    material_id INTEGER REFERENCES Materials(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Customers (
    id SERIAL PRIMARY KEY,
    code INTEGER UNIQUE NOT NULL,
    user_id INTEGER REFERENCES Users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Customers_Materials (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES Customers(id) ON DELETE CASCADE, 
    material_id INTEGER REFERENCES Materials(id) ON DELETE CASCADE,
    status VARCHAR(20)
);

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for Materials table
CREATE TRIGGER set_updated_at_materials
BEFORE UPDATE ON Materials
FOR EACH ROW
WHEN (OLD.* IS DISTINCT FROM NEW.*)
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for Users table
CREATE TRIGGER set_updated_at_users
BEFORE UPDATE ON Users
FOR EACH ROW
WHEN (OLD.password IS DISTINCT FROM NEW.password)
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for Customers table
CREATE TRIGGER set_updated_at_customers
BEFORE UPDATE ON Customers
FOR EACH ROW
WHEN (OLD.* IS DISTINCT FROM NEW.*)
EXECUTE FUNCTION update_updated_at_column();
