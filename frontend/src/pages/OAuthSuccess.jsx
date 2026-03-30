import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("userName", "OAuth User"); // Mock
      navigate("/user-home");
    } else {
      console.error("No token in OAuth success");
      navigate("/login");
    }
  }, [navigate]);

  return <div className="min-h-screen flex items-center justify-center">
    <div className="text-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" />
      <p>Completing login...</p>
    </div>
  </div>;
};

export default OAuthSuccess;

