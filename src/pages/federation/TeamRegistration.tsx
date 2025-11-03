// pages/federation/TeamRegistration.tsx
import { useState } from 'react';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { Users, Download } from 'lucide-react';
import { useMernAccess } from 'mern-access-client';
import { useFederation } from '../../hooks/useFederation';

interface PlayerInput {
  name: string;
  position: 'GK' | 'DF' | 'MF' | 'FW';
  number: number;
}

const POSITIONS = ['GK', 'DF', 'MF', 'FW'] as const;

// South African Squad Data
const SOUTH_AFRICAN_SQUAD = {
  manager: "Hugo Broos",
  players: [
    // Goalkeepers
    { name: "Ronwen Williams", position: "GK" as const, number: 1 },
    { name: "Veli Mothwa", position: "GK" as const, number: 16 },
    { name: "Ricardo Goss", position: "GK" as const, number: 22 },
    
    // Defenders
    { name: "Nyiko Mobbie", position: "DF" as const, number: 2 },
    { name: "Khuliso Mudau", position: "DF" as const, number: 3 },
    { name: "Aubrey Modiba", position: "DF" as const, number: 4 },
    { name: "Mothobi Mvala", position: "DF" as const, number: 5 },
    { name: "Grant Kekana", position: "DF" as const, number: 6 },
    { name: "Nkosinathi Sibisi", position: "DF" as const, number: 14 },
    { name: "Siyanda Xulu", position: "DF" as const, number: 18 },
    { name: "Innocent Maela", position: "DF" as const, number: 20 },
    
    // Midfielders
    { name: "Teboho Mokoena", position: "MF" as const, number: 8 },
    { name: "Sphephelo Sithole", position: "MF" as const, number: 12 },
    { name: "Jayden Adams", position: "MF" as const, number: 13 },
    { name: "Thabang Monare", position: "MF" as const, number: 15 },
    { name: "Thapelo Maseko", position: "MF" as const, number: 17 },
    { name: "Patrick Maswanganyi", position: "MF" as const, number: 23 },
    
    // Forwards
    { name: "Percy Tau", position: "FW" as const, number: 7 },
    { name: "Evidence Makgopa", position: "FW" as const, number: 9 },
    { name: "Zakhele Lepasa", position: "FW" as const, number: 10 },
    { name: "Mihlali Mayambela", position: "FW" as const, number: 11 },
    { name: "Oswin Appollis", position: "FW" as const, number: 19 },
    { name: "Lyle Foster", position: "FW" as const, number: 21 }
  ]
};

