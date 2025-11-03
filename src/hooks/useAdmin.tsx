import { useState, useContext, createContext, ReactNode } from 'react';
import { Team, TournamentState, MatchWithTeams } from '../types/database';

// Types
interface DashboardData {
  teams: Team[];
  tournament: TournamentState | null;
  matches: MatchWithTeams[];
}

interface ApiCallOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
}

interface AdminContextProps {
  dashboardData: DashboardData | null;
  loading: boolean;
  loadDashboardData: () => Promise<void>;
  startTournament: () => Promise<void>;
  resetTournament: () => Promise<void>;
}

const AdminContext = createContext<AdminContextProps | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const apiURL = import.meta.env.VITE_AUTHAPI_URL || '';

  const apiCall = async <T,>(endpoint: string, options: ApiCallOptions = {}): Promise<T> => {
    const token = localStorage.getItem('9943577a4b314dfeec97dd0e654a494c');
    
    const config: RequestInit = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    };

    if (options.body && (options.method === 'POST' || options.method === 'PUT')) {
      config.body = JSON.stringify(options.body);
    }

    const response = await fetch(`${apiURL}/admin${endpoint}`, config);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  };

  const loadDashboardData = async (): Promise<void> => {
    setLoading(true);
    try {
      const result = await apiCall<{ success: boolean; data: DashboardData }>('/dashboard');
      if (result.success) {
        setDashboardData(result.data);
      } else {
        throw new Error('Failed to load dashboard data');
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const startTournament = async (): Promise<void> => {
    setLoading(true);
    try {
      const result = await apiCall<{ success: boolean; message: string }>('/tournament/start', {
        method: 'POST'
      });
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to start tournament');
      }
      
      await loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error starting tournament:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetTournament = async (): Promise<void> => {
    setLoading(true);
    try {
      const result = await apiCall<{ success: boolean; message: string }>('/tournament/reset', {
        method: 'POST'
      });
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to reset tournament');
      }
      
      await loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error resetting tournament:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: AdminContextProps = {
    dashboardData,
    loading,
    loadDashboardData,
    startTournament,
    resetTournament
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContextProps => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};