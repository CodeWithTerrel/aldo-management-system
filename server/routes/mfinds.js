const express = require("express");
const router = express.Router();
const db = require("../database/db");

// Get all M-Finds
router.get("/", (req, res) => {
    db.all(
        "SELECT * FROM mfinds ORDER BY id ASC",
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            const formattedRows = rows.map((row) => ({
                ...row,
                is_available: row.is_available === 1
            }));

            res.json(formattedRows);
        }
    );
});

// Create M-Find (admin only)
router.post("/", (req, res) => {
    const { mfindName, isAdmin } = req.body;

    if (!isAdmin) {
        return res.status(403).json({ error: "Only admins can create M-Finds." });
    }

    if (!mfindName || !mfindName.trim()) {
        return res.status(400).json({ error: "M-Find name is required." });
    }

    db.run(
        "INSERT INTO mfinds (mfind_name, is_available) VALUES (?, 1)",
        [mfindName.trim()],
        function (err) {
            if (err) {
                return res.status(500).json({ error: "Could not create M-Find. It may already exist." });
            }

            res.status(201).json({
                message: "M-Find created successfully.",
                mfind: {
                    id: this.lastID,
                    mfind_name: mfindName.trim(),
                    is_available: true
                }
            });
        }
    );
});

// Delete M-Find (admin only)
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    const { isAdmin } = req.body;

    if (!isAdmin) {
        return res.status(403).json({ error: "Only admins can delete M-Finds." });
    }

    db.get(
        "SELECT * FROM mfinds WHERE id = ?",
        [id],
        (findErr, foundRow) => {
            if (findErr) {
                return res.status(500).json({ error: findErr.message });
            }

            if (!foundRow) {
                return res.status(404).json({ error: "M-Find not found." });
            }

            if (foundRow.is_available === 0) {
                return res.status(400).json({ error: "Cannot delete an M-Find that is currently assigned." });
            }

            db.run(
                "DELETE FROM mfinds WHERE id = ?",
                [id],
                function (deleteErr) {
                    if (deleteErr) {
                        return res.status(500).json({ error: deleteErr.message });
                    }

                    res.json({ message: "M-Find deleted successfully." });
                }
            );
        }
    );
});

// Get current active assignment for a logged-in employee
router.get("/assignments/current/:employeeDbId", (req, res) => {
    const { employeeDbId } = req.params;

    db.get(
        `
        SELECT 
            mfind_assignments.id AS assignment_id,
            mfind_assignments.employee_id,
            mfind_assignments.mfind_id,
            mfind_assignments.assigned_at,
            mfind_assignments.status,
            mfinds.mfind_name
        FROM mfind_assignments
        INNER JOIN mfinds ON mfind_assignments.mfind_id = mfinds.id
        WHERE mfind_assignments.employee_id = ?
          AND mfind_assignments.status = 'active'
        ORDER BY mfind_assignments.id DESC
        LIMIT 1
        `,
        [employeeDbId],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json(row || null);
        }
    );
});

// Assign M-Find to employee
router.post("/assign", (req, res) => {
    const { employeeDbId, mfindId } = req.body;

    if (!employeeDbId || !mfindId) {
        return res.status(400).json({ error: "employeeDbId and mfindId are required." });
    }

    db.get(
        "SELECT * FROM mfind_assignments WHERE employee_id = ? AND status = 'active'",
        [employeeDbId],
        (assignmentErr, activeAssignment) => {
            if (assignmentErr) {
                return res.status(500).json({ error: assignmentErr.message });
            }

            if (activeAssignment) {
                return res.status(400).json({ error: "Employee already has an active M-Find assigned." });
            }

            db.get(
                "SELECT * FROM mfinds WHERE id = ?",
                [mfindId],
                (mfindErr, mfindRow) => {
                    if (mfindErr) {
                        return res.status(500).json({ error: mfindErr.message });
                    }

                    if (!mfindRow) {
                        return res.status(404).json({ error: "M-Find not found." });
                    }

                    if (mfindRow.is_available === 0) {
                        return res.status(400).json({ error: "This M-Find is already unavailable." });
                    }

                    const assignedAt = new Date().toISOString();

                    db.run(
                        `
                        INSERT INTO mfind_assignments (employee_id, mfind_id, assigned_at, status)
                        VALUES (?, ?, ?, 'active')
                        `,
                        [employeeDbId, mfindId, assignedAt],
                        function (insertErr) {
                            if (insertErr) {
                                return res.status(500).json({ error: insertErr.message });
                            }

                            db.run(
                                "UPDATE mfinds SET is_available = 0 WHERE id = ?",
                                [mfindId],
                                function (updateErr) {
                                    if (updateErr) {
                                        return res.status(500).json({ error: updateErr.message });
                                    }

                                    res.status(201).json({
                                        message: "M-Find assigned successfully."
                                    });
                                }
                            );
                        }
                    );
                }
            );
        }
    );
});

// Release current active assignment
router.post("/release", (req, res) => {
    const { employeeDbId } = req.body;

    if (!employeeDbId) {
        return res.status(400).json({ error: "employeeDbId is required." });
    }

    db.get(
        "SELECT * FROM mfind_assignments WHERE employee_id = ? AND status = 'active'",
        [employeeDbId],
        (assignmentErr, activeAssignment) => {
            if (assignmentErr) {
                return res.status(500).json({ error: assignmentErr.message });
            }

            if (!activeAssignment) {
                return res.status(404).json({ error: "No active M-Find assignment found." });
            }

            const releasedAt = new Date().toISOString();

            db.run(
                `
                UPDATE mfind_assignments
                SET status = 'released', released_at = ?
                WHERE id = ?
                `,
                [releasedAt, activeAssignment.id],
                function (updateAssignmentErr) {
                    if (updateAssignmentErr) {
                        return res.status(500).json({ error: updateAssignmentErr.message });
                    }

                    db.run(
                        "UPDATE mfinds SET is_available = 1 WHERE id = ?",
                        [activeAssignment.mfind_id],
                        function (updateMfindErr) {
                            if (updateMfindErr) {
                                return res.status(500).json({ error: updateMfindErr.message });
                            }

                            res.json({ message: "M-Find released successfully." });
                        }
                    );
                }
            );
        }
    );
});

module.exports = router;