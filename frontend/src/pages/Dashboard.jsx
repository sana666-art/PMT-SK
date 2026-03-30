import { useState, useEffect } from 'react';

import DashboardLayout from '../layouts/DashboardLayout';
import StatCard from '../components/StatCard';
import { getDashboardStats } from '../api/dashboardApi';
import { Badge } from '../components/ui/badge';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Users, Folder, CheckCircle, Clock, Activity, TrendingUp } from 'lucide-react';


ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function Dashboard() {

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const taskChartData = stats ? {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [{
      data: [
        stats.tasksPending || 0,
        stats.myTasks - (stats.tasksPending || 0) - (stats.tasksCompleted || 0),
        stats.tasksCompleted || 0
      ],
      backgroundColor: ['#EF4444', '#F59E0B', '#10B981'],
      borderWidth: 0,
    }],
  } : null;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-8 p-6">
          <div className="h-12 bg-gray-200 rounded-xl animate-pulse w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your projects.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-semibold shadow-lg transition-all">
              + New Project
            </button>
            <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-semibold shadow-lg transition-all">
              + New Task
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <StatCard 
            title="Total Projects" 
            value={stats?.totalProjects || 0} 
            change={12}
            changeType="up"
            trendColor="indigo"
          />
          <StatCard 
            title="My Tasks" 
            value={stats?.myTasks || 0} 
            change={8}
            changeType="up"
            trendColor="green"
          />
          <StatCard 
            title="Pending Tasks" 
            value={stats?.tasksPending || 0} 
            change={-3}
            changeType="down"
            trendColor="orange"
          />
          <StatCard 
            title="Completed Tasks" 
            value={stats?.tasksCompleted || 0} 
            change={15}
            changeType="up"
            trendColor="emerald"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tasks Status Chart */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse" />
              <h2 className="text-2xl font-bold">Tasks Status</h2>
            </div>
            {taskChartData && (
              <Doughnut 
                data={taskChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'bottom' },
                  },
                  cutout: '60%',
                }}
              />
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Activity className="w-7 h-7 text-indigo-600" />
              Recent Activity
            </h2>
            <div className="space-y-3 divide-y divide-gray-200">
              {stats?.recentTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={task.status.toLowerCase()}>
                        {task.status}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {task.projectName || 'No project'}
                      </span>
                    </div>
                  </div>
                </div>
              )) || (
                <p className="text-gray-500 text-center py-8">No recent tasks</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
          <div className="flex items-center gap-3 mb-6">
            <Folder className="w-7 h-7 text-blue-600" />
            <h2 className="text-2xl font-bold">Recent Projects ({stats?.recentProjects.length || 0})</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 font-semibold text-gray-900">Project</th>
                  <th className="text-left py-4 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-4 font-semibold text-gray-900">Created</th>
                  <th className="text-right py-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats?.recentProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 font-medium text-gray-900 max-w-[200px] truncate">
                      {project.name}
                    </td>
                    <td className="py-4">
                      <Badge variant={project.status.toLowerCase()}>
                        {project.status}
                      </Badge>
                    </td>
                    <td className="py-4 text-sm text-gray-500">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 text-right">
                      <button className="text-indigo-600 hover:text-indigo-900 font-medium text-sm">
                        View
                      </button>
                    </td>
                  </tr>
                )) || (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-gray-500">
                      No projects yet. <button className="font-semibold text-indigo-600 hover:underline">Create one →</button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

