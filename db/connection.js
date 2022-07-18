const mysql = require('mysql2')
//connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    //your MYSQL username
    user: 'root',
    //password
    password: 'lemon817',
    database: 'company_db',
  },
  console.log('Connected to the company_db database'),
)

module.exports = db
