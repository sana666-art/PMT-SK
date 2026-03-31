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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 

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

      localStorage.setItem('userName', data.name);
      navigate("/registration-success");
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

              <div className="relative w-full  mb-6">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...formRegister("password")}
                  error={errors.password?.message}
                  className="pr-12  mb-6"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showPassword ? "M13.875 18.825a10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
                  </svg>
                </button>
              </div>

              <div className="relative w-full  mb-6">
                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  {...formRegister("confirmPassword")}
                  error={errors.confirmPassword?.message}
                  className="pr-12  mb-6"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showConfirmPassword ? "M13.875 18.825a10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
                  </svg>
                </button>
              </div>


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