const generateRating = (position: string): number => {
  const baseRatings = {
    GK: [65, 80],
    DF: [60, 82],
    MF: [62, 85],
    FW: [63, 88]
  };

  const [min, max] = baseRatings[position as keyof typeof baseRatings];
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const TeamRegistration = () => {
  const { user } = useMernAccess();
  const { registerTeam, loading } = useFederation();
  const [manager, setManager] = useState('');
  const [players, setPlayers] = useState<PlayerInput[]>(
    Array.from({ length: 23 }, (_, i) => ({
      name: '',
      position: 'MF' as const,
      number: i + 1
    }))
  );
  const [error, setError] = useState('');

  const handlePlayerChange = (index: number, field: keyof PlayerInput, value: string) => {
    const updated = [...players];
    if (field === 'number') {
      updated[index] = { ...updated[index], [field]: parseInt(value) || 0 };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setPlayers(updated);
  };

  const handleAutofill = () => {
    // Set manager name
    setManager(SOUTH_AFRICAN_SQUAD.manager);
    
    // Create a new players array with South African squad data
    const autofilledPlayers = [...players];
    
    SOUTH_AFRICAN_SQUAD.players.forEach(squadPlayer => {
      // Find the slot with matching number
      const slotIndex = autofilledPlayers.findIndex(p => p.number === squadPlayer.number);
      if (slotIndex !== -1) {
        autofilledPlayers[slotIndex] = {
          ...squadPlayer
        };
      }
    });
    
    setPlayers(autofilledPlayers);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.country) {
      setError('Country not found in user profile');
      return;
    }

    if (players.some(p => !p.name.trim())) {
      setError('All players must have names');
      return;
    }

    setError('');

    try {
      const playersWithRatings = players.map(p => ({
        name: p.name,
        position: p.position,
        number: p.number,
        rating: generateRating(p.position),
        goals: 0
      }));

      await registerTeam({
        country: user.country,
        manager,
        players: playersWithRatings
      });

      // Redirect to federation dashboard on success
      window.location.href = '/federation/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register team');
    }
  };

  const isSouthAfricanUser = user?.country?.toLowerCase() === 'south africa';

  return (
    <ProtectedRoute requiredRole="federation">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Users className="w-12 h-12 mb-4" />
            <h1 className="mb-2">REGISTER TEAM</h1>
            <p className="text-[var(--text-secondary)]">
              REGISTER YOUR {user?.country?.toUpperCase()} NATIONAL TEAM
            </p>
          </div>

          {isSouthAfricanUser && (
            <div className="mb-6">
              <button
                type="button"
                onClick={handleAutofill}
                className="btn btn-secondary flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                AUTOFILL SOUTH AFRICAN SQUAD
              </button>
              <p className="text-xs text-[var(--text-secondary)] mt-2">
                Pre-fill with the official South African national team squad and manager Hugo Broos
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="border-2 border-red-600 bg-red-50 dark:bg-red-950 p-4">
                <p className="text-red-600 dark:text-red-400 font-bold">{error}</p>
              </div>
            )}

            <div className="card">
              <h3 className="mb-4">TEAM DETAILS</h3>

              <div className="mb-4">
                <label className="block mb-2 font-bold uppercase text-sm tracking-wider">
                  COUNTRY
                </label>
                <input
                  type="text"
                  value={user?.country || ''}
                  className="input"
                  disabled
                />
              </div>

              <div>
                <label className="block mb-2 font-bold uppercase text-sm tracking-wider">
                  MANAGER NAME
                </label>
                <input
                  type="text"
                  value={manager}
                  onChange={(e) => setManager(e.target.value)}
                  className="input"
                  required
                  placeholder="Enter manager name"
                />
              </div>
            </div>

            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h3>SQUAD (23 PLAYERS)</h3>
                {isSouthAfricanUser && (
                  <button
                    type="button"
                    onClick={handleAutofill}
                    className="btn btn-outline flex items-center gap-2 text-sm"
                  >
                    <Download className="w-3 h-3" />
                    AUTOFILL
                  </button>
                )}
              </div>
              <p className="text-xs text-[var(--text-secondary)] mb-4">
                RATINGS WILL BE AUTOMATICALLY GENERATED BASED ON POSITION
              </p>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {players.map((player, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 border-2 border-[var(--border)] p-3">
                    <div className="col-span-1">
                      <label className="block text-xs font-bold mb-1">NO.</label>
                      <input
                        type="number"
                        value={player.number}
                        className="input text-center px-0"
                        disabled
                      />
                    </div>
                    <div className="col-span-7">
                      <label className="block text-xs font-bold mb-1">NAME</label>
                      <input
                        type="text"
                        value={player.name}
                        onChange={(e) => handlePlayerChange(index, 'name', e.target.value)}
                        className="input"
                        required
                        placeholder="Player name"
                      />
                    </div>
                    <div className="col-span-4">
                      <label className="block text-xs font-bold mb-1">POSITION</label>
                      <select
                        value={player.position}
                        onChange={(e) => handlePlayerChange(index, 'position', e.target.value)}
                        className="input"
                      >
                        {POSITIONS.map(pos => (
                          <option key={pos} value={pos}>{pos}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? 'REGISTERING TEAM...' : 'REGISTER TEAM'}
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
};