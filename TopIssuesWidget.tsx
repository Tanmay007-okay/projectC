import React from 'react';
import { ChevronUp, MessageSquare, AlertTriangle } from 'lucide-react';
import { Issue } from '../../types';
import { Link } from 'react-router-dom';

interface TopIssuesWidgetProps {
  issues: Issue[];
}

const TopIssuesWidget: React.FC<TopIssuesWidgetProps> = ({ issues }) => {
  if (issues.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
          <AlertTriangle className="mr-2 text-amber-500" size={20} />
          <span>Top Reported Issues</span>
        </h3>
        <div className="py-4 text-center text-gray-500">
          <p>No issues have been reported yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-700 flex items-center">
          <AlertTriangle className="mr-2 text-amber-500" size={20} />
          <span>Top Reported Issues</span>
        </h3>
        <Link 
          to="/" 
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
        >
          View all
        </Link>
      </div>
      
      <div className="space-y-4">
        {issues.map(issue => (
          <Link 
            key={issue.id} 
            to={`/issues/${issue.id}`}
            className="block"
          >
            <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-gray-800 mb-1">{issue.title}</h4>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  issue.status === 'reported' ? 'bg-yellow-100 text-yellow-800' :
                  issue.status === 'under_review' ? 'bg-blue-100 text-blue-800' :
                  issue.status === 'in_progress' ? 'bg-indigo-100 text-indigo-800' :
                  issue.status === 'resolved' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {issue.status.replace('_', ' ')}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                {issue.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  {issue.category}
                </span>
                
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <ChevronUp size={16} className="text-blue-600" />
                    <span className="ml-1">{issue.upvotes}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <MessageSquare size={16} />
                    <span className="ml-1">{issue.comments.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TopIssuesWidget;