import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import API from "../api/axios";
import Logo from "../assets/Logo - PMT-SK.png";

export default function Login() {
  const { login, token } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      console.log("Token detected, navigating to user home");
      navigate("/user-home", { replace: true });
    }
  }, [token, navigate]);

  const handleGithubLogin = () => {
    window.location.href = "http://localhost:8081/oauth2/authorization/github";
  };

  const handleLogin = async () => {
    // Validation
    const emailTrimmed = email.trim();
    const passwordTrimmed = password.trim();
    
    if (!emailTrimmed || !passwordTrimmed) {
      setError("Email and password are required");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s.]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      setError("Please enter a valid email address");
      return;
    }
    
    if (passwordTrimmed.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    console.log("Attempting login with:", { email: emailTrimmed, password: '[HIDDEN]' });
    
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/api/auth/login", { 
        email: emailTrimmed, 
        password: passwordTrimmed 
      });
      console.log("Login response:", res.data);
      const tokenPayload = res.data.message;
      localStorage.setItem('userName', 'John Doe'); // Mock; extend API for real
      login(tokenPayload);
      // Navigate handled by useEffect watching token
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      if (!err.response) {
        setError("Network error - Is backend running on localhost:8081?");
      } else {
        setError(err.response?.data?.message || `Server error: ${err.response.status}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-96 max-w-md mx-auto p-0 shadow-lg hover:shadow-xl">
          <div className="p-8 flex flex-col items-center">
            <img src={Logo} alt="PMT-SK" className="w-28 h-28 mb-6 object-contain" />
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome Back</h2>

            {error && <p className="text-red-500 mb-6 w-full text-sm bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}




            <div className="w-full mb-4">
              <Input
                label="Email"
                type="email"
                id="login-email"
                autoComplete="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative w-full mb-6">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}

                  id="login-password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-12 mb-6"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825a10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

            <Button className="w-full mb-4 shadow-lg hover:shadow-xl transition-all duration-300" disabled={loading} onClick={handleLogin}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <Button 
              type="secondary" 
              className="w-full bg-gray-800 hover:bg-gray-900 border border-gray-700 text-white flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300" 
              onClick={handleGithubLogin}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6 .113 .82-.258 .82-.577 0-.285-.01-1.04-.015-2.04-3.338 .724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744 .084-.729 .084-.729 1.205 .084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495 .998 .108-.776 .417-1.305 .76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31 .465-2.38 1.235-3.22-.135-.303-.54-1.643 .105-3.372 0 0 1.039-.33 3.4 1.23 1.966-.43 4.12-.43 6.06 0 2.36-1.56 3.395-1.23 3.395-1.23 .645 1.729 .24 3.07 .12 3.372 .77 .84 1.235 1.91 1.235 3.22 0 4.61-2.805 5.625-5.475 5.92 .42 .36 .81 1.096 .81 2.22 0 .334 .015 6.395 0 6.956 0 .643-.215 1.38 .82 1.146 3.77-1.245 6.49-6.082 6.49-11.386 0-6.627-5.37-12-12-12z"/>
              </svg>
              Continue with GitHub
            </Button>

            <p className="mt-6 text-gray-500 text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline font-medium">
                Sign Up
              </Link>
            </p>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
