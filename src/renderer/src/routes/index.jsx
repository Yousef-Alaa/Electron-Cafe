import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Reports from "./pages/Reports";
import Market from './pages/Market';
import Settings from './pages/Settings';


export default function TheRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="market" element={<Market />} />
            <Route path="settings" element={<Settings />} />
            <Route path="reports" element={<Reports />} />
            <Route path="*" element={<Navigate to="/" replace={true} />} />
        </Routes>
    );
}