import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { DashboardStats, IssueCategory, IssueStatus } from '../../types';

interface IssueStatsProps {
  stats: DashboardStats;
}

// Colors for categories
const CATEGORY_COLORS: Record<IssueCategory, string> = {
  roads: '#EF4444',      // red
  lighting: '#F59E0B',   // amber
  trash: '#6366F1',      // indigo
  water: '#06B6D4',      // cyan
  electricity: '#F97316', // orange
  safety: '#DC2626',     // red-700
  noise: '#8B5CF6',      // violet
  other: '#6B7280'       // gray
};

// Colors for statuses
const STATUS_COLORS: Record<IssueStatus, string> = {
  reported: '#FEF3C7',     // yellow-100
  under_review: '#DBEAFE',  // blue-100
  in_progress: '#E0E7FF',   // indigo-100
  resolved: '#D1FAE5',      // green-100
  closed: '#F3F4F6'         // gray-100
};

const IssueStats: React.FC<IssueStatsProps> = ({ stats }) => {
  const { 
    totalIssues, 
    resolvedIssues, 
    inProgressIssues, 
    issuesByCategory, 
    issuesByStatus,
    issuesTrend 
  } = stats;
  
  // Prepare data for the charts
  const categoryData = Object.entries(issuesByCategory).map(([category, count]) => ({
    name: category,
    value: count
  }));
  
  const statusData = Object.entries(issuesByStatus).map(([status, count]) => ({
    name: status,
    value: count
  }));

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-600 mb-2">Total Issues</h3>
          <p className="text-3xl font-bold text-blue-800">{totalIssues}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-600 mb-2">Resolved</h3>
          <p className="text-3xl font-bold text-green-600">{resolvedIssues}</p>
          <p className="text-sm text-gray-500 mt-1">
            {totalIssues > 0 ? `${Math.round((resolvedIssues / totalIssues) * 100)}%` : '0%'} resolution rate
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-600 mb-2">In Progress</h3>
          <p className="text-3xl font-bold text-indigo-600">{inProgressIssues}</p>
          <p className="text-sm text-gray-500 mt-1">
            {totalIssues > 0 ? `${Math.round((inProgressIssues / totalIssues) * 100)}%` : '0%'} of all issues
          </p>
        </div>
      </div>
      
      {/* Issues by Category */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Issues by Category</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categoryData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  // Convert category keys to more readable format
                  const mapping: Record<string, string> = {
                    roads: 'Roads',
                    lighting: 'Lighting',
                    trash: 'Trash',
                    water: 'Water',
                    electricity: 'Electric',
                    safety: 'Safety',
                    noise: 'Noise',
                    other: 'Other'
                  };
                  return mapping[value] || value;
                }}
              />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'value') return [value, 'Count'];
                  return [value, name];
                }}
              />
              <Bar 
                dataKey="value" 
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
              >
                {categoryData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={CATEGORY_COLORS[entry.name as IssueCategory] || '#3B82F6'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Issue Status Distribution & Trend */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Issue Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {statusData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={STATUS_COLORS[entry.name as IssueStatus] || '#E5E7EB'} 
                      stroke="#ffffff"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'value') return [value, 'Count'];
                    
                    // Convert status keys to more readable format
                    const mapping: Record<string, string> = {
                      reported: 'Reported',
                      under_review: 'Under Review',
                      in_progress: 'In Progress',
                      resolved: 'Resolved',
                      closed: 'Closed'
                    };
                    
                    return [value, mapping[name] || name];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Trend Line Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Issues Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={issuesTrend}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="reported" 
                  stroke="#3B82F6" 
                  activeDot={{ r: 8 }} 
                  name="Reported"
                />
                <Line 
                  type="monotone" 
                  dataKey="resolved" 
                  stroke="#10B981" 
                  name="Resolved"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueStats;