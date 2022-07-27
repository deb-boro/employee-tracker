const inquirer = require('inquirer')
const db = require('./db/connection')
const cTable = require('console.table')

//start server after DB connection
db.connect((err) => {
  if (err) throw err
  console.log('*******Database connected*********')
  empDetails()
})
async function deptChoices() {
  db.query('SELECT * FROM department', (error, result) => {
    if (error) throw error
    let departments = [result]
    const departmentChoices = departments.map(({ id, named }) => ({
      name: named,
      value: id,
    }))
  })
}

const empDetails = async () => {
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
            'Select EMP.id, EMP.first_name, EMP.last_name,EMP.role, CONCAT(employee.first_name, " ", employee.last_name) as Manager from (select emp.id, emp.first_name, emp.last_name, roles.title as role, emp.manager_id from employee emp left join roles roles on emp.role_id=roles.id ) as EMP left join employee on EMP.manager_id = employee.id'
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
                console.log(
                  `.......Adding ${answer.department} to the department.......`,
                )
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
                choices: deptChoices(),
              },
            ])
            .then((answer) => {
              const sqlSelect = 'SELECT id FROM department where name= ?'
              db.query(sqlSelect, [answer.department], (error, result) => {
                if (error) throw error
                const rolesID = result[0].id
                const role = answer.role
                const salary = answer.salary
                const sqlInsert =
                  'Insert into roles (title, salary, department_id) values (?, ?, ?)'
                db.query(
                  sqlInsert,
                  [role, salary, rolesID],
                  (error, result) => {
                    if (error) throw error
                  },
                )

                empDetails()
              })
            })
          break
        case 'Add an employee':
          inquirer
            .prompt([
              {
                type: 'input',
                name: 'first_name',
                message: 'What is the first name? ',
              },
              {
                type: 'input',
                name: 'last_name',
                message: 'What is the last name? ',
              },
              {
                type: 'input',
                name: 'role',
                message: 'What is the role? ',
              },
              {
                type: 'input',
                name: 'manager',
                message: 'Enter manager name? ',
              },
            ])
            .then((answer) => {
              const sqlSelect = 'SELECT id FROM roles where title = ?'
              db.query(sqlSelect, [answer.role], (error, result) => {
                if (error) throw error
                const rolesID = result[0].id
                const first_name = answer.first_name
                const last_name = answer.last_name
                const manager_name = answer.manager
                const [
                  firstName_Manager,
                  lastName_Manager,
                ] = manager_name.split(' ')

                const sqlSelect2 =
                  'select id from employee where first_name = ? and last_name= ?'
                db.query(
                  sqlSelect2,
                  [firstName_Manager, lastName_Manager],
                  (error, result) => {
                    if (error) throw error
                    const manager_id = result[0].id
                    const sqlInsert =
                      'insert into employee (first_name, last_name,role_id,manager_id) values (?,?,?,?)'
                    db.query(
                      sqlInsert,
                      [first_name, last_name, rolesID, manager_id],
                      (error, result) => {
                        if (error) throw error
                      },
                    )
                  },
                )

                empDetails()
              })
            })
          break
        case 'Update an employee role':
          inquirer
            .prompt([
              {
                type: 'input',
                name: 'employee_name',
                message: 'What is the name of the employee?',
              },
              {
                type: 'input',
                name: 'role',
                message: 'What is the new role?',
              },
            ])
            .then((answer) => {
              const [first_name, last_name] = answer.employee_name.split(' ')

              const sqlSelect4 =
                'select role_id from employee where first_name=? and last_name=?'

              db.query(sqlSelect4, [first_name, last_name], (error, result) => {
                const role_id = result[0].role_id
                const sqlUpdate = 'update roles set title=? where id=?'

                db.query(sqlUpdate, [answer.role, role_id], (error, result) => {
                  if (error) throw error
                  empDetails()
                })
              })
            })
          break

        case 'Quit':
          console.log('.......... Bye for now............')
          db.end()
          break
      }
    })
}
