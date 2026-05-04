import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import {
    getBathroomEmployees,
    getBathroomSchedule,
    createBathroomAssignment,
    deleteBathroomAssignment,
    autoAssignBathroomSchedule
} from "../services/api";

export default function BathroomPage() {
    const [employee, setEmployee] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const storedEmployee = localStorage.getItem("employee");

        if (!storedEmployee) {
            navigate("/");
            return;
        }

        const parsedEmployee = JSON.parse(storedEmployee);
        setEmployee(parsedEmployee);
    }, [navigate]);

    useEffect(() => {
        if (employee) {
            loadEmployees();
            loadSchedule();
        }
    }, [employee]);

    async function loadEmployees() {
        try {
            const { response, data } = await getBathroomEmployees();

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

    async function loadSchedule() {
        try {
            const { response, data } = await getBathroomSchedule();

            if (!response.ok) {
                setErrorMessage("Could not load bathroom schedule.");
                return;
            }

            setSchedule(data);
        } catch (error) {
            console.error(error);
            setErrorMessage("Could not load bathroom schedule.");
        }
    }

    async function handleCreateAssignment(event) {
        event.preventDefault();
        setMessage("");
        setErrorMessage("");

        if (!selectedEmployeeId || !selectedDate) {
            setErrorMessage("Please select an employee and a date.");
            return;
        }

        try {
            const { response, data } = await createBathroomAssignment(
                selectedEmployeeId,
                selectedDate,
                employee.is_admin,
                employee.id
            );

            if (!response.ok) {
                setErrorMessage(data.error || "Could not create assignment.");
                return;
            }

            setMessage(data.message);
            setSelectedEmployeeId("");
            setSelectedDate("");
            loadSchedule();
        } catch (error) {
            console.error(error);
            setErrorMessage("Could not create assignment.");
        }
    }

    async function handleDeleteAssignment(scheduleId) {
        setMessage("");
        setErrorMessage("");

        try {
            const { response, data } = await deleteBathroomAssignment(scheduleId, employee.is_admin);

            if (!response.ok) {
                setErrorMessage(data.error || "Could not delete assignment.");
                return;
            }

            setMessage(data.message);
            loadSchedule();
        } catch (error) {
            console.error(error);
            setErrorMessage("Could not delete assignment.");
        }
    }

    async function handleAutoAssign() {
        setMessage("");
        setErrorMessage("");

        try {
            const { response, data } = await autoAssignBathroomSchedule(employee.is_admin, employee.id);

            if (!response.ok) {
                setErrorMessage(data.error || "Could not auto-assign bathroom schedule.");
                return;
            }

            setMessage(data.message);
            loadSchedule();
        } catch (error) {
            console.error(error);
            setErrorMessage("Could not auto-assign bathroom schedule.");
        }
    }

    return (
        <div className="page-container">
            <div className="top-section">
                <div className="page-heading-row">
                    <div className="logo-badge">AM</div>
                    <div>
                        <h1 style={{ margin: 0 }}>Bathroom Schedule</h1>
                        <p className="small-muted" style={{ margin: "4px 0 0 0" }}>
                            Daily cleaning assignments
                        </p>
                    </div>
                </div>
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

            {employee?.is_admin && (
                <div className="section-spacing">
                    <div className="card">
                        <h2>Create Bathroom Assignment</h2>

                        <form onSubmit={handleCreateAssignment}>
                            <div className="form-group">
                                <label htmlFor="bathroomEmployee">Employee</label>
                                <select
                                    id="bathroomEmployee"
                                    value={selectedEmployeeId}
                                    onChange={(event) => setSelectedEmployeeId(event.target.value)}
                                    className="native-input"
                                >
                                    <option value="">Select an employee</option>
                                    {employees.map((employeeOption) => (
                                        <option key={employeeOption.id} value={employeeOption.id}>
                                            {employeeOption.name} - {employeeOption.role}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="bathroomDate">Date</label>
                                <input
                                    id="bathroomDate"
                                    type="date"
                                    value={selectedDate}
                                    onChange={(event) => setSelectedDate(event.target.value)}
                                />
                            </div>

                            <div className="actions-row">
                                <button type="submit" className="green-btn">
                                    Add Schedule Tile
                                </button>

                                <button
                                    type="button"
                                    className="secondary-btn"
                                    onClick={handleAutoAssign}
                                >
                                    Auto Assign 7 Days
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="section-spacing">
                <div className="card">
                    <h2>Schedule Tiles</h2>

                    {schedule.length === 0 ? (
                        <p>No bathroom assignments yet.</p>
                    ) : (
                        schedule.map((entry) => (
                            <div key={entry.id} className="tile-list-item">
                                <div className="tile-title">{entry.name}</div>
                                <div className="tile-subtext">{entry.role}</div>
                                <div className="tile-subtext">{entry.schedule_date}</div>

                                {employee?.is_admin && (
                                    <div className="actions-row">
                                        <button
                                            className="danger-btn"
                                            onClick={() => handleDeleteAssignment(entry.id)}
                                        >
                                            Delete Tile
                                        </button>
                                    </div>
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