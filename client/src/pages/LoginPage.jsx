import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginEmployee } from "../services/api";

export default function LoginPage() {
    const [employeeId, setEmployeeId] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    async function handleLogin(event) {
        event.preventDefault();
        setErrorMessage("");

        if (!employeeId.trim()) {
            setErrorMessage("Please enter your employee ID.");
            return;
        }

        try {
            setIsLoading(true);

            const { response, data } = await loginEmployee(employeeId.trim());

            if (!response.ok) {
                setErrorMessage(data.error || "Login failed.");
                setIsLoading(false);
                return;
            }

            localStorage.setItem("employee", JSON.stringify(data.employee));
            navigate("/home");
        } catch (error) {
            console.error("Login error:", error);
            setErrorMessage("Could not connect to the server.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="center-screen">
            <div className="login-box">
                <div className="login-logo">AM</div>

                <h1>ALDO Management</h1>
                <p>Sign in to continue</p>

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="employeeId">Employee ID</label>
                        <input
                            id="employeeId"
                            type="text"
                            value={employeeId}
                            onChange={(event) => setEmployeeId(event.target.value)}
                            placeholder="Enter employee ID"
                        />
                    </div>

                    {errorMessage && <div className="error-text">{errorMessage}</div>}

                    <button type="submit" className="primary-btn" disabled={isLoading}>
                        {isLoading ? "Signing In..." : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
}