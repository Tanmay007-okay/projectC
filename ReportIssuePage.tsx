import React from 'react';
import { useNavigate } from 'react-router-dom';
import IssueForm from '../components/issues/IssueForm';
import { useAuthStore } from '../store/authStore';
import { useIssueStore } from '../store/issueStore';
import { ReportFormData } from '../types';
import toast from 'react-hot-toast';

const ReportIssuePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addIssue } = useIssueStore();
  
  const handleSubmitIssue = async (data: ReportFormData) => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to report an issue');
      navigate('/login');
      return;
    }
    
    try {
      const newIssue = await addIssue(data);
      toast.success('Issue reported successfully!');
      navigate(`/issues/${newIssue.id}`);
    } catch (error) {
      toast.error('Failed to submit issue. Please try again.');
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Report an Issue</h1>
        <p className="text-gray-600 mt-1">
          Help improve your community by reporting local issues
        </p>
      </div>
      
      <IssueForm />
    </div>
  );
};

export default ReportIssuePage;