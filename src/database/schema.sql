create database if not EXISTS finance_tracker;
use finance_tracker;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(200) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(50) NOT NULL,
    type ENUM('expense', 'income') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT,
    date DATE NOT NULL,
    type ENUM('expense', 'income') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    note TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS budgets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT,
    year INT NOT NULL,
    month INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Default categories
INSERT IGNORE INTO categories (id, user_id, name, type) VALUES
    (1, NULL, 'Food & Dining', 'expense'),
    (2, NULL, 'Transportation', 'expense'),
    (3, NULL, 'Entertainment', 'expense'),
    (4, NULL, 'Other', 'expense');