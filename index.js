const inquirer = require('inquirer')
const db = require('./db/connection')
const cTable = require('console.table')

//start server after DB connection
db.connect((err) => {
  if (err) throw err
  console.log('*******Database connected*********')
  empDetails()
})

const empDetails = () => {
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'option',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Quit',
        ],
      },
    ])
    .then((answer) => {
      switch (answer.option) {
        case 'View all departments':
          const sql1 = 'SELECT * FROM department'
          db.query(sql1, (error, result) => {
            if (error) throw error
            console.table(result)
            empDetails()
          })
          break
        case 'View all roles':
          const sql2 =
            'select roles.id as id , roles.title as role, roles.salary, department.name as department from roles left join department on roles.department_id=department.id'
          db.query(sql2, (error, result) => {
            if (error) throw error
            console.table(result)
            empDetails()
          })
          break
        case 'View all employees':
          const sql3 =
            'Select EMP.id, EMP.first_name, EMP.last_name,EMP.role, employee.first_name as manager from (select emp.id, emp.first_name, emp.last_name, roles.title as role, emp.manager_id from employee emp left join roles roles on emp.role_id=roles.id ) as EMP left join employee on EMP.manager_id = employee.id'
          db.query(sql3, (error, result) => {
            if (error) throw error
            console.table(result)
            empDetails()
          })
          break

        case 'Add a department':
          inquirer
            .prompt([
              {
                type: 'input',
                name: 'department',
                message: 'What is the name of the department?',
              },
            ])
            .then((answer) => {
              const sqlInsert = 'INSERT INTO department (name) VALUES (?)'
              db.query(sqlInsert, [answer.department], (error, result) => {
                if (error) throw error
                empDetails()
              })
            })
          break

        case 'Add a role':
          inquirer
            .prompt([
              {
                type: 'input',
                name: 'role',
                message: 'What is the role you want to add?',
              },
              {
                type: 'input',
                name: 'salary',
                message: 'What is the salary for the role?',
              },
              {
                type: 'input',
                name: 'department',
                message: 'Which department does the role belong to?',
              },
            ])
            .then((answer) => {
              const sqlSelect = 'SELECT id FROM department where name= ?'
              db.query(sqlSelect, [answer.department], (error, result) => {
                if (error) throw error
                console.log(result)
              })
              empDetails()
            })

          break
        case 'Quit':
          break
      }
    })
}
