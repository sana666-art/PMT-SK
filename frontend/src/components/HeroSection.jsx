import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
<section id="hero" className="py-24 md:py-32 px-4 md:px-8 lg:px-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white overflow-visible relative scroll-mt-0">

      <div className="max-w-7xl mx-auto text-center relative z-20 pt-16 md:pt-0">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent mb-8 px-4 py-4 -webkit-background-clip text -webkit-text-fill-color transparent drop-shadow-2xl leading-none tracking-tight">
          Powerful Project Management
        </h1>
        <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto opacity-95 leading-relaxed px-4">
          Streamline your projects, tasks, and teams with our intuitive tool. Collaborate seamlessly and deliver on time, every time.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
          <Link
            to="/register"
            className="px-10 py-4 bg-white text-indigo-600 font-semibold text-lg rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 hover:bg-gray-50"
          >
            Get Started Free
          </Link>
          <Link
            to="/login"
            className="px-10 py-4 border-2 border-white text-white font-semibold text-lg rounded-2xl hover:bg-white hover:text-indigo-600 transition-all duration-300"
          >
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
