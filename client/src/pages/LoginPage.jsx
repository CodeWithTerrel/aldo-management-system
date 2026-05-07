import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    checkEmployeeHasPassword,
    loginEmployeeWithPassword,
    setupEmployeePassword
} from "../services/api";

export default function LoginPage() {
    const [employeeId, setEmployeeId] = useState("");
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isFirstTimeSetup, setIsFirstTimeSetup] = useState(false);
    const [hasCheckedEmployee, setHasCheckedEmployee] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [infoMessage, setInfoMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    async function handleCheckEmployee(event) {
        event.preventDefault();
        setErrorMessage("");
        setInfoMessage("");

        if (!employeeId.trim()) {
            setErrorMessage("Please enter your employee ID.");
            return;
        }

        try {
            setIsLoading(true);

            const { response, data } = await checkEmployeeHasPassword(employeeId.trim());

            if (!response.ok) {
                setErrorMessage(data.error || "Could not check employee.");
                return;
            }

            setHasCheckedEmployee(true);

            if (data.hasPassword) {
                setIsFirstTimeSetup(false);
                setInfoMessage("Employee found. Please enter your password.");
            } else {
                setIsFirstTimeSetup(true);
                setInfoMessage("First-time sign in. Please create your password.");
            }
        } catch (error) {
            console.error("Employee check error:", error);
            setErrorMessage("Could not connect to the server.");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleLogin(event) {
        event.preventDefault();
        setErrorMessage("");
        setInfoMessage("");

        if (!employeeId.trim() || !password.trim()) {
            setErrorMessage("Please enter your employee ID and password.");
            return;
        }

        try {
            setIsLoading(true);

            const { response, data } = await loginEmployeeWithPassword(
                employeeId.trim(),
                password
            );

            if (!response.ok) {
                setErrorMessage(data.error || "Login failed.");
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

    async function handlePasswordSetup(event) {
        event.preventDefault();
        setErrorMessage("");
        setInfoMessage("");

        if (!newPassword.trim() || !confirmPassword.trim()) {
            setErrorMessage("Please enter and confirm your new password.");
            return;
        }

        if (newPassword.length < 6) {
            setErrorMessage("Password must be at least 6 characters long.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        try {
            setIsLoading(true);

            const { response, data } = await setupEmployeePassword(
                employeeId.trim(),
                newPassword
            );

            if (!response.ok) {
                setErrorMessage(data.error || "Could not create password.");
                return;
            }

            localStorage.setItem("employee", JSON.stringify(data.employee));
            navigate("/home");
        } catch (error) {
            console.error("Password setup error:", error);
            setErrorMessage("Could not connect to the server.");
        } finally {
            setIsLoading(false);
        }
    }

    function handleChangeEmployee() {
        setHasCheckedEmployee(false);
        setIsFirstTimeSetup(false);
        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setErrorMessage("");
        setInfoMessage("");
    }

    return (
        <div className="center-screen">
            <div className="login-box">
                <div className="login-logo">AM</div>

                <h1>ALDO Management</h1>
                <p>Sign in to continue</p>

                {!hasCheckedEmployee && (
                    <form onSubmit={handleCheckEmployee}>
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
                        {infoMessage && <div className="small-muted">{infoMessage}</div>}

                        <button type="submit" className="primary-btn" disabled={isLoading}>
                            {isLoading ? "Checking..." : "Continue"}
                        </button>
                    </form>
                )}

                {hasCheckedEmployee && !isFirstTimeSetup && (
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>Employee ID</label>
                            <input type="text" value={employeeId} disabled />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="Enter password"
                            />
                        </div>

                        {errorMessage && <div className="error-text">{errorMessage}</div>}
                        {infoMessage && <div className="small-muted">{infoMessage}</div>}

                        <button type="submit" className="primary-btn" disabled={isLoading}>
                            {isLoading ? "Signing In..." : "Sign In"}
                        </button>

                        <div className="actions-row">
                            <button
                                type="button"
                                className="secondary-btn"
                                onClick={handleChangeEmployee}
                            >
                                Change Employee ID
                            </button>
                        </div>
                    </form>
                )}

                {hasCheckedEmployee && isFirstTimeSetup && (
                    <form onSubmit={handlePasswordSetup}>
                        <div className="form-group">
                            <label>Employee ID</label>
                            <input type="text" value={employeeId} disabled />
                        </div>

                        <div className="form-group">
                            <label htmlFor="newPassword">Create Password</label>
                            <input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(event) => setNewPassword(event.target.value)}
                                placeholder="Create password"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                placeholder="Confirm password"
                            />
                        </div>

                        <p className="small-muted">
                            Next time you sign in, you will only need your employee ID and password.
                        </p>

                        {errorMessage && <div className="error-text">{errorMessage}</div>}
                        {infoMessage && <div className="small-muted">{infoMessage}</div>}

                        <button type="submit" className="primary-btn" disabled={isLoading}>
                            {isLoading ? "Creating Password..." : "Create Password & Sign In"}
                        </button>

                        <div className="actions-row">
                            <button
                                type="button"
                                className="secondary-btn"
                                onClick={handleChangeEmployee}
                            >
                                Change Employee ID
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}