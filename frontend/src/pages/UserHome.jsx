import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FeaturesSection from '../components/FeaturesSection';
import StatCard from '../components/StatCard';
import { getDashboardStats } from '../api/dashboardApi';
import { getProfile } from '../api/userApi';
import { useAuth } from '../context/AuthContext';
import { Users, Folder, CheckCircle, Activity, Plus } from 'lucide-react';

const UserHome = () => {
  const { token, setUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState(localStorage.getItem('userName') || 'Loading...');


  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Fetch user profile
        const profileRes = await getProfile();
        console.log('Profile response:', profileRes.data);
        const name = profileRes.data?.data?.name || 'User';
        setUserName(name.charAt(0).toUpperCase() + name.slice(1).toLowerCase());
        setUser(profileRes.data.data);
        
        // Fetch dashboard stats
        const statsRes = await getDashboardStats();
        setStats(statsRes.data.data);
      } catch (err) {
        console.error('Load data error:', err);
        setUserName((localStorage.getItem('userName') || 'User').charAt(0).toUpperCase() + (localStorage.getItem('userName') || 'User').slice(1).toLowerCase());
      } finally {
        setLoading(false);
      }
    };
    if (token) loadData();
  }, [token]);


  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-100">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading your home...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      <Navbar />
      <main className="flex-1">
        {/* Personalized Hero */}
        <section className="py-24 px-4 md:px-8 lg:px-16 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-6 leading-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{userName}</span>!
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Your workspace is ready. Here's a quick overview of your projects and tasks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                to="/dashboard"
                className="px-8 py-4 bg-indigo-600 text-white font-semibold text-lg rounded-2xl hover:bg-indigo-700 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center gap-2"
              >
                <Activity className="w-5 h-5" />
                Go to Dashboard
              </Link>
              <button
                onClick={() => navigate('/projects')}
                className="px-8 py-4 border-2 border-indigo-600 text-indigo-600 font-semibold text-lg rounded-2xl hover:bg-indigo-600 hover:text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Folder className="w-5 h-5" />
                View Projects
              </button>
            </div>
          </div>
        </section>

        {/* Personal Stats */}
        <section className="py-20 px-4 md:px-8 lg:px-16 -mt-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">Your Stats at a Glance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Total Projects" 
                value={stats?.totalProjects || 0} 
                change={12} changeType="up" trendColor="indigo"
              />
              <StatCard 
                title="My Tasks" 
                value={stats?.myTasks || 0} 
                change={8} changeType="up" trendColor="green"
              />
              <StatCard 
                title="Pending Tasks" 
                value={stats?.tasksPending || 0} 
                change={-3} changeType="down" trendColor="orange"
              />
              <StatCard 
                title="Completed Tasks" 
                value={stats?.tasksCompleted || 0} 
                change={15} changeType="up" trendColor="emerald"
              />
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-20 px-4 md:px-8 lg:px-16 bg-white/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link to="/projects" className="group p-8 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl border-2 border-white/20">
                <Folder className="w-12 h-12 mx-auto mb-4 opacity-90 group-hover:opacity-100" />
                <h3 className="text-xl font-bold mb-2">Projects</h3>
                <p className="opacity-90">Manage your projects</p>
              </Link>
              <Link to="/tasks" className="group p-8 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl border-2 border-white/20">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-90 group-hover:opacity-100" />
                <h3 className="text-xl font-bold mb-2">Tasks</h3>
                <p className="opacity-90">Track your tasks</p>
              </Link>
              <Link to="/users" className="group p-8 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl border-2 border-white/20">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-90 group-hover:opacity-100" />
                <h3 className="text-xl font-bold mb-2">Team</h3>
                <p className="opacity-90">Manage team members</p>
              </Link>
              <button onClick={() => navigate('/dashboard')} className="group p-8 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 text-white hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl border-2 border-white/20">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-90 group-hover:opacity-100" />
                <h3 className="text-xl font-bold mb-2">Analytics</h3>
                <p className="opacity-90">View insights</p>
              </button>
            </div>
          </div>
        </section>

        {/* Features */}
        <FeaturesSection />

        {/* Final CTA */}
        <section className="py-24 px-4 md:px-8 lg:px-16 bg-white">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Ready to dive deeper?</h2>
            <p className="text-xl text-gray-600 mb-12">Access full features and manage your work efficiently.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/dashboard"
                className=" px-12 py-5 bg-indigo-600 text-white font-semibold text-xl rounded-3xl hover:bg-indigo-700 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center gap-2 justify-center mx-auto sm:mx-0"
              >
                <Activity className="w-5 h-5" />
                Full Dashboard
              </Link>
              <button
                onClick={() => {
                  if (confirm('Create new project? Redirecting to projects...')) {
                    navigate('/projects');
                  }
                }}
                className="px-12 py-5 bg-emerald-600 text-white font-semibold text-xl rounded-3xl hover:bg-emerald-700 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center gap-2 justify-center mx-auto sm:mx-0"
              >
                <Plus className="w-5 h-5" />
                + New Project
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default UserHome;

