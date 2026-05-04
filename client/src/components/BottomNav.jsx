import { Link, useLocation } from "react-router-dom";

export default function BottomNav() {
    const location = useLocation();

    return (
        <nav className="bottom-nav">
            <Link to="/home" className={location.pathname === "/home" ? "active" : ""}>
                <span className="nav-icon">⌂</span>
                <span>Home</span>
            </Link>

            <Link to="/bathroom" className={location.pathname === "/bathroom" ? "active" : ""}>
                <span className="nav-icon">🗓</span>
                <span>Bathroom</span>
            </Link>

            <Link to="/employees" className={location.pathname === "/employees" ? "active" : ""}>
                <span className="nav-icon">👥</span>
                <span>Employees</span>
            </Link>
        </nav>
    );
}