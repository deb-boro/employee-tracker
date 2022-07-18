const inquirer = require('inquirer')
const db = require('./db/connection')

//start server after DB connection
db.connect((err) => {
  if (err) throw err
  console.log('Database connected')
  addEmployee()
})

function addEmployee() {
  const sql1 = `select * from employee`

  const sql2 = `select * from department`

  db.query(sql1, function (err, res1) {
    if (err) throw err
    db.query(sql2, function (err, res2) {
      if (err) throw err

      inquirer
        .prompt([
          {
            type: 'input',
            name: 'first_name',
            message: "What is the employee's first name?",
          },
          {
            type: 'input',
            name: 'last_name',
            message: "What is the employee's last name?",
          },
          {
            type: 'rawlist',
            name: 'role_id',
            message: "What is the employee's position?",
            choices: function () {
              let rolesArr = []
              for (let i = 0; i < res1.length; i++) {
                rolesArr.push({ name: res1[i].Position, value: res1[i].id })
              }
              return rolesArr
            },
          },
          {
            type: 'rawlist',
            name: 'manager_id',
            message: "Who is this employee's manager?",
            choices: function () {
              let managerArr = []
              for (let i = 0; i < res2.length; i++) {
                managerArr.push({ name: res2[i].Manager, value: res2[i].id })
              }
              return managerArr
            },
          },
        ])
        // .then((answer) => {
        //   db.query(
        //     `INSERT INTO employee (first_name, last_name, role_id , manager_id) VALUES (?,?,?,?)`,
        //     [
        //       answer.first_name,
        //       answer.last_name,
        //       answer.role_id,
        //       answer.manager_id,
        //     ],
        //     (err, res) => {
        //       console.table(res, answer)
        //     },
        //   )
        // })
        .then((data) => {
          const sql = `SELECT department.id, name AS "Department" FROM department`
          db.query(sql, function (err, res) {
            if (err) throw err

            inquirer
              .prompt([
                {
                  name: 'name',
                  type: 'input',
                  message: 'What department would you like to add?',
                },
              ])
              .then((answer) => {
                db.query(
                  `INSERT INTO departments (name) VALUE (?)`,
                  [answer.name],
                  (err, answer) => {
                    console.table(res, answer)
                    return answer
                  },
                )
              })
          })
        })
    })
  })
}
