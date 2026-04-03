import React from 'react'
import { useRouteError, useNavigate } from 'react-router'
import { pageBackground, pageWrapper, pageTitleClass, bodyText, primaryBtn, section } from '../styles/common'

function ErrorBoundary() {
    const error = useRouteError();
    const navigate = useNavigate();

    console.error(error);

    let errorMessage = "An unexpected error has occurred.";
    let errorStatus = "Error";

    if (error.status === 404) {
        errorStatus = "404";
        errorMessage = "The page you're looking for doesn't exist.";
    } else if (error.statusText || error.message) {
        errorMessage = error.statusText || error.message;
    }

    return (
        <div className={pageBackground + " flex items-center justify-center min-h-screen"}>
            <div className={pageWrapper + " text-center"}>
                <h1 className={pageTitleClass + " text-9xl text-[#0066cc]/10 mb-[-1.5rem]"}>{errorStatus}</h1>
                <div className={section}>
                    <h2 className="text-3xl font-bold text-[#1d1d1f] mb-4">Something went wrong.</h2>
                    <p className={bodyText + " mb-8 max-w-md mx-auto"}>
                        {errorMessage}
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className={primaryBtn + " px-8 py-3 text-base"}
                    >
                        Go back home
                    </button>
                </div>
            </div>
        </div>)
}

export default ErrorBoundary