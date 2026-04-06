import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";

function ProtectedRoute({ children }) {
  const { token, user, fetchProfile } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Token exists but no user, trigger fetch
  useEffect(() => {
    if (token && !user) {
      fetchProfile();
    }
  }, [token, user, fetchProfile]);

  if (!token || (token && !user && user !== null)) {
    return <Navigate to="/login" replace />;
  }

  if (token && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
