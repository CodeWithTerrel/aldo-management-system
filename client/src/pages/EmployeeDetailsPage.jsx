import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import {
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
} from "../services/api";

export default function EmployeeDetailsPage() {
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [newEmployeeId, setNewEmployeeId] = useState("");
    const [newEmployeeName, setNewEmployeeName] = useState("");
    const [newEmployeeRole, setNewEmployeeRole] = useState("");
    const [newEmployeeIsAdmin, setNewEmployeeIsAdmin] = useState(false);

    const [editingEmployeeId, setEditingEmployeeId] = useState(null);
    const [editingName, setEditingName] = useState("");
    const [editingRole, setEditingRole] = useState("");
    const [editingIsAdmin, setEditingIsAdmin] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const storedEmployee = localStorage.getItem("employee");

        if (!storedEmployee) {
            navigate("/");
            return;
        }

        const parsedEmployee = JSON.parse(storedEmployee);
        setCurrentEmployee(parsedEmployee);
    }, [navigate]);

    useEffect(() => {
        if (currentEmployee) {
            loadEmployees();
        }
    }, [currentEmployee]);

    async function loadEmployees() {
        try {
            const { response, data } = await getEmployees();

            if (!response.ok) {
                setErrorMessage("Could not load employees.");
                return;
            }

            setEmployees(data);
        } catch (error) {
            console.error(error);
            setErrorMessage("Could not load employees.");
        }
    }

    async function handleCreateEmployee(event) {
        event.preventDefault();
        setMessage("");
        setErrorMessage("");

        if (!newEmployeeId.trim() || !newEmployeeName.trim() || !newEmployeeRole.trim()) {
            setErrorMessage("Please fill in all employee fields.");
            return;
        }

        try {
            const { response, data } = await createEmployee({
                employee_id: newEmployeeId,
                name: newEmployeeName,
                role: newEmployeeRole,
                is_admin: newEmployeeIsAdmin,
                requesterIsAdmin: currentEmployee.is_admin
            });

            if (!response.ok) {
                setErrorMessage(data.error || "Could not create employee.");
                return;
            }

            setMessage(data.message);
            setNewEmployeeId("");
            setNewEmployeeName("");
            setNewEmployeeRole("");
            setNewEmployeeIsAdmin(false);
            loadEmployees();
        } catch (error) {
            console.error(error);
            setErrorMessage("Could not create employee.");
        }
    }

    function startEditing(employee) {
        setEditingEmployeeId(employee.id);
        setEditingName(employee.name);
        setEditingRole(employee.role);
        setEditingIsAdmin(employee.is_admin);
        setMessage("");
        setErrorMessage("");
    }

    function cancelEditing() {
        setEditingEmployeeId(null);
        setEditingName("");
        setEditingRole("");
        setEditingIsAdmin(false);
    }

    async function handleUpdateEmployee(id) {
        setMessage("");
        setErrorMessage("");

        if (!editingName.trim() || !editingRole.trim()) {
            setErrorMessage("Name and role are required.");
            return;
        }

        try {
            const { response, data } = await updateEmployee(id, {
                name: editingName,
                role: editingRole,
                is_admin: editingIsAdmin,
                requesterIsAdmin: currentEmployee.is_admin
            });

            if (!response.ok) {
                setErrorMessage(data.error || "Could not update employee.");
                return;
            }

            setMessage(data.message);
            cancelEditing();
            loadEmployees();
        } catch (error) {
            console.error(error);
            setErrorMessage("Could not update employee.");
        }
    }

    async function handleDeleteEmployee(id) {
        setMessage("");
        setErrorMessage("");

        try {
            const { response, data } = await deleteEmployee(id, currentEmployee.is_admin);

            if (!response.ok) {
                setErrorMessage(data.error || "Could not delete employee.");
                return;
            }

            setMessage(data.message);

            if (currentEmployee.id === id) {
                localStorage.removeItem("employee");
                navigate("/");
                return;
            }

            loadEmployees();
        } catch (error) {
            console.error(error);
            setErrorMessage("Could not delete employee.");
        }
    }

    return (
        <div className="page-container">
            <div className="top-section">
                <h1>Employee Details</h1>
                <p>Employee information and admin tools.</p>
            </div>

            {message && (
                <div className="section-spacing">
                    <div className="card">
                        <p>{message}</p>
                    </div>
                </div>
            )}

            {errorMessage && (
                <div className="section-spacing">
                    <div className="card">
                        <p className="error-text">{errorMessage}</p>
                    </div>
                </div>
            )}

            <div className="section-spacing">
                <div className="card">
                    <h2>Your Account</h2>
                    <div className="info-row">
                        <span className="info-label">Name: </span>
                        <span>{currentEmployee?.name || "Loading..."}</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Employee ID: </span>
                        <span>{currentEmployee?.employee_id || "Loading..."}</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Role: </span>
                        <span>{currentEmployee?.role || "Loading..."}</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Admin: </span>
                        <span>{currentEmployee?.is_admin ? "Yes" : "No"}</span>
                    </div>
                </div>
            </div>

            {currentEmployee?.is_admin && (
                <div className="section-spacing">
                    <div className="card">
                        <h2>Add Employee</h2>

                        <form onSubmit={handleCreateEmployee}>
                            <div className="form-group">
                                <label htmlFor="newEmployeeId">Employee ID</label>
                                <input
                                    id="newEmployeeId"
                                    type="text"
                                    value={newEmployeeId}
                                    onChange={(event) => setNewEmployeeId(event.target.value)}
                                    placeholder="Enter employee ID"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="newEmployeeName">Name</label>
                                <input
                                    id="newEmployeeName"
                                    type="text"
                                    value={newEmployeeName}
                                    onChange={(event) => setNewEmployeeName(event.target.value)}
                                    placeholder="Enter employee name"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="newEmployeeRole">Role</label>
                                <input
                                    id="newEmployeeRole"
                                    type="text"
                                    value={newEmployeeRole}
                                    onChange={(event) => setNewEmployeeRole(event.target.value)}
                                    placeholder="Enter employee role"
                                />
                            </div>

                            <label className="checkbox-row">
                                <input
                                    type="checkbox"
                                    checked={newEmployeeIsAdmin}
                                    onChange={(event) => setNewEmployeeIsAdmin(event.target.checked)}
                                />
                                <span>Admin Access</span>
                            </label>

                            <div className="actions-row">
                                <button type="submit" className="primary-btn">
                                    Add Employee
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="section-spacing">
                <div className="card">
                    <h2>Employee List</h2>

                    {employees.length === 0 ? (
                        <p>No employees found.</p>
                    ) : (
                        employees.map((employee) => (
                            <div key={employee.id} className="list-item">
                                {editingEmployeeId === employee.id ? (
                                    <>
                                        <div className="form-group">
                                            <label>Name</label>
                                            <input
                                                type="text"
                                                value={editingName}
                                                onChange={(event) => setEditingName(event.target.value)}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Role</label>
                                            <input
                                                type="text"
                                                value={editingRole}
                                                onChange={(event) => setEditingRole(event.target.value)}
                                            />
                                        </div>

                                        <label className="checkbox-row">
                                            <input
                                                type="checkbox"
                                                checked={editingIsAdmin}
                                                onChange={(event) => setEditingIsAdmin(event.target.checked)}
                                            />
                                            <span>Admin Access</span>
                                        </label>

                                        <div className="actions-row">
                                            <button
                                                className="primary-btn"
                                                onClick={() => handleUpdateEmployee(employee.id)}
                                            >
                                                Save
                                            </button>

                                            <button
                                                className="secondary-btn"
                                                onClick={cancelEditing}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="info-row">
                                            <span className="info-label">Name: </span>
                                            <span>{employee.name}</span>
                                        </div>

                                        <div className="info-row">
                                            <span className="info-label">Employee ID: </span>
                                            <span>{employee.employee_id}</span>
                                        </div>

                                        <div className="info-row">
                                            <span className="info-label">Role: </span>
                                            <span>{employee.role}</span>
                                        </div>

                                        <div className="info-row">
                                            <span className="info-label">Admin: </span>
                                            <span>{employee.is_admin ? "Yes" : "No"}</span>
                                        </div>

                                        {currentEmployee?.is_admin && (
                                            <div className="actions-row">
                                                <button
                                                    className="secondary-btn"
                                                    onClick={() => startEditing(employee)}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="secondary-btn"
                                                    onClick={() => handleDeleteEmployee(employee.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            <BottomNav />
        </div>
    );
}