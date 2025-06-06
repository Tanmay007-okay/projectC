import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import IssueDetail from '../components/issues/IssueDetail';
import { useIssueStore } from '../store/issueStore';

const IssueDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { issues, fetchIssues, loading, getIssueById } = useIssueStore();
  
  useEffect(() => {
    if (issues.length === 0) {
      fetchIssues();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const issue = id ? getIssueById(id) : undefined;
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center px-3 py-2 mb-6 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <ChevronLeft size={16} className="mr-1" />
        Back
      </button>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
          <span className="ml-3 text-lg text-gray-700">Loading issue details...</span>
        </div>
      ) : issue ? (
        <IssueDetail issue={issue} />
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <h2 className="text-xl font-medium text-gray-900 mb-2">Issue not found</h2>
          <p className="text-gray-600 mb-6">The issue you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to all issues
          </button>
        </div>
      )}
    </div>
  );
};

export default IssueDetailPage;