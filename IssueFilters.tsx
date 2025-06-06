import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { IssueCategory, IssueStatus } from '../../types';

interface IssueFiltersProps {
  onFilterChange: (categories: IssueCategory[], statuses: IssueStatus[]) => void;
}

const categoryOptions: Array<{ value: IssueCategory; label: string; color: string }> = [
  { value: 'roads', label: 'Roads & Sidewalks', color: 'bg-red-500' },
  { value: 'lighting', label: 'Street Lighting', color: 'bg-amber-500' },
  { value: 'trash', label: 'Trash & Sanitation', color: 'bg-indigo-500' },
  { value: 'water', label: 'Water Services', color: 'bg-cyan-500' },
  { value: 'electricity', label: 'Electricity', color: 'bg-orange-500' },
  { value: 'safety', label: 'Public Safety', color: 'bg-red-700' },
  { value: 'noise', label: 'Noise Complaint', color: 'bg-violet-500' },
  { value: 'other', label: 'Other', color: 'bg-gray-500' }
];

const statusOptions: Array<{ value: IssueStatus; label: string; color: string }> = [
  { value: 'reported', label: 'Reported', color: 'bg-yellow-200 text-yellow-800' },
  { value: 'under_review', label: 'Under Review', color: 'bg-blue-200 text-blue-800' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-indigo-200 text-indigo-800' },
  { value: 'resolved', label: 'Resolved', color: 'bg-green-200 text-green-800' },
  { value: 'closed', label: 'Closed', color: 'bg-gray-200 text-gray-800' }
];

const IssueFilters: React.FC<IssueFiltersProps> = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<IssueCategory[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<IssueStatus[]>([]);

  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };

  const toggleCategory = (category: IssueCategory) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const toggleStatus = (status: IssueStatus) => {
    setSelectedStatuses(prev => {
      if (prev.includes(status)) {
        return prev.filter(s => s !== status);
      } else {
        return [...prev, status];
      }
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedStatuses([]);
  };

  // Apply filters when they change
  React.useEffect(() => {
    onFilterChange(selectedCategories, selectedStatuses);
  }, [selectedCategories, selectedStatuses, onFilterChange]);

  return (
    <div className="relative">
      <button
        onClick={toggleFilter}
        className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
          isOpen || selectedCategories.length > 0 || selectedStatuses.length > 0
            ? 'bg-blue-100 text-blue-800'
            : 'bg-white text-gray-700 border border-gray-300'
        } hover:bg-blue-50 transition-colors shadow-sm`}
      >
        <Filter size={16} />
        <span>Filters</span>
        {(selectedCategories.length > 0 || selectedStatuses.length > 0) && (
          <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
            {selectedCategories.length + selectedStatuses.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 p-4 bg-white rounded-lg shadow-lg z-10 w-72 md:w-80">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-gray-700">Filter Issues</h3>
            <button 
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear all
            </button>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Categories</h4>
            <div className="grid grid-cols-2 gap-2">
              {categoryOptions.map(category => (
                <button
                  key={category.value}
                  onClick={() => toggleCategory(category.value)}
                  className={`px-3 py-2 rounded-md text-xs font-medium transition-colors flex items-center ${
                    selectedCategories.includes(category.value)
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className={`h-3 w-3 rounded-full ${category.color} mr-2`}></span>
                  <span className="truncate">{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
            <div className="space-y-2">
              {statusOptions.map(status => (
                <button
                  key={status.value}
                  onClick={() => toggleStatus(status.value)}
                  className={`w-full px-3 py-2 rounded-md text-xs font-medium transition-colors text-left ${
                    selectedStatuses.includes(status.value)
                      ? status.color
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueFilters;