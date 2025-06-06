import { create } from 'zustand';
import { Issue, IssueCategory, IssueStatus, DashboardStats, ReportFormData } from '../types';
import { mockIssues } from '../data/mockIssues';

interface IssueState {
  issues: Issue[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchIssues: () => Promise<void>;
  getIssueById: (id: string) => Issue | undefined;
  addIssue: (issueData: ReportFormData) => Promise<Issue>;
  upvoteIssue: (issueId: string) => Promise<void>;
  addComment: (issueId: string, content: string) => Promise<void>;
  
  // Filtered view
  filterIssuesByCategory: (categories: IssueCategory[]) => Issue[];
  filterIssuesByStatus: (statuses: IssueStatus[]) => Issue[];
  getDashboardStats: () => DashboardStats;
}

export const useIssueStore = create<IssueState>((set, get) => ({
  issues: [],
  loading: false,
  error: null,

  fetchIssues: async () => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      set({ issues: mockIssues, loading: false });
    } catch (error) {
      set({ loading: false, error: 'Failed to fetch issues' });
    }
  },

  getIssueById: (id) => {
    return get().issues.find(issue => issue.id === id);
  },

  addIssue: async (issueData) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newIssue: Issue = {
        id: `issue_${Date.now()}`,
        title: issueData.title,
        description: issueData.description,
        category: issueData.category,
        status: 'reported',
        location: issueData.location,
        photos: [], // In a real app, these would be URLs after upload
        reportedBy: '1', // Current user ID would be used
        reportedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        upvotes: 0,
        comments: [],
      };
      
      set(state => ({ 
        issues: [...state.issues, newIssue],
        loading: false 
      }));
      
      return newIssue;
    } catch (error) {
      set({ loading: false, error: 'Failed to add issue' });
      throw new Error('Failed to add issue');
    }
  },

  upvoteIssue: async (issueId) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set(state => ({
        issues: state.issues.map(issue => 
          issue.id === issueId
            ? { 
                ...issue, 
                upvotes: issue.hasUpvoted ? issue.upvotes - 1 : issue.upvotes + 1,
                hasUpvoted: !issue.hasUpvoted
              }
            : issue
        )
      }));
    } catch (error) {
      set({ error: 'Failed to upvote issue' });
    }
  },

  addComment: async (issueId, content) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newComment = {
        id: `comment_${Date.now()}`,
        issueId,
        userId: '1', // Current user ID would be used
        userName: 'John Citizen', // Current user name would be used
        content,
        createdAt: new Date().toISOString(),
      };
      
      set(state => ({
        issues: state.issues.map(issue => 
          issue.id === issueId
            ? { ...issue, comments: [...issue.comments, newComment] }
            : issue
        )
      }));
    } catch (error) {
      set({ error: 'Failed to add comment' });
    }
  },

  filterIssuesByCategory: (categories) => {
    const { issues } = get();
    if (categories.length === 0) return issues;
    return issues.filter(issue => categories.includes(issue.category));
  },
  
  filterIssuesByStatus: (statuses) => {
    const { issues } = get();
    if (statuses.length === 0) return issues;
    return issues.filter(issue => statuses.includes(issue.status));
  },

  getDashboardStats: () => {
    const { issues } = get();
    
    // Calculate total counts
    const totalIssues = issues.length;
    const resolvedIssues = issues.filter(i => i.status === 'resolved').length;
    const inProgressIssues = issues.filter(i => i.status === 'in_progress').length;
    
    // Group by category
    const issuesByCategory = issues.reduce((acc, issue) => {
      acc[issue.category] = (acc[issue.category] || 0) + 1;
      return acc;
    }, {} as Record<IssueCategory, number>);
    
    // Group by status
    const issuesByStatus = issues.reduce((acc, issue) => {
      acc[issue.status] = (acc[issue.status] || 0) + 1;
      return acc;
    }, {} as Record<IssueStatus, number>);
    
    // Generate trend data for the last 7 days
    const today = new Date();
    const issuesTrend = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split('T')[0];
      
      // Count issues reported on this date
      const reported = issues.filter(issue => 
        issue.reportedAt.split('T')[0] === dateStr
      ).length;
      
      // Count issues resolved on this date
      const resolved = issues.filter(issue => 
        issue.status === 'resolved' && 
        issue.updatedAt.split('T')[0] === dateStr
      ).length;
      
      return { date: dateStr, reported, resolved };
    });
    
    // Top upvoted issues
    const topUpvotedIssues = [...issues]
      .sort((a, b) => b.upvotes - a.upvotes)
      .slice(0, 5);
    
    return {
      totalIssues,
      resolvedIssues,
      inProgressIssues,
      issuesByCategory,
      issuesByStatus,
      issuesTrend,
      topUpvotedIssues
    };
  }
}));