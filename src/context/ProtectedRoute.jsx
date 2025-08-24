import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const url = import.meta.env.VITE_AUTH_URl;

export default function ProtectedRoute() {
    const [isAuth, setIsAuth] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.post(`${url }/isAuthenticated`, {}, { withCredentials: true });
                if (res.data.code === 200) {
                    setIsAuth(true);

                } else { setIsAuth(false); }
            }
            catch (err) { console.error("Auth check failed:", err); setIsAuth(false); }
        };
        checkAuth();
    },
        []);

    if (isAuth === null) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Checking authentication...</p>
            </div>
        );
    }

    return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
}
