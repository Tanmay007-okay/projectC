import React, { useState, useEffect } from 'react';
import MapView from '../components/map/MapView';
import IssueList from '../components/issues/IssueList';
import { Issue, IssueCategory, IssueStatus } from '../types';
import { useIssueStore } from '../store/issueStore';

const Home: React.FC = () => {
  const { issues, fetchIssues, loading } = useIssueStore();
  const [viewType, setViewType] = useState<'map' | 'list'>('map');
  const [filteredCategories, setFilteredCategories] = useState<IssueCategory[]>([]);
  const [filteredStatuses, setFilteredStatuses] = useState<IssueStatus[]>([]);
  
  useEffect(() => {
    fetchIssues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleFilterChange = (categories: IssueCategory[], statuses: IssueStatus[]) => {
    setFilteredCategories(categories);
    setFilteredStatuses(statuses);
  };
  
  // Filter issues based on selected filters
  const filteredIssues = issues.filter(issue => {
    const categoryMatch = filteredCategories.length === 0 || filteredCategories.includes(issue.category);
    const statusMatch = filteredStatuses.length === 0 || filteredStatuses.includes(issue.status);
    return categoryMatch && statusMatch;
  });
  
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header section */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Community Issues</h1>
          <p className="text-gray-600">View and report local issues in your community</p>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-grow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
            <span className="ml-3 text-lg text-gray-700">Loading issues...</span>
          </div>
        ) : (
          <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {viewType === 'map' ? (
              <div className="h-full rounded-lg overflow-hidden border border-gray-300">
                <MapView 
                  issues={issues} 
                  filters={{ categories: filteredCategories, statuses: filteredStatuses }}
                />
              </div>
            ) : (
              <div className="h-full overflow-y-auto pb-6">
                <IssueList 
                  issues={filteredIssues}
                  onFilterChange={handleFilterChange}
                  onViewTypeChange={setViewType}
                  viewType={viewType}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;