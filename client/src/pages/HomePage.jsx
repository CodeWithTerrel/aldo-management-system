import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import {
    getMfinds,
    createMfind,
    deleteMfind,
    getCurrentAssignment,
    assignMfind,
    releaseMfind,
    getTodayBathroomAssignment
} from "../services/api";

export default function HomePage() {
    const [employee, setEmployee] = useState(null);
    const [mfinds, setMfinds] = useState([]);
    const [currentAssignment, setCurrentAssignment] = useState(null);
    const [todayBathroomAssignment, setTodayBathroomAssignment] = useState(null);
    const [newMfindName, setNewMfindName] = useState("");
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();
    const mfindSectionRef = useRef(null);

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
            loadMfinds();
            loadCurrentAssignment(employee.id);
            loadTodayBathroomAssignment(employee.id);
        }
    }, [employee]);

    async function loadMfinds() {
        try {
            const { response, data } = await getMfinds();

            if (!response.ok) {
                setErrorMessage("Could not load M-Finds.");
                return;
            }

            setMfinds(data);
        } catch (error) {
            console.error(error);
            setErrorMessage("Could not load M-Finds.");
        }
    }

    async function loadCurrentAssignment(employeeDbId) {
        try {
            const { response, data } = await getCurrentAssignment(employeeDbId);

            if (!response.ok) {
                setErrorMessage("Could not load current assignment.");
                return;
            }

            setCurrentAssignment(data);
        } catch (error) {
            console.error(error);
            setErrorMessage("Could not load current assignment.");
        }
    }

    async function loadTodayBathroomAssignment(employeeDbId) {
        try {
            const { response, data } = await getTodayBathroomAssignment(employeeDbId);

            if (!response.ok) {
                setErrorMessage("Could not load today’s bathroom assignment.");
                return;
            }

            setTodayBathroomAssignment(data);
        } catch (error) {
            console.error(error);
            setErrorMessage("Could not load today’s bathroom assignment.");
        }
    }

    async function handleCreateMfind(event) {
        event.preventDefault();
        setMessage("");
        setErrorMessage("");

        if (!newMfindName.trim()) {
            setErrorMessage("Please enter an M-Find name.");
            return;
        }

        try {
            const { response, data } = await createMfind(newMfindName, employee.is_admin);

            if (!response.ok) {
                setErrorMessage(data.error || "Could not create M-Find.");
                return;
            }

            setMessage(data.message);
            setNewMfindName("");
            loadMfinds();
        } catch (error) {
            console.error(error);
            setErrorMessage("Could not create M-Find.");
        }
    }

    async function handleDeleteMfind(mfindId) {
        setMessage("");
        setErrorMessage("");

        try {
            const { response, data } = await deleteMfind(mfindId, employee.is_admin);

            if (!response.ok) {
                setErrorMessage(data.error || "Could not delete M-Find.");
                return;
            }

            setMessage(data.message);
            loadMfinds();
        } catch (error) {
            console.error(error);
            setErrorMessage("Could not delete M-Find.");
        }
    }

    async function handleAssignMfind(mfindId) {
        setMessage("");
        setErrorMessage("");

        try {
            const { response, data } = await assignMfind(employee.id, mfindId);

            if (!response.ok) {
                setErrorMessage(data.error || "Could not assign M-Find.");
                return;
            }

            setMessage(data.message);
            loadMfinds();
            loadCurrentAssignment(employee.id);
        } catch (error) {
            console.error(error);
            setErrorMessage("Could not assign M-Find.");
        }
    }

    async function handleReleaseMfind() {
        setMessage("");
        setErrorMessage("");

        try {
            const { response, data } = await releaseMfind(employee.id);

            if (!response.ok) {
                setErrorMessage(data.error || "Could not release M-Find.");
                return;
            }

            setMessage(data.message);
            loadMfinds();
            loadCurrentAssignment(employee.id);
        } catch (error) {
            console.error(error);
            setErrorMessage("Could not release M-Find.");
        }
    }

    function handleReadyClick() {
        if (currentAssignment) {
            handleReleaseMfind();
            return;
        }

        if (mfindSectionRef.current) {
            mfindSectionRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }

    function handleLogout() {
        localStorage.removeItem("employee");
        navigate("/");
    }

    const availableMfinds = mfinds.filter((mfind) => mfind.is_available);

    const displayDate = useMemo(() => {
        return new Date().toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric"
        });
    }, []);

    const displayTime = useMemo(() => {
        return new Date().toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
        });
    }, []);

    const initials = useMemo(() => {
        if (!employee?.name) return "AM";
        return employee.name
            .split(" ")
            .slice(0, 2)
            .map((part) => part[0])
            .join("")
            .toUpperCase();
    }, [employee]);

    return (
        <div className="page-container">
            <div className="hero-card">
                <div className="hero-banner">
                    <div className="hero-content">
                        <div className="hero-avatar">{initials}</div>

                        <div>
                            <div className="hero-title">Good day, {employee?.name?.split(" ")[0] || "Team Member"}!</div>
                            <div className="hero-date">{displayDate}</div>
                        </div>
                    </div>
                </div>

                <div className="time-card">
                    <div>
                        <div className="time-label">Current Time</div>
                        <div className="time-value">{displayTime}</div>
                    </div>

                    <button className="green-btn" onClick={handleReadyClick}>
                        {currentAssignment ? "Clock Out" : "Ready"}
                    </button>
                </div>
            </div>

            <div className="section-spacing">
                <div className="card">
                    <h2>Your Role</h2>
                    <div style={{ fontWeight: 800 }}>{employee?.role || "Loading..."}</div>
                    <div className="small-muted">{employee?.is_admin ? "Admin Access" : "Standard Access"}</div>
                </div>
            </div>

            {todayBathroomAssignment && (
                <div className="section-spacing">
                    <div className="card">
                        <h2>Today’s Bathroom Duty</h2>
                        <div className="status-chip">Scheduled Today</div>
                        <p style={{ marginBottom: 0 }}>
                            You are scheduled for bathroom cleaning on{" "}
                            <strong>{todayBathroomAssignment.schedule_date}</strong>.
                        </p>
                    </div>
                </div>
            )}

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
                    <h2>Current M-Find Status</h2>

                    {currentAssignment ? (
                        <>
                            <div className="tile-title">{currentAssignment.mfind_name}</div>
                            <div className="tile-subtext">
                                Assigned at {new Date(currentAssignment.assigned_at).toLocaleString()}
                            </div>

                            <div className="actions-row">
                                <button className="green-btn" onClick={handleReleaseMfind}>
                                    Clock Out
                                </button>
                            </div>
                        </>
                    ) : (
                        <p>No active M-Find assigned.</p>
                    )}
                </div>
            </div>

            {employee?.is_admin && (
                <div className="section-spacing">
                    <div className="card">
                        <h2>Create M-Find</h2>

                        <form onSubmit={handleCreateMfind}>
                            <div className="form-group">
                                <label htmlFor="mfindName">M-Find Name</label>
                                <input
                                    id="mfindName"
                                    type="text"
                                    value={newMfindName}
                                    onChange={(event) => setNewMfindName(event.target.value)}
                                    placeholder="Enter M-Find name"
                                />
                            </div>

                            <button type="submit" className="primary-btn">
                                Add M-Find
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="section-spacing" ref={mfindSectionRef}>
                <div className="card">
                    <h2>Available M-Finds</h2>

                    {availableMfinds.length === 0 ? (
                        <p>No available M-Finds right now.</p>
                    ) : (
                        availableMfinds.map((mfind) => (
                            <div key={mfind.id} className="tile-list-item">
                                <div className="tile-title">{mfind.mfind_name}</div>
                                <div className="tile-subtext">
                                    {mfind.is_available ? "Available now" : "Unavailable"}
                                </div>

                                <div className="actions-row">
                                    {!currentAssignment && (
                                        <button
                                            className="green-btn"
                                            onClick={() => handleAssignMfind(mfind.id)}
                                        >
                                            Clock In
                                        </button>
                                    )}

                                    {employee?.is_admin && (
                                        <button
                                            className="danger-btn"
                                            onClick={() => handleDeleteMfind(mfind.id)}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="section-spacing">
                <div className="card">
                    <h2>Your Details</h2>

                    <div className="info-row">
                        <span className="info-label">Employee ID: </span>
                        <span>{employee?.employee_id || "Loading..."}</span>
                    </div>

                    <div className="info-row">
                        <span className="info-label">Role: </span>
                        <span>{employee?.role || "Loading..."}</span>
                    </div>

                    <div className="info-row">
                        <span className="info-label">Admin: </span>
                        <span>{employee?.is_admin ? "Yes" : "No"}</span>
                    </div>

                    <div className="actions-row">
                        <button className="secondary-btn" onClick={handleLogout}>
                            Log Out
                        </button>
                    </div>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}