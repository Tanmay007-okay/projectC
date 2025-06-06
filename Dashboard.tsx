import React, { useEffect } from 'react';
import { BarChartIcon as ChartBarIcon, BellRing } from 'lucide-react';
import IssueStats from '../components/dashboard/IssueStats';
import TopIssuesWidget from '../components/dashboard/TopIssuesWidget';
import { useIssueStore } from '../store/issueStore';
import { useAuthStore } from '../store/authStore';
import { Navigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { issues, fetchIssues, loading, getDashboardStats } = useIssueStore();
  
  useEffect(() => {
    fetchIssues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  const stats = getDashboardStats();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Overview of reported issues and their status
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <a 
            href="/report" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <BellRing size={16} className="mr-2" />
            Report New Issue
          </a>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
          <span className="ml-3 text-lg text-gray-700">Loading dashboard data...</span>
        </div>
      ) : (
        <div className="space-y-8">
          {/* User welcome */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="h-14 w-14 rounded-full border-2 border-white"
                />
              ) : (
                <div className="h-14 w-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center border-2 border-white text-xl font-bold">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="ml-4 text-white">
                <h2 className="text-2xl font-bold">Welcome, {user?.name}</h2>
                <p className="opacity-90">{user?.role === 'admin' ? 'Administrator' : 'Citizen'}</p>
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <ChartBarIcon size={24} className="mr-2 text-blue-600" />
              Issue Statistics
            </h2>
            <IssueStats stats={stats} />
          </div>
          
          {/* Top Issues */}
          <div className="mt-8">
            <TopIssuesWidget issues={stats.topUpvotedIssues} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;