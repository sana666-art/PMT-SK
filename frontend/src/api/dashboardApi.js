import API from './axios';
import { getProfile } from './userApi';

// Dashboard stats & data
export const getDashboardStats = async () => {
  try {
    // Get user ID first
    const profileRes = await getProfile();
    const profileData = profileRes.data?.data;
    if (!profileData || !profileData.id) {
      throw new Error(`Invalid profile response: ${JSON.stringify(profileRes?.data)}`);
    }
    const userId = profileData.id;
    
    console.log('User ID:', userId);
    
    // Parallel requests for performance
    const [allProjectsRes, allTasksRes, assigneeTasksRes] = await Promise.all([
      API.get('/projects'),
      API.get('/tasks'),
      API.get(`/tasks/assignee/${userId}`)
    ]);

    const projects = allProjectsRes.data?.data || allProjectsRes.data || [];
    const allTasks = allTasksRes.data?.data || allTasksRes.data || [];
    const userTasks = assigneeTasksRes.data?.data || assigneeTasksRes.data || [];

    console.log('Projects count:', projects.length);
    console.log('Tasks count:', allTasks.length, 'My tasks:', userTasks.length);

    // Calculate stats
    const stats = {
      totalProjects: projects.length,
      totalTasks: allTasks.length,
      myTasks: userTasks.length,
      tasksPending: userTasks.filter(t => t.status === 'PENDING').length,
      tasksCompleted: userTasks.filter(t => t.status === 'COMPLETED').length,
      recentProjects: projects.slice(0, 5).map(p => ({
        id: p.id,
        name: p.name,
        status: p.status,
        createdAt: p.createdAt
      })),
      recentTasks: userTasks.slice(0, 5).map(t => ({
        id: t.id,
        title: t.title,
        status: t.status,
        priority: t.priority,
        projectId: t.project?.id,
        projectName: t.project?.name
      }))
    };

    return stats;
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return {
      totalProjects: 0,
      totalTasks: 0,
      myTasks: 0,
      tasksPending: 0,
      tasksCompleted: 0,
      recentProjects: [],
      recentTasks: []
    };
  }
};