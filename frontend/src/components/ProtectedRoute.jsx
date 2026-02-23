import React from 'react'
import { useUser } from '../context/userContext'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useUser();

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center animate-fadeIn">
                <div className="w-16 h-16 border-4 border-[#C5A059]/10 border-t-[#C5A059] rounded-full animate-spin mb-4"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C5A059] animate-pulse">Synchronizing Session</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute
