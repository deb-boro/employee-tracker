INSERT INTO department (name)
VALUES
  ('sales'),('finance'),('engineering'),('legal');

INSERT INTO roles (title,salary,department_id)
VALUES
  ('Engineering Lead', 82000, 3 ),
  ('senior lawyer', 182000, 4 ),
  ('senior accountant', 100000, 2 ),
  ('sales Lead', 82000, 1 ),
  ('Software Engineer', 75000, 3 ),
  ('Legal Team Lead', 142000, 4 ),
  ('Account Manager', 140000, 2 ),
  ('area sales manager', 95000, 1 );

  INSERT INTO employee (first_name, last_name, role_id)
VALUES
  ('James', 'Fraser', 4),
  ('Jack', 'London', 3),
  ('Robert', 'Bruce', 8),
  ('Peter', 'Greenaway',1),
  ('Derek', 'Jarman', 2),
  ('Paolo', 'Pasolini', 5),
  ('Heathcote', 'Williams',6),
  ('Sandy', 'Powell', 7);

  UPDATE employee set manager_id= 4 where id = 1;
  UPDATE employee set manager_id= 5 where id = 4;
  UPDATE employee set manager_id= 2 where id = 3;
  UPDATE employee set manager_id= 6 where id = 2;
  UPDATE employee set manager_id= 7 where id = 5;
  UPDATE employee set manager_id= 1 where id = 6;
  
  