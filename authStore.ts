import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

// Mock user data for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Citizen',
    email: 'john@example.com',
    role: 'citizen',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
  }
];

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user by email (case insensitive)
      const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (user && password === 'password') { // Simple password check for demo
        set({ isAuthenticated: true, user, isLoading: false });
        localStorage.setItem('civicpulse_user', JSON.stringify(user));
        return true;
      } else {
        set({ isLoading: false, error: 'Invalid email or password' });
        return false;
      }
    } catch (error) {
      set({ isLoading: false, error: 'An error occurred during login' });
      return false;
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      const existingUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (existingUser) {
        set({ isLoading: false, error: 'Email already in use' });
        return false;
      }
      
      // Create new user (for demo purposes)
      const newUser: User = {
        id: `user_${Date.now()}`,
        name,
        email,
        role: 'citizen',
      };
      
      // In a real app, you'd send this to the backend
      set({ isAuthenticated: true, user: newUser, isLoading: false });
      localStorage.setItem('civicpulse_user', JSON.stringify(newUser));
      return true;
    } catch (error) {
      set({ isLoading: false, error: 'An error occurred during registration' });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('civicpulse_user');
    set({ isAuthenticated: false, user: null });
  }
}));

// Initialize auth state from localStorage on app load
if (typeof window !== 'undefined') {
  const storedUser = localStorage.getItem('civicpulse_user');
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      useAuthStore.setState({ isAuthenticated: true, user });
    } catch (error) {
      localStorage.removeItem('civicpulse_user');
    }
  }
}