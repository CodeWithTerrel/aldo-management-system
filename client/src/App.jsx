import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import BathroomPage from "./pages/BathroomPage";
import EmployeeDetailsPage from "./pages/EmployeeDetailsPage";
import MfindHistoryPage from "./pages/MfindHistoryPage";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/bathroom" element={<BathroomPage />} />
                <Route path="/history" element={<MfindHistoryPage />} />
                <Route path="/employees" element={<EmployeeDetailsPage />} />
            </Routes>
        </BrowserRouter>
    );
}