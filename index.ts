export type UserRole = 'citizen' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export type IssueCategory = 
  | 'roads' 
  | 'lighting' 
  | 'trash' 
  | 'water' 
  | 'electricity' 
  | 'safety' 
  | 'noise' 
  | 'other';

export type IssueStatus = 
  | 'reported' 
  | 'under_review' 
  | 'in_progress' 
  | 'resolved' 
  | 'closed';

export interface Comment {
  id: string;
  issueId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  location: Location;
  photos: string[];
  reportedBy: string;
  reportedAt: string;
  updatedAt: string;
  upvotes: number;
  comments: Comment[];
  hasUpvoted?: boolean;
}

export interface ReportFormData {
  title: string;
  description: string;
  category: IssueCategory;
  location: Location;
  photos: File[];
}

export interface IssueFilters {
  categories: IssueCategory[];
  statuses: IssueStatus[];
  timeRange: 'day' | 'week' | 'month' | 'year' | 'all';
  proximity?: number; // in km
}

export interface DashboardStats {
  totalIssues: number;
  resolvedIssues: number;
  inProgressIssues: number;
  issuesByCategory: Record<IssueCategory, number>;
  issuesByStatus: Record<IssueStatus, number>;
  issuesTrend: {
    date: string;
    reported: number;
    resolved: number;
  }[];
  topUpvotedIssues: Issue[];
}