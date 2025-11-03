// pages/federation/FederationDashboard.tsx
import { useEffect, useState } from 'react';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { Users, Edit2 } from 'lucide-react';
import { useMernAccess } from 'mern-access-client';
import { useFederation } from '../../hooks/useFederation';

interface Player {
  _id: string;
  name: string;
  position: 'GK' | 'DF' | 'MF' | 'FW';
  number: number;
  rating: number;
  goals: number;
}


export const FederationDashboard = () => {
  const { user } = useMernAccess();
  const { federationData, loading, loadFederationData } = useFederation();
  const [showRegistration, setShowRegistration] = useState(false);

  useEffect(() => {
    if (user) {
      loadFederationData();
    }
  }, [user]);

  useEffect(() => {
    if (!loading && federationData) {
      setShowRegistration(!federationData.team);
    }
  }, [federationData, loading]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="font-bold uppercase">LOADING...</p>
      </div>
    );
  }

  if (showRegistration) {
    return (
      <ProtectedRoute requiredRole="federation">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="card text-center mb-8">
              <Users className="w-16 h-16 mx-auto mb-4" />
              <h2 className="mb-4">REGISTER YOUR TEAM</h2>
              <p className="text-[var(--text-secondary)] mb-6">
                You haven't registered a team yet. Click below to register your national team
                for the African Nations League.
              </p>
              <a href="/federation/register" className="btn btn-primary">
                REGISTER TEAM
              </a>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const { team, players = [] } = federationData || {};

  return (
    <ProtectedRoute requiredRole="federation">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="mb-2">{team?.country.toUpperCase()}</h1>
            <p className="text-[var(--text-secondary)]">FEDERATION DASHBOARD</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="card">
              <p className="text-xs font-bold uppercase text-[var(--text-secondary)] mb-1">MANAGER</p>
              <p className="font-bold text-xl">{team?.manager}</p>
            </div>

            <div className="card">
              <p className="text-xs font-bold uppercase text-[var(--text-secondary)] mb-1">SQUAD SIZE</p>
              <p className="font-bold text-xl">{players.length} / 23</p>
            </div>

            <div className="card">
              <p className="text-xs font-bold uppercase text-[var(--text-secondary)] mb-1">AVG RATING</p>
              <p className="font-bold text-xl">{team?.averageRating.toFixed(1)}</p>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3>SQUAD</h3>
              <a href="/federation/edit-squad" className="btn flex items-center gap-2">
                <Edit2 className="w-4 h-4" />
                EDIT SQUAD
              </a>
            </div>

            {players.length === 0 ? (
              <div className="text-center py-8 border-2 border-[var(--border)]">
                <p className="text-[var(--text-secondary)]">NO PLAYERS REGISTERED</p>
              </div>
            ) : (
              <table className="table-brutalist">
                <thead>
                  <tr>
                    <th>NO.</th>
                    <th>NAME</th>
                    <th>POSITION</th>
                    <th>RATING</th>
                    <th>GOALS</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player: Player) => (
                    <tr key={player._id}>
                      <td className="font-bold">{player.number}</td>
                      <td className="font-bold">{player.name}</td>
                      <td>
                        <span className="border border-[var(--border)] px-2 py-1 text-xs font-bold">
                          {player.position}
                        </span>
                      </td>
                      <td>{player.rating.toFixed(1)}</td>
                      <td className="font-bold">{player.goals}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};