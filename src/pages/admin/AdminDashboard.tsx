import { useEffect, useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { Shield, Play, RotateCcw, Trophy, Users } from 'lucide-react';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const AdminDashboard = () => {
  const { 
    dashboardData, 
    loading, 
    loadDashboardData, 
    startTournament, 
    resetTournament 
  } = useAdmin();
  
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const teamCount = dashboardData?.teams.length; 
  const tournamentStatus = dashboardData?.tournament?.status; 
  const currentRound = dashboardData?.tournament?.currentRound; 
  const matchesCount = dashboardData?.matches.length;

  const handleStartTournament = async () => {
    if (teamCount && teamCount < 8) {
      toast.info('Need at least 8 teams to start tournament');
      return;
    }

    if (!confirm('Start tournament? This will create the bracket and matches.')) {
      return;
    }

    setActionLoading(true);
    try {
      await startTournament();
      toast.success('Tournament started successfully!');
    } catch (error) {
      console.error('Error starting tournament:', error);
      toast.error('Failed to start tournament');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetTournament = async () => {
    if (!confirm('Reset tournament to quarter finals? This will delete all match results.')) {
      return;
    }

    setActionLoading(true);
    try {
      await resetTournament();
      toast.success('Tournament reset successfully!');
    } catch (error) {
      console.error('Error resetting tournament:', error);
      toast.error('Failed to reset tournament');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && !dashboardData) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="font-bold uppercase">LOADING...</p>
      </div>
    );
  }

  const { teams = [], tournament } = dashboardData || {};

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-10 h-10" />
            <h1>ADMIN DASHBOARD</h1>
          </div>
          <p className="text-[var(--text-secondary)]">SYSTEM MANAGEMENT & TOURNAMENT CONTROLS</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <p className="text-xs font-bold uppercase text-[var(--text-secondary)] mb-1">REGISTERED TEAMS</p>
            <p className="font-bold text-3xl">{teamCount || 0}</p>
          </div>

          <div className="card">
            <p className="text-xs font-bold uppercase text-[var(--text-secondary)] mb-1">TOURNAMENT STATUS</p>
            <p className="font-bold text-xl">{tournamentStatus?.toUpperCase() || 'N/A'}</p>
          </div>

          <div className="card">
            <p className="text-xs font-bold uppercase text-[var(--text-secondary)] mb-1">CURRENT ROUND</p>
            <p className="font-bold text-xl">
              {currentRound?.replace('_', ' ').toUpperCase() || 'N/A'}
            </p>
          </div>

          <div className="card">
            <p className="text-xs font-bold uppercase text-[var(--text-secondary)] mb-1">MATCHES</p>
            <p className="font-bold text-3xl">{matchesCount || 0}</p>
          </div>
        </div>

        <div className="card mb-8">
          <h3 className="mb-4">TOURNAMENT CONTROLS</h3>

          {teamCount == 8 && (<div className="flex gap-4">
            {(!tournament || tournament.status === 'registration') && (
              <button
                onClick={handleStartTournament}
                disabled={actionLoading || (teamCount || 0) < 8}
                className="btn btn-primary flex items-center justify-center gap-2 w-full"
              >
                <Play className="w-5 h-5" />
                {actionLoading ? 'STARTING...' : 'START TOURNAMENT'}
              </button>
            )}

            {tournament && tournament.status === 'active' && (
              <a href="/admin/matches" className="btn btn-primary flex items-center justify-center gap-2 w-full">
                <Trophy className="w-5 h-5" />
                MANAGE MATCHES
              </a>
            )}

            {tournament && (
              <button
                onClick={handleResetTournament}
                disabled={actionLoading}
                className="btn flex items-center justify-center gap-2 w-full"
              >
                <RotateCcw className="w-5 h-5" />
                {actionLoading ? 'RESETTING...' : 'RESET TOURNAMENT'}
              </button>
            )}
          </div>)}

          {(teamCount || 0) < 8 && (
            <div className="mt-4 p-4 border-2 border-yellow-600 bg-yellow-50 dark:bg-yellow-950">
              <p className="text-yellow-800 dark:text-yellow-200 font-bold text-sm">
                NEED {8 - (teamCount || 0)} MORE TEAM(S) TO START TOURNAMENT
              </p>
            </div>
          )}
        </div>

        <div className="border-0">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6" />
            <h3>REGISTERED TEAMS</h3>
          </div>

          {teams.length === 0 ? (
            <div className="text-center py-8 border-2 border-[var(--border)]">
              <p className="text-[var(--text-secondary)]">NO TEAMS REGISTERED</p>
            </div>
          ) : (
            <table className="table-brutalist">
              <thead>
                <tr>
                  <th>COUNTRY</th>
                  <th>MANAGER</th>
                  <th>AVG RATING</th>
                  <th>FEDERATION</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team) => (
                  <tr key={team.id}>
                    <td className="font-bold">{team.country}</td>
                    <td>{team.manager}</td>
                    <td className="font-bold">{team.averageRating.toFixed(1)}</td>
                    <td>{team.federationUser?.email || 'No federation'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};