import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import StatsSection from "../components/StatsSection";
import Footer from "../components/Footer";

const Home = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate('/user-home', { replace: true });
    }
  }, [token, navigate]);

  if (token) {
    return null; // or loading spinner
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        {/* Final CTA */}
        <section className="py-24 px-4 md:px-8 lg:px-16 bg-white">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Ready to get started?</h2>
            <p className="text-xl text-gray-600 mb-12">Join thousands of teams transforming their project management.</p>
            <Link
              to="/register"
              className="inline-block px-12 py-5 bg-indigo-600 text-white font-semibold text-xl rounded-3xl hover:bg-indigo-700 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              Start Free Trial
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;

