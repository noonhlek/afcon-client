import { useEffect, useState } from 'react';
import { Player, Team } from '../types/database';
import { Target, Trophy } from 'lucide-react';

const apiURL = import.meta.env.VITE_AUTHAPI_URL || '';

interface PlayerWithTeam extends Player {
  team: Team;
}

export const TopScorersPage = () => {
  const [players, setPlayers] = useState<PlayerWithTeam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTopScorers();
  }, []);

  const loadTopScorers = async () => {
    try {
      const response = await fetch(`${apiURL}/players/top-scorers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch top scorers');
      }

      const result = await response.json();
      
      if (result.success) {
        setPlayers(result.data);
      } else {
        throw new Error(result.error || 'Failed to load top scorers');
      }
    } catch (error) {
      console.error('Error loading top scorers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="font-bold uppercase">LOADING TOP SCORERS...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <Target className="w-16 h-16 mx-auto mb-4" />
          <h1 className="mb-2">TOP SCORERS</h1>
          <p className="text-[var(--text-secondary)]">TOURNAMENT GOAL LEADERS</p>
        </div>

        {players.length === 0 ? (
          <div className="card text-center">
            <p className="text-[var(--text-secondary)]">
              NO GOALS SCORED YET. CHECK BACK AFTER MATCHES ARE PLAYED.
            </p>
          </div>
        ) : (
          <div className="border-0">
            <table className="table-brutalist">
              <thead>
                <tr>
                  <th>RANK</th>
                  <th>PLAYER</th>
                  <th>COUNTRY</th>
                  <th>POSITION</th>
                  <th>GOALS</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player, index) => (
                  <tr key={player.id}>
                    <td className="font-bold">
                      {index === 0 && <Trophy className="w-4 h-4 inline mr-2 text-yellow-600" />}
                      {index + 1}
                    </td>
                    <td className="font-bold">{player.name}</td>
                    <td>{player.team?.country}</td>
                    <td>
                      <span className="border border-[var(--border)] px-2 py-1 text-xs font-bold">
                        {player.position}
                      </span>
                    </td>
                    <td className="font-bold text-xl">{player.goals}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};