import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import API from "../api/axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Logo from "../assets/Logo - PMT-SK.png";

// Yup validation schema
const schema = yup.object().shape({
  name: yup
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username max 20 characters")
    .matches(/^[a-zA-Z0-9_-]+$/, "Username: letters, numbers, _, - only (no spaces)")
    .required("Username is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Valid email required (e.g. user@company.com)")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must contain uppercase, lowercase, number, special char (FAANG-style)")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/api/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (res.data.token) {
        localStorage.setItem('userName', data.name);
        login(res.data.token);
        navigate("/user-home");
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.error("Register error:", err);
      const msg = err.response?.data?.message || err.message || "Registration failed. Backend may not be running.";
      setError(msg);
      if (err.message.includes('ERR_CONNECTION_REFUSED')) {
        setError("Backend server not running. Start at http://localhost:8081");
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create Account</h2>

            {error && (
              <p className="text-red-500 mb-6 w-full text-sm bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                {...formRegister("name")}
                error={errors.name?.message}
              />

              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                {...formRegister("email")}
                error={errors.email?.message}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                {...formRegister("password")}
                error={errors.password?.message}
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                {...formRegister("confirmPassword")}
                error={errors.confirmPassword?.message}
              />

              <Button type="primary" className="w-full shadow-lg hover:shadow-xl transition-all duration-300" disabled={loading || !isValid}>
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <p className="mt-6 text-gray-500 text-sm text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

