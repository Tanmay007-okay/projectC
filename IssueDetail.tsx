import React, { useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { MapPin, Calendar, MessageSquare, ChevronUp, Share2, Flag, AlertCircle } from 'lucide-react';
import { Issue } from '../../types';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { useAuthStore } from '../../store/authStore';
import { useIssueStore } from '../../store/issueStore';
import toast from 'react-hot-toast';

interface IssueDetailProps {
  issue: Issue;
}

// Maps for category and status labels/colors
const categoryLabels: Record<string, string> = {
  roads: 'Roads & Sidewalks',
  lighting: 'Street Lighting',
  trash: 'Trash & Sanitation',
  water: 'Water Services',
  electricity: 'Electricity',
  safety: 'Public Safety',
  noise: 'Noise Complaint',
  other: 'Other'
};

const statusColors: Record<string, { bg: string; text: string }> = {
  reported: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  under_review: { bg: 'bg-blue-100', text: 'text-blue-800' },
  in_progress: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
  resolved: { bg: 'bg-green-100', text: 'text-green-800' },
  closed: { bg: 'bg-gray-100', text: 'text-gray-800' }
};

const statusLabels: Record<string, string> = {
  reported: 'Reported',
  under_review: 'Under Review',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed'
};

const IssueDetail: React.FC<IssueDetailProps> = ({ issue }) => {
  const { isAuthenticated, user } = useAuthStore();
  const { upvoteIssue, addComment } = useIssueStore();
  
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleUpvote = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to upvote issues');
      return;
    }
    
    await upvoteIssue(issue.id);
    toast.success(issue.hasUpvoted ? 'Upvote removed' : 'Issue upvoted');
  };
  
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please log in to add comments');
      return;
    }
    
    if (!comment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addComment(issue.id, comment);
      setComment('');
      toast.success('Comment added successfully');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const shareIssue = () => {
    if (navigator.share) {
      navigator.share({
        title: `CivicPulse Issue: ${issue.title}`,
        text: `Check out this civic issue: ${issue.title}`,
        url: window.location.href,
      })
      .then(() => toast.success('Shared successfully'))
      .catch((error) => console.error('Error sharing:', error));
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success('Link copied to clipboard'))
        .catch(() => toast.error('Failed to copy link'));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Issue Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[issue.status].bg} ${statusColors[issue.status].text}`}>
              {statusLabels[issue.status]}
            </span>
            <div className="flex space-x-2">
              <button 
                onClick={shareIssue}
                className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Share issue"
              >
                <Share2 size={20} />
              </button>
              <button 
                className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Report issue"
              >
                <Flag size={20} />
              </button>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-3">{issue.title}</h1>
          
          <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar size={16} className="mr-1 flex-shrink-0" />
              <span>Reported {formatDistanceToNow(new Date(issue.reportedAt), { addSuffix: true })}</span>
            </div>
            <div className="flex items-center">
              <MapPin size={16} className="mr-1 flex-shrink-0" />
              <span className="truncate">{issue.location.address || 'Pin on map'}</span>
            </div>
            <div className="inline-flex items-center rounded-full px-2.5 py-0.5 bg-gray-100 text-gray-800">
              {categoryLabels[issue.category]}
            </div>
          </div>
        </div>
        
        {/* Issue Content */}
        <div className="p-6">
          <div className="prose prose-blue max-w-none mb-6">
            <p className="text-gray-700 whitespace-pre-line">{issue.description}</p>
          </div>
          
          {/* Issue Photos */}
          {issue.photos && issue.photos.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-3">Photos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {issue.photos.map((photo, index) => (
                  <div key={index} className="relative rounded-lg overflow-hidden aspect-w-16 aspect-h-9 bg-gray-100">
                    <img 
                      src={photo} 
                      alt={`Issue photo ${index + 1}`} 
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Issue Location */}
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-3">Location</h2>
            <div className="h-[300px] w-full rounded-lg overflow-hidden">
              <MapContainer 
                center={[issue.location.lat, issue.location.lng]} 
                zoom={15} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[issue.location.lat, issue.location.lng]} />
              </MapContainer>
            </div>
            {issue.location.address && (
              <p className="mt-2 text-sm text-gray-600 flex items-center">
                <MapPin size={14} className="mr-1" />
                {issue.location.address}
              </p>
            )}
          </div>
          
          {/* Actions and Upvotes */}
          <div className="flex justify-between items-center mb-6 py-4 border-t border-b border-gray-200">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{issue.upvotes}</span> people support this issue
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={handleUpvote}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  issue.hasUpvoted 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ChevronUp size={16} className="mr-1" />
                {issue.hasUpvoted ? 'Upvoted' : 'Upvote'}
              </button>
            </div>
          </div>
          
          {/* Comments Section */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <MessageSquare size={20} className="mr-2" />
              Comments ({issue.comments.length})
            </h2>
            
            {!isAuthenticated ? (
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <div className="flex items-start">
                  <AlertCircle size={24} className="text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-800">Login required</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Please <a href="/login" className="font-medium underline">sign in</a> to join the conversation.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <div className="mb-3">
                  <label htmlFor="comment" className="sr-only">Add a comment</label>
                  <textarea
                    id="comment"
                    rows={3}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add your comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting || !comment.trim()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Posting...
                      </>
                    ) : (
                      'Post Comment'
                    )}
                  </button>
                </div>
              </form>
            )}
            
            {issue.comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare size={36} className="mx-auto mb-3 opacity-30" />
                <p>No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {issue.comments.map(comment => (
                  <div key={comment.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        {comment.userAvatar ? (
                          <img 
                            src={comment.userAvatar}
                            alt={comment.userName}
                            className="h-8 w-8 rounded-full mr-2"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-2">
                            {comment.userName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="font-medium">{comment.userName}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetail;