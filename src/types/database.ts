// types/database.ts
export interface Team {
  _id: string;
  id?: string;
  country: string;
  manager: string;
  federationUserId: string | null;
  federationUser?: {
    id: string;
    email: string;
  };
  averageRating: number;
  isRegistered: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Player {
  id: string;
  teamId: string;
  name: string;
  position: 'GK' | 'DF' | 'MF' | 'FW';
  number: number;
  rating: number;
  goals: number;
  createdAt: string;
}

export interface TournamentState {
  id: string;
  status: 'registration' | 'active' | 'completed';
  currentRound: 'quarter_finals' | 'semi_finals' | 'final' | null;
  startedAt: string | null;
  completedAt: string | null;
  updatedAt: string;
}

export interface Match {
  id: string;
  tournamentId: string | null;
  round: 'quarter_finals' | 'semi_finals' | 'final';
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number | null;
  awayScore: number | null;
  winnerId: string | null;
  status: 'scheduled' | 'in_progress' | 'completed';
  commentary: MatchEvent[];
  playedAt: string | null;
  createdAt: string;
}

export interface MatchEvent {
  minute: number;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'commentary';
  team: 'home' | 'away';
  player?: string;
  description: string;
}

export interface TeamWithPlayers extends Team {
  players: Player[];
}

export interface MatchWithTeams extends Match {
  homeTeam: Team;
  awayTeam: Team;
}