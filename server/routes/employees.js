const express = require("express");
const router = express.Router();
const db = require("../database/db");

router.post("/login", (req, res) => {
    const { employeeId } = req.body;

    if (!employeeId) {
        return res.status(400).json({ error: "Employee ID required" });
    }

    db.get(
        "SELECT * FROM employees WHERE employee_id = ?",
        [employeeId],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (!row) {
                return res.status(404).json({ error: "Employee not found" });
            }

            res.json({
                message: "Login successful",
                employee: {
                    ...row,
                    is_admin: row.is_admin === 1
                }
            });
        }
    );
});

// Get all employees
router.get("/", (req, res) => {
    db.all(
        "SELECT * FROM employees ORDER BY name ASC",
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

// Create employee (admin only)
router.post("/", (req, res) => {
    const { employee_id, name, role, is_admin, requesterIsAdmin } = req.body;

    if (!requesterIsAdmin) {
        return res.status(403).json({ error: "Only admins can add employees." });
    }

    if (!employee_id || !name || !role) {
        return res.status(400).json({ error: "employee_id, name, and role are required." });
    }

    db.run(
        `
        INSERT INTO employees (employee_id, name, role, is_admin)
        VALUES (?, ?, ?, ?)
        `,
        [employee_id.trim(), name.trim(), role.trim(), is_admin ? 1 : 0],
        function (err) {
            if (err) {
                return res.status(500).json({ error: "Could not create employee. Employee ID may already exist." });
            }

            res.status(201).json({
                message: "Employee created successfully.",
                employeeId: this.lastID
            });
        }
    );
});

// Update employee (admin only)
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { name, role, is_admin, requesterIsAdmin } = req.body;

    if (!requesterIsAdmin) {
        return res.status(403).json({ error: "Only admins can update employees." });
    }

    if (!name || !role) {
        return res.status(400).json({ error: "name and role are required." });
    }

    db.run(
        `
        UPDATE employees
        SET name = ?, role = ?, is_admin = ?
        WHERE id = ?
        `,
        [name.trim(), role.trim(), is_admin ? 1 : 0, id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: "Employee not found." });
            }

            res.json({ message: "Employee updated successfully." });
        }
    );
});

// Delete employee (admin only)
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    const { requesterIsAdmin } = req.body;

    if (!requesterIsAdmin) {
        return res.status(403).json({ error: "Only admins can delete employees." });
    }

    db.run(
        "DELETE FROM employees WHERE id = ?",
        [id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: "Employee not found." });
            }

            res.json({ message: "Employee deleted successfully." });
        }
    );
});

module.exports = router;