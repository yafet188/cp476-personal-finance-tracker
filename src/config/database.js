const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Yafetisawsome18!',
  database: 'finance_tracker'
});

connection.connect(function(err) {
  if (err) {
    console.error('Database connection failed:', err.message);
    return;
  }
  console.log('Connected to MySQL database');
});

module.exports = connection;