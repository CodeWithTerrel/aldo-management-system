import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { getMfindHistory } from "../services/api";

export default function MfindHistoryPage() {
    const [employee, setEmployee] = useState(null);
    const [history, setHistory] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const storedEmployee = localStorage.getItem("employee");

        if (!storedEmployee) {
            navigate("/");
            return;
        }

        setEmployee(JSON.parse(storedEmployee));
    }, [navigate]);

    useEffect(() => {
        if (employee) {
            loadHistory();
        }
    }, [employee]);

    async function loadHistory() {
        try {
            const { response, data } = await getMfindHistory();

            if (!response.ok) {
                setErrorMessage(data.error || "Could not load M-Find history.");
                return;
            }

            setHistory(data);
        } catch (error) {
            console.error(error);
            setErrorMessage("Could not load M-Find history.");
        }
    }

    function formatDateHeading(dateValue) {
        const date = new Date(dateValue);

        return date.toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        });
    }

    function formatTime(dateValue) {
        if (!dateValue) {
            return "Still out";
        }

        return new Date(dateValue).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
        });
    }

    const groupedHistory = useMemo(() => {
        const groups = {};

        history.forEach((entry) => {
            const dateKey = new Date(entry.assigned_at).toISOString().split("T")[0];

            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }

            groups[dateKey].push(entry);
        });

        return groups;
    }, [history]);

    return (
        <div className="page-container">
            <div className="top-section">
                <div className="page-heading-row">
                    <div className="logo-badge">AM</div>
                    <div>
                        <h1 style={{ margin: 0 }}>M-Find History</h1>
                        <p className="small-muted" style={{ margin: "4px 0 0 0" }}>
                            Daily record of who signed out each M-Find
                        </p>
                    </div>
                </div>
            </div>

            {errorMessage && (
                <div className="section-spacing">
                    <div className="card">
                        <p className="error-text">{errorMessage}</p>
                    </div>
                </div>
            )}

            <div className="section-spacing">
                {history.length === 0 ? (
                    <div className="card">
                        <p>No M-Find history yet.</p>
                    </div>
                ) : (
                    Object.keys(groupedHistory).map((dateKey) => (
                        <div className="card history-day-card" key={dateKey}>
                            <h2>{formatDateHeading(dateKey)}</h2>

                            {groupedHistory[dateKey].map((entry) => (
                                <div className="history-entry" key={entry.id}>
                                    <div className="history-mfind-name">{entry.mfind_name}</div>

                                    <div className="history-detail">
                                        <strong>{entry.employee_name}</strong>
                                    </div>

                                    <div className="history-detail">
                                        {formatTime(entry.assigned_at)} out
                                    </div>

                                    <div className="history-detail">
                                        {formatTime(entry.released_at)} in
                                    </div>

                                    <div className="history-duration">
                                        Duration: {entry.duration}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>

            <BottomNav />
        </div>
    );
}