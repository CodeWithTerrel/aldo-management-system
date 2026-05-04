const express = require("express");
const router = express.Router();
const db = require("../database/db");

function getTodayDateString() {
    return new Date().toISOString().split("T")[0];
}

function getNextSevenDates() {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 7; i += 1) {
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i);
        dates.push(nextDate.toISOString().split("T")[0]);
    }

    return dates;
}

// Get all employees for dropdown selection
router.get("/employees", (req, res) => {
    db.all(
        "SELECT id, employee_id, name, role, is_admin FROM employees ORDER BY name ASC",
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            const formattedRows = rows.map((row) => ({
                ...row,
                is_admin: row.is_admin === 1
            }));

            res.json(formattedRows);
        }
    );
});

// Get all bathroom schedule entries
router.get("/", (req, res) => {
    db.all(
        `
        SELECT
            bathroom_schedule.id,
            bathroom_schedule.schedule_date,
            bathroom_schedule.employee_id,
            employees.name,
            employees.role
        FROM bathroom_schedule
        INNER JOIN employees ON bathroom_schedule.employee_id = employees.id
        ORDER BY bathroom_schedule.schedule_date ASC, employees.name ASC
        `,
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json(rows);
        }
    );
});

// Get today's bathroom assignment for a specific employee
router.get("/today/:employeeDbId", (req, res) => {
    const { employeeDbId } = req.params;
    const today = getTodayDateString();

    db.get(
        `
        SELECT
            bathroom_schedule.id,
            bathroom_schedule.schedule_date,
            bathroom_schedule.employee_id,
            employees.name,
            employees.role
        FROM bathroom_schedule
        INNER JOIN employees ON bathroom_schedule.employee_id = employees.id
        WHERE bathroom_schedule.employee_id = ?
          AND bathroom_schedule.schedule_date = ?
        LIMIT 1
        `,
        [employeeDbId, today],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json(row || null);
        }
    );
});

// Create a manual bathroom assignment (admin only)
router.post("/", (req, res) => {
    const { employeeDbId, scheduleDate, isAdmin, assignedByEmployeeDbId } = req.body;

    if (!isAdmin) {
        return res.status(403).json({ error: "Only admins can create bathroom assignments." });
    }

    if (!employeeDbId || !scheduleDate) {
        return res.status(400).json({ error: "employeeDbId and scheduleDate are required." });
    }

    db.get(
        `
        SELECT * FROM bathroom_schedule
        WHERE employee_id = ? AND schedule_date = ?
        `,
        [employeeDbId, scheduleDate],
        (checkErr, existingRow) => {
            if (checkErr) {
                return res.status(500).json({ error: checkErr.message });
            }

            if (existingRow) {
                return res.status(400).json({ error: "That employee is already scheduled for that date." });
            }

            db.run(
                `
                INSERT INTO bathroom_schedule (employee_id, schedule_date, assigned_by_employee_id)
                VALUES (?, ?, ?)
                `,
                [employeeDbId, scheduleDate, assignedByEmployeeDbId || null],
                function (insertErr) {
                    if (insertErr) {
                        return res.status(500).json({ error: insertErr.message });
                    }

                    res.status(201).json({
                        message: "Bathroom assignment created successfully.",
                        scheduleId: this.lastID
                    });
                }
            );
        }
    );
});

// Delete a bathroom schedule entry (admin only)
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    const { isAdmin } = req.body;

    if (!isAdmin) {
        return res.status(403).json({ error: "Only admins can delete bathroom assignments." });
    }

    db.run(
        "DELETE FROM bathroom_schedule WHERE id = ?",
        [id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: "Bathroom assignment not found." });
            }

            res.json({ message: "Bathroom assignment deleted successfully." });
        }
    );
});

// Auto-assign next 7 days (admin only)
router.post("/auto-assign", (req, res) => {
    const { isAdmin, assignedByEmployeeDbId } = req.body;

    if (!isAdmin) {
        return res.status(403).json({ error: "Only admins can auto-assign bathroom schedules." });
    }

    db.all(
        "SELECT id, name FROM employees ORDER BY name ASC",
        [],
        (employeeErr, employees) => {
            if (employeeErr) {
                return res.status(500).json({ error: employeeErr.message });
            }

            if (!employees || employees.length === 0) {
                return res.status(400).json({ error: "No employees found." });
            }

            const nextSevenDates = getNextSevenDates();

            db.run("DELETE FROM bathroom_schedule", [], (deleteErr) => {
                if (deleteErr) {
                    return res.status(500).json({ error: deleteErr.message });
                }

                const stmt = db.prepare(
                    `
                    INSERT INTO bathroom_schedule (employee_id, schedule_date, assigned_by_employee_id)
                    VALUES (?, ?, ?)
                    `
                );

                nextSevenDates.forEach((date, index) => {
                    const employee = employees[index % employees.length];
                    stmt.run(employee.id, date, assignedByEmployeeDbId || null);
                });

                stmt.finalize((finalizeErr) => {
                    if (finalizeErr) {
                        return res.status(500).json({ error: finalizeErr.message });
                    }

                    res.json({ message: "Bathroom schedule auto-assigned for the next 7 days." });
                });
            });
        }
    );
});

module.exports = router;