import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IssueCard from './IssueCard';
import IssueFilters from './IssueFilters';
import { Issue, IssueCategory, IssueStatus } from '../../types';
import { Search, SlidersHorizontal, Map, GridIcon } from 'lucide-react';

interface IssueListProps {
  issues: Issue[];
  onFilterChange: (categories: IssueCategory[], statuses: IssueStatus[]) => void;
  onViewTypeChange: (viewType: 'map' | 'list') => void;
  viewType: 'map' | 'list';
}

const IssueList: React.FC<IssueListProps> = ({ 
  issues, 
  onFilterChange,
  onViewTypeChange,
  viewType 
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter issues by search term
  const filteredIssues = searchTerm 
    ? issues.filter(issue => 
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (issue.location.address && issue.location.address.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : issues;
    
  const handleIssueClick = (issueId: string) => {
    navigate(`/issues/${issueId}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:w-auto relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search issues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex space-x-2 items-center w-full sm:w-auto justify-between sm:justify-start">
          <IssueFilters onFilterChange={onFilterChange} />
          
          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <button
              onClick={() => onViewTypeChange('list')}
              className={`p-2 ${
                viewType === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              aria-label="List view"
            >
              <GridIcon size={20} />
            </button>
            <button
              onClick={() => onViewTypeChange('map')}
              className={`p-2 ${
                viewType === 'map' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              aria-label="Map view"
            >
              <Map size={20} />
            </button>
          </div>
        </div>
      </div>
      
      {filteredIssues.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <SlidersHorizontal size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No issues found</h3>
          <p className="text-gray-500">
            Try adjusting your filters or search term to find issues.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIssues.map(issue => (
            <IssueCard 
              key={issue.id} 
              issue={issue} 
              onClick={() => handleIssueClick(issue.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default IssueList;