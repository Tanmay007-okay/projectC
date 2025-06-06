import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, MessageSquare, ChevronUp } from 'lucide-react';
import { Issue, IssueCategory, IssueStatus } from '../../types';

interface IssueCardProps {
  issue: Issue;
  compact?: boolean;
  onClick?: () => void;
}

// Maps for category and status labels/colors
const categoryLabels: Record<IssueCategory, string> = {
  roads: 'Roads & Sidewalks',
  lighting: 'Street Lighting',
  trash: 'Trash & Sanitation',
  water: 'Water Services',
  electricity: 'Electricity',
  safety: 'Public Safety',
  noise: 'Noise Complaint',
  other: 'Other'
};

const statusColors: Record<IssueStatus, { bg: string; text: string }> = {
  reported: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  under_review: { bg: 'bg-blue-100', text: 'text-blue-800' },
  in_progress: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
  resolved: { bg: 'bg-green-100', text: 'text-green-800' },
  closed: { bg: 'bg-gray-100', text: 'text-gray-800' }
};

const statusLabels: Record<IssueStatus, string> = {
  reported: 'Reported',
  under_review: 'Under Review',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed'
};

const IssueCard: React.FC<IssueCardProps> = ({ issue, compact = false, onClick }) => {
  const {
    title,
    description,
    category,
    status,
    location,
    reportedAt,
    upvotes,
    comments
  } = issue;

  const timeAgo = formatDistanceToNow(new Date(reportedAt), { addSuffix: true });
  const statusStyle = statusColors[status];

  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:shadow-lg ${
        onClick ? 'cursor-pointer hover:scale-[1.01]' : ''
      }`}
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <span className={`px-2 py-1 text-xs rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
            {statusLabels[status]}
          </span>
          <span className="text-xs text-gray-500">{timeAgo}</span>
        </div>
        
        <h3 className="font-bold text-lg text-gray-800 mb-1">{title}</h3>
        
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <MapPin size={14} className="mr-1" />
          <span className="truncate">{location.address || 'Location pin on map'}</span>
        </div>
        
        {!compact && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
        )}
        
        <div className="flex items-center justify-between mt-2">
          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            {categoryLabels[category]}
          </span>
          
          <div className="flex items-center space-x-3">
            <button className="flex items-center text-gray-500 hover:text-blue-600 transition-colors">
              <ChevronUp size={16} className={issue.hasUpvoted ? 'text-blue-600' : ''} />
              <span className="ml-1 text-xs">{upvotes}</span>
            </button>
            
            <div className="flex items-center text-gray-500">
              <MessageSquare size={16} />
              <span className="ml-1 text-xs">{comments.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;