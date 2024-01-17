INSERT INTO departments (name) 
VALUES ('Engineering'), ('Human Resources'), ('Sales');

INSERT INTO roles (title, salary, department_id) 
VALUES ('Software Engineer', 70000, 1), ('HR Manager', 60000, 2);

INSERT INTO employees (first_name, last_name, role_id, manager_id) 
VALUES ('John', 'Doe', 1, NULL), ('Jane', 'Smith', 2, 1);
