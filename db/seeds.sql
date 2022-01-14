INSERT INTO department (id, name)
VALUES
    (1, 'Management'),
    (2, 'Design & Production');

INSERT INTO role (id, title, salary, department_id)
VALUES
    (1, 'Owner', 100000.00, 1),
    (2, 'Manager', 900000.00, 1),
    (3, 'Designer', 50000.00, 2),
    (4, 'Production', 50000.00, 2);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
    (1, 'Ookina', 'Missy', 1, NULL),
    (2, 'Chiisana', 'Missy', 2, 1),
    (3, 'Pablo', 'Scratchy', 3, 2),
    (4, 'Shelly', 'Whitehaus', 3, 2),
    (5, 'Miller', 'Offset', 4, 2),
    (6, 'Diane', 'Bestdeal', 4, 2);