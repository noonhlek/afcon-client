// pages/admin/MatchManagement.tsx
import { useEffect, useState } from 'react';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { MatchWithTeams, TournamentState } from '../../types/database';
import { Play, Zap, CheckCircle, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAdmin } from '../../hooks/useAdmin';

export const MatchManagement = () => {
  const { dashboardData, loading, loadDashboardData } = useAdmin();
  const [simulating, setSimulating] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const apiURL = import.meta.env.VITE_AUTHAPI_URL || '';

  useEffect(() => {
    if (!dashboardData) {
      loadDashboardData();
    }
  }, []);

  const refreshMatches = async () => {
    setRefreshing(true);
    try {
      await loadDashboardData();
      toast.success('Matches refreshed');
    } catch (error) {
      toast.error('Failed to refresh matches');
    } finally {
      setRefreshing(false);
    }
  };

  const simulateMatch = async (match: MatchWithTeams, withCommentary: boolean = false) => {
    setSimulating(match.id);

    try {
      const homeRating = match.homeTeam.averageRating;
      const awayRating = match.awayTeam.averageRating;

      const homeStrength = homeRating / (homeRating + awayRating);
      const awayStrength = awayRating / (homeRating + awayRating);

      let homeGoals = Math.floor(Math.random() * 4 * homeStrength + Math.random() * 2);
      let awayGoals = Math.floor(Math.random() * 4 * awayStrength + Math.random() * 2);

      // Handle draws - this is a knockout, we need a winner!
      if (homeGoals === awayGoals) {
        // Simulate extra time / penalties - slightly favor the stronger team
        if (Math.random() < homeStrength) {
          homeGoals++;
        } else {
          awayGoals++;
        }
      }

      // Determine winner ID
      let winnerId;
      if (homeGoals > awayGoals) {
        winnerId = match.homeTeamId || match.homeTeam.id || (match.homeTeam as any)._id;
      } else {
        winnerId = match.awayTeamId || match.awayTeam.id || (match.awayTeam as any)._id;
      }

      const commentary: any[] = [];

      if (withCommentary) {
        commentary.push({
          minute: 0,
          type: 'commentary',
          team: 'home',
          description: `Match kicks off at the stadium!`
        });

        const homeTeamId = match.homeTeam._id;
        const awayTeamId = match.awayTeam._id;

        console.log('🔍 Team IDs:', { homeTeamId, awayTeamId });

        // Fetch players for both teams
        let homePlayers = [];
        let awayPlayers = [];

        if (homeTeamId && homeTeamId !== 'undefined') {
          try {
            const homePlayersResponse = await fetch(`${apiURL}/players/team/${homeTeamId}`);
            if (homePlayersResponse.ok) {
              const result = await homePlayersResponse.json();
              homePlayers = result.data || [];
            }
          } catch (error) {
            console.error('Error fetching home players:', error);
          }
        }

        if (awayTeamId && awayTeamId !== 'undefined') {
          try {
            const awayPlayersResponse = await fetch(`${apiURL}/players/team/${awayTeamId}`);
            if (awayPlayersResponse.ok) {
              const result = await awayPlayersResponse.json();
              awayPlayers = result.data || [];
            }
          } catch (error) {
            console.error('Error fetching away players:', error);
          }
        }

        // Get actual player names or fallback to generic names
        const homePlayerNames = homePlayers.length > 0
          ? homePlayers.map((p: any) => p.name)
          : ['Striker', 'Midfielder', 'Winger', 'Forward', 'Attacker'];

        const awayPlayerNames = awayPlayers.length > 0
          ? awayPlayers.map((p: any) => p.name)
          : ['Striker', 'Midfielder', 'Winger', 'Forward', 'Attacker'];

        console.log('🔍 Players found:', {
          homePlayers: homePlayerNames.length,
          awayPlayers: awayPlayerNames.length
        });

        const goalEvents: any[] = [];

        // ✅ ADD THIS: Generate home team goals
        for (let i = 0; i < homeGoals; i++) {
          const minute = Math.floor(Math.random() * 90) + 1;
          const randomPlayer = homePlayerNames[Math.floor(Math.random() * homePlayerNames.length)];
          goalEvents.push({
            minute,
            type: 'goal',
            team: 'home',
            player: randomPlayer,
            description: `GOAL! ${match.homeTeam.country} scores through ${randomPlayer}!`
          });
        }

        // ✅ ADD THIS: Generate away team goals
        for (let i = 0; i < awayGoals; i++) {
          const minute = Math.floor(Math.random() * 90) + 1;
          const randomPlayer = awayPlayerNames[Math.floor(Math.random() * awayPlayerNames.length)];
          goalEvents.push({
            minute,
            type: 'goal',
            team: 'away',
            player: randomPlayer,
            description: `GOAL! ${match.awayTeam.country} scores through ${randomPlayer}!`
          });
        }

        // Sort all goals by minute
        goalEvents.sort((a, b) => a.minute - b.minute);
        commentary.push(...goalEvents);

        commentary.push({
          minute: 90,
          type: 'commentary',
          team: 'home',
          description: `Full time! Final score: ${match.homeTeam.country} ${homeGoals} - ${awayGoals} ${match.awayTeam.country}`
        });

        if (homeGoals - awayGoals === 1 || awayGoals - homeGoals === 1) {
          const wasDraw = Math.random() < 0.3;
          if (wasDraw) {
            commentary.push({
              minute: 120,
              type: 'commentary',
              team: homeGoals > awayGoals ? 'home' : 'away',
              description: homeGoals > awayGoals
                ? `${match.homeTeam.country} wins in extra time/penalties!`
                : `${match.awayTeam.country} wins in extra time/penalties!`
            });
          }
        }
      }

      // Get match ID
      const matchId = match.id || (match as any)._id;

      const requestData = {
        matchId: matchId,
        homeScore: homeGoals,
        awayScore: awayGoals,
        winnerId: winnerId,
        commentary: withCommentary ? commentary : []
      };

      const token = localStorage.getItem('9943577a4b314dfeec97dd0e654a494c');

      const response = await fetch(`${apiURL}/match/simulate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to simulate match');
      }

      toast.success(`Match simulated!\n${match.homeTeam.country} ${homeGoals} - ${awayGoals} ${match.awayTeam.country}`);

      await loadDashboardData();

    } catch (error: any) {
      console.error('Error simulating match:', error);
      toast.error('Failed to simulate match');
    } finally {
      setSimulating(null);
    }
  };

  if (loading && !dashboardData) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="font-bold uppercase">LOADING...</p>
      </div>
    );
  }

  const matches = dashboardData?.matches as MatchWithTeams[] || [];
  const pendingMatches = matches.filter(m => m.status !== 'completed');
  const completedMatches = matches.filter(m => m.status === 'completed');
  const tournament = dashboardData?.tournament as TournamentState;

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="mb-2">MATCH MANAGEMENT</h1>
                <p className="text-[var(--text-secondary)]">SIMULATE AND MANAGE TOURNAMENT MATCHES</p>
              </div>
              <button
                onClick={refreshMatches}
                disabled={refreshing}
                className="btn flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'REFRESHING...' : 'REFRESH'}
              </button>
            </div>

            {/* Tournament Status */}
            {tournament && (
              <div className="card mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div key="tournament-status">
                    <p className="text-xs font-bold uppercase text-[var(--text-secondary)] mb-1">TOURNAMENT STATUS</p>
                    <p className="font-bold text-xl">{tournament.status.toUpperCase()}</p>
                  </div>
                  <div key="current-round">
                    <p className="text-xs font-bold uppercase text-[var(--text-secondary)] mb-1">CURRENT ROUND</p>
                    <p className="font-bold text-xl">
                      {tournament.currentRound?.replace('_', ' ').toUpperCase() || 'REGISTRATION'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Team Count Warning */}
            {dashboardData?.teams && dashboardData.teams.length < 8 && (
              <div className="border-2 border-yellow-600 bg-yellow-50 dark:bg-yellow-950 p-4 mb-4">
                <p className="text-yellow-800 dark:text-yellow-200 font-bold text-sm">
                  NEED {8 - dashboardData.teams.length} MORE TEAM(S) TO START TOURNAMENT
                </p>
                <p className="text-yellow-700 dark:text-yellow-300 text-xs mt-1">
                  Currently have {dashboardData.teams.length} African teams registered
                </p>
              </div>
            )}
          </div>

          {pendingMatches.length > 0 && (
            <div className="mb-8 border-0">
              <h3 className="mb-4">PENDING MATCHES</h3>
              <div className="space-y-4">
                {pendingMatches.map(match => (
                  <div key={match.id} className="border-2 border-[var(--border)] p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold uppercase text-xs">{match.round.replace('_', ' ')}</span>
                      <span className="text-xs text-[var(--text-secondary)]">{match.status.toUpperCase()}</span>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between p-2 border-2 border-[var(--border)] mb-2">
                        <span className="font-bold">{match.homeTeam.country}</span>
                        <span className="text-xs">RATING: {match.homeTeam.averageRating.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 border-2 border-[var(--border)]">
                        <span className="font-bold">{match.awayTeam.country}</span>
                        <span className="text-xs">RATING: {match.awayTeam.averageRating.toFixed(1)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        key={`quick-${match.id}`}
                        onClick={() => simulateMatch(match, false)}
                        disabled={simulating === match.id}
                        className="btn flex items-center justify-center gap-2"
                      >
                        <Zap className="w-4 h-4" />
                        {simulating === match.id ? 'SIMULATING...' : 'QUICK SIM'}
                      </button>
                      <button
                        key={`play-${match.id}`}
                        onClick={() => simulateMatch(match, true)}
                        disabled={simulating === match.id}
                        className="btn btn-primary flex items-center justify-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        {simulating === match.id ? 'PLAYING...' : 'PLAY MATCH'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {completedMatches.length > 0 && (
            <div className="border-0">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6" />
                <h3>COMPLETED MATCHES</h3>
              </div>

              <div className="space-y-6">
                {completedMatches.map(match => {
                  // Convert scores to numbers for proper comparison
                  const homeScore = Number(match.homeScore) || 0;
                  const awayScore = Number(match.awayScore) || 0;

                  // Determine winner based on scores
                  const isHomeWinner = homeScore > awayScore;
                  const isAwayWinner = awayScore > homeScore;

                  return (
                    <div key={match.id} className="border-2 border-[var(--border)] p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold uppercase text-xs">{match.round.replace('_', ' ')}</span>
                        <span className="text-xs text-[var(--text-secondary)]">
                          {match.playedAt && new Date(match.playedAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Match Result */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className={`p-3 border-2 ${isHomeWinner
                          ? 'border-green-600 bg-green-50 dark:bg-green-950'
                          : isAwayWinner
                            ? 'border-red-600 bg-red-50 dark:bg-red-950'
                            : 'border-[var(--border)]'
                          }`}>
                          <p className="font-bold mb-1">{match.homeTeam.country}</p>
                          <p className="text-3xl font-bold">{homeScore}</p>
                        </div>

                        <div className={`p-3 border-2 ${isAwayWinner
                          ? 'border-green-600 bg-green-50 dark:bg-green-950'
                          : isHomeWinner
                            ? 'border-red-600 bg-red-50 dark:bg-red-950'
                            : 'border-[var(--border)]'
                          }`}>
                          <p className="font-bold mb-1">{match.awayTeam.country}</p>
                          <p className="text-3xl font-bold">{awayScore}</p>
                        </div>
                      </div>

                      {/* Match Commentary */}
                      {match.commentary && match.commentary.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-bold uppercase text-sm mb-3 text-[var(--text-secondary)]">
                            MATCH COMMENTARY
                          </h4>
                          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                            {match.commentary.map((event, index) => (
                              <div key={index} className={`p-2 border-l-4 ${event.type === 'goal'
                                ? event.team === 'home'
                                  ? 'border-green-500 bg-green-50 dark:bg-green-950'
                                  : 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                                : 'border-gray-400 bg-gray-50 dark:bg-gray-800'
                                }`}>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-xs bg-[var(--bg-primary)] px-2 py-1 border border-[var(--border)]">
                                    {event.minute}'
                                  </span>
                                  <span className="text-sm">
                                    {event.type === 'goal' ? (
                                      <span className="font-bold">
                                        ⚽ {event.description}
                                      </span>
                                    ) : (
                                      event.description
                                    )}
                                  </span>
                                </div>
                                {event.type === 'goal' && event.player && (
                                  <div className="text-xs text-[var(--text-secondary)] mt-1 ml-12">
                                    Scorer: {event.player}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* No Commentary Message */}
                      {(!match.commentary || match.commentary.length === 0) && (
                        <div className="text-center py-4 border-2 border-dashed border-[var(--border)]">
                          <p className="text-[var(--text-secondary)] text-sm">
                            No commentary available for this match
                          </p>
                          <p className="text-xs text-[var(--text-secondary)] mt-1">
                            Use "PLAY MATCH" to generate match commentary
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {matches.length === 0 && tournament?.status === 'active' && (
            <div className="card text-center">
              <p className="text-[var(--text-secondary)]">NO MATCHES SCHEDULED YET</p>
              <p className="text-sm text-[var(--text-secondary)] mt-2">
                Tournament is active but no matches have been created. Make sure you have 8 teams registered.
              </p>
            </div>
          )}

          {matches.length === 0 && tournament?.status !== 'active' && (
            <div className="card text-center">
              <p className="text-[var(--text-secondary)]">TOURNAMENT NOT STARTED</p>
              <p className="text-sm text-[var(--text-secondary)] mt-2">
                Start the tournament from the Admin Dashboard when 8 teams are registered.
              </p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};