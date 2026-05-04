const db = require("./database/db");

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS employees (
                                                 id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                 employee_id TEXT UNIQUE NOT NULL,
                                                 name TEXT NOT NULL,
                                                 role TEXT NOT NULL,
                                                 is_admin INTEGER DEFAULT 0
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS mfinds (
                                              id INTEGER PRIMARY KEY AUTOINCREMENT,
                                              mfind_name TEXT UNIQUE NOT NULL,
                                              is_available INTEGER DEFAULT 1
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS mfind_assignments (
                                                         id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                         employee_id INTEGER NOT NULL,
                                                         mfind_id INTEGER NOT NULL,
                                                         assigned_at TEXT NOT NULL,
                                                         released_at TEXT,
                                                         status TEXT DEFAULT 'active',
                                                         FOREIGN KEY (employee_id) REFERENCES employees(id),
            FOREIGN KEY (mfind_id) REFERENCES mfinds(id)
            )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS bathroom_schedule (
                                                         id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                         employee_id INTEGER NOT NULL,
                                                         schedule_date TEXT NOT NULL,
                                                         assigned_by_employee_id INTEGER,
                                                         created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                                                         FOREIGN KEY (employee_id) REFERENCES employees(id),
            FOREIGN KEY (assigned_by_employee_id) REFERENCES employees(id)
            )
    `);

    db.run(`DELETE FROM employees`);
    db.run(`DELETE FROM mfinds`);
    db.run(`DELETE FROM mfind_assignments`);
    db.run(`DELETE FROM bathroom_schedule`);

    const employees = [
        { id: "46776953", name: "Angel Ime", role: "Sales Lead", admin: 0 },
        { id: "46775373", name: "Cassie Kulcsar", role: "Sales Lead", admin: 0 },
        { id: "46759508", name: "Charlisse Feliciano", role: "Sales Associate", admin: 0 },
        { id: "46777024", name: "Grace Renner", role: "Sales Lead", admin: 0 },
        { id: "46759689", name: "Grace Schultz", role: "Manager", admin: 1 },
        { id: "46776306", name: "Karissa Lalonde", role: "Sales Lead", admin: 0 },
        { id: "46755384", name: "Kate Chavez", role: "Sales Associate", admin: 0 },
        { id: "46776346", name: "Poppy-May Gibb-Radtke", role: "Assistant Manager", admin: 1 },
        { id: "46762675", name: "Shaikh Ahmed", role: "Stock Coordinator", admin: 0 },
        { id: "46762735", name: "Terrel Lambo Matute Esunge", role: "Stock Coordinator", admin: 1 },
        { id: "46777477", name: "Valerie Njoku", role: "Sales Lead", admin: 0 }
    ];

    const employeeStmt = db.prepare(`
        INSERT INTO employees (employee_id, name, role, is_admin)
        VALUES (?, ?, ?, ?)
    `);

    employees.forEach((employee) => {
        employeeStmt.run(
            employee.id,
            employee.name,
            employee.role,
            employee.admin
        );
    });

    employeeStmt.finalize();

    const mfindStmt = db.prepare(`
        INSERT INTO mfinds (mfind_name, is_available)
        VALUES (?, ?)
    `);

    const starterMfinds = [
        "M-Find 1",
        "M-Find 2",
        "M-Find 3",
        "M-Find 4"
    ];

    starterMfinds.forEach((mfindName) => {
        mfindStmt.run(mfindName, 1);
    });

    mfindStmt.finalize();

    console.log("Database initialized successfully.");
});

db.close();