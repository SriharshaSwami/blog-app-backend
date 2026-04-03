import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";
import { pageBackground, pageWrapper, pageTitleClass, bodyText, section, cardClass } from "../styles/common";

const Unauthorized = () => {
    const navigate = useNavigate();
    const { currentUser, isAuthenticated } = useAuth();
    const delay = 2 * 1000;

    useEffect(() => {
        let redirectTo = "/login";
        if (isAuthenticated && currentUser) {
            if (currentUser.role === "USER") redirectTo = "/userdashboard";
            else if (currentUser.role === "AUTHOR") redirectTo = "/authordashboard";
            else if (currentUser.role === "ADMIN") redirectTo = "/admindashboard";
        }

        const timer = setTimeout(() => {
            navigate(redirectTo, { replace: true });
        }, delay);

        return () => clearTimeout(timer);
    }, [navigate, currentUser, isAuthenticated]);

    return (
        <div className={pageBackground + " flex items-center justify-center min-h-screen"}>
            <div className={pageWrapper + " text-center"}>
                <div className={cardClass + " max-w-md mx-auto"}>
                    <h1 className={pageTitleClass + " text-red-500 mb-4"}>Unauthorized Access</h1>
                    <div className={section}>
                        <p className={bodyText + " mb-4"}>
                            You do not have permission to view this page.
                        </p>
                        <p className="text-sm text-[#a1a1a6] animate-pulse">
                            Redirecting you to your dashboard in 2 seconds...
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;