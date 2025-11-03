import { useState, useContext, createContext, ReactNode } from 'react';

interface Player {
  _id: string;
  name: string;
  position: 'GK' | 'DF' | 'MF' | 'FW';
  number: number;
  rating: number;
  goals: number;
}

interface Team {
  _id: string;
  country: string;
  manager: string;
  averageRating: number;
  federationUser: string;
  createdAt: string;
}

interface FederationData {
  team: Team | null;
  players: Player[];
}

interface FederationContextProps {
  federationData: FederationData | null;
  loading: boolean;
  loadFederationData: () => Promise<void>;
  registerTeam: (teamData: any) => Promise<void>;
}

const FederationContext = createContext<FederationContextProps | undefined>(undefined);

export const FederationProvider = ({ children }: { children: ReactNode }) => {
  const [federationData, setFederationData] = useState<FederationData | null>(null);
  const [loading, setLoading] = useState(false);
    const apiURL = import.meta.env.VITE_AUTHAPI_URL || '';

  const apiCall = async <T,>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const token = localStorage.getItem('9943577a4b314dfeec97dd0e654a494c');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${apiURL}/fed${endpoint}`, config);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  };

  const loadFederationData = async (): Promise<void> => {
    setLoading(true);
    try {
      const result = await apiCall<{ success: boolean; data: FederationData }>('/dashboard');
      if (result.success) {
        setFederationData(result.data);
      } else {
        throw new Error('Failed to load federation data');
      }
    } catch (error) {
      console.error('Error loading federation data:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerTeam = async (teamData: any): Promise<void> => {
    setLoading(true);
    try {
      const result = await apiCall<{ success: boolean; message: string }>('/register-team', {
        method: 'POST',
        body: JSON.stringify(teamData)
      });
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to register team');
      }
    } catch (error) {
      console.error('Error registering team:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: FederationContextProps = {
    federationData,
    loading,
    loadFederationData,
    registerTeam
  };

  return (
    <FederationContext.Provider value={value}>
      {children}
    </FederationContext.Provider>
  );
};

export const useFederation = (): FederationContextProps => {
  const context = useContext(FederationContext);
  if (!context) {
    throw new Error('useFederation must be used within a FederationProvider');
  }
  return context;
};