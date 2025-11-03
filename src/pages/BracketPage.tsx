// pages/BracketPage.tsx
import { useEffect, useState } from 'react';
import { Team, MatchWithTeams } from '../types/database';
import { Trophy, ChevronDown, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'flag-icons/css/flag-icons.min.css';

const getFlag = (country: string) => {
  const flags: Record<string, string> = {
    'Nigeria': 'ng',
    'Egypt': 'eg',
    'Senegal': 'sn',
    'Morocco': 'ma',
    'Ghana': 'gh',
    'Cameroon': 'cm',
    'Ivory Coast': 'ci',
    'South Africa': 'za',
    'Algeria': 'dz',
    'Tunisia': 'tn',
    'DR Congo': 'cd',
    'Mali': 'ml',
    'Burkina Faso': 'bf',
    'Guinea': 'gn',
    'Uganda': 'ug',
    'Zambia': 'zm',
    'Kenya': 'ke',
    'Tanzania': 'tz',
    'Ethiopia': 'et',
    'Angola': 'ao'
  };
  return flags[country] || 'un';
};

export const BracketPage = () => {
  const [matches, setMatches] = useState<MatchWithTeams[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const apiURL = import.meta.env.VITE_AUTHAPI_URL || '';

  const loadBracketData = async () => {
    try {
      const response = await fetch(`${apiURL}/bracket`);
      if (!response.ok) throw new Error('Failed to load bracket data');

      const result = await response.json();
      if (result.success) {
        setMatches(result.data.matches || []);
        setTeams(result.data.teams || []);
      }
    } catch (error) {
      console.error('Error loading bracket data:', error);
      toast.error('Failed to load bracket data');
    } finally {
      setLoading(false);
    }
  };

  const refreshBracket = async () => {
    setRefreshing(true);
    await loadBracketData();
    setRefreshing(false);
    toast.success('Bracket updated');
  };

  useEffect(() => {
    loadBracketData();
  }, []);

  const qf = matches.filter(m => m.round === 'quarter_finals');
  const sf = matches.filter(m => m.round === 'semi_finals');
  const final = matches.find(m => m.round === 'final');

  const getWinner = (match: MatchWithTeams | undefined) => {
    if (!match || !match.winnerId) return null;
    return match.homeTeamId === match.winnerId ? match.homeTeam : match.awayTeam;
  };

  const TeamCard = ({ team, score, isWinner, decided = false }: { team: Team; score?: number | null; isWinner?: boolean; decided?: boolean }) => {
    // When a match is not decided yet, show neutral styling
    const baseClasses = 'flex items-center gap-3 px-4 py-3 border-2 rounded-lg min-w-[220px] transition-all';
    const neutral = 'bg-[var(--bg-secondary)] border-[var(--border)] dark:bg-[var(--bg-secondary)]';
    const winnerCls = 'bg-green-50 dark:bg-green-950 border-green-600';
    const loserCls = 'bg-red-50 border-red-600 dark:bg-red-950';

    const stateCls = !decided ? neutral : (isWinner ? winnerCls : loserCls);

    return (
      <div className={`${baseClasses} ${stateCls}`}>
      <span className={`fi fi-${getFlag(team.country)}`} style={{ fontSize: '1.8rem' }}></span>
      <span className="font-bold flex-1">{team.country}</span>
        {score !== undefined && (
          <span className={`text-2xl font-bold ${decided && isWinner ? 'text-green-600' : ''}`}>
            {score ?? '-'}
          </span>
        )}
      </div>
    );
  };

  const EmptyCard = ({ label = "Awaiting Winner" }: { label?: string }) => (
    <div className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-[var(--border)] bg-[var(--bg-secondary)] rounded-lg min-w-[220px]">
      <div className="w-7 h-7 rounded-full bg-[var(--bg-primary)] border-2 border-dashed border-[var(--border)] flex items-center justify-center">
        <span className="text-sm">?</span>
      </div>
      <span className="text-[var(--text-secondary)]">{label}</span>
    </div>
  );

  const MatchPair = ({ match }: { match: MatchWithTeams }) => {
    const decided = !!match.winnerId || match.status === 'completed';
    return (
      <div className="flex flex-col gap-2">
        <TeamCard
          team={match.homeTeam}
          score={match.homeScore}
          isWinner={match.winnerId === match.homeTeamId}
          decided={decided}
        />
        <div className="text-center text-xs font-bold text-[var(--text-secondary)]">VS</div>
        <TeamCard
          team={match.awayTeam}
          score={match.awayScore}
          isWinner={match.winnerId === match.awayTeamId}
          decided={decided}
        />
      </div>
    );
  };

  const WinnerCard = ({ team, isWinner = false, decided = false }: { team: Team | null; isWinner?: boolean; decided?: boolean }) => (
    team ? <TeamCard team={team} isWinner={isWinner} decided={decided} /> : <EmptyCard />
  );

  // Get all winners with winner status
  const qfWinners = [
    (() => {
      const team = getWinner(qf[0]);
      const next = sf[0];
      const decided = !!next && (!!next.winnerId || next.status === 'completed');
      const isWinner = decided ? getWinner(next)?.id === team?.id : false;
      return { team, isWinner, decided };
    })(),
    (() => {
      const team = getWinner(qf[1]);
      const next = sf[0];
      const decided = !!next && (!!next.winnerId || next.status === 'completed');
      const isWinner = decided ? getWinner(next)?.id === team?.id : false;
      return { team, isWinner, decided };
    })(),
    (() => {
      const team = getWinner(qf[2]);
      const next = sf[1];
      const decided = !!next && (!!next.winnerId || next.status === 'completed');
      const isWinner = decided ? getWinner(next)?.id === team?.id : false;
      return { team, isWinner, decided };
    })(),
    (() => {
      const team = getWinner(qf[3]);
      const next = sf[1];
      const decided = !!next && (!!next.winnerId || next.status === 'completed');
      const isWinner = decided ? getWinner(next)?.id === team?.id : false;
      return { team, isWinner, decided };
    })(),
  ];

  const sfWinners = [
    (() => {
      const team = getWinner(sf[0]);
      const decided = !!final && (!!final.winnerId || final.status === 'completed');
      const isWinner = decided ? getWinner(final)?.id === team?.id : false;
      return { team, isWinner, decided };
    })(),
    (() => {
      const team = getWinner(sf[1]);
      const decided = !!final && (!!final.winnerId || final.status === 'completed');
      const isWinner = decided ? getWinner(final)?.id === team?.id : false;
      return { team, isWinner, decided };
    })(),
  ];

  const champion = getWinner(final);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-bold uppercase">LOADING BRACKET...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)] py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <button
            onClick={refreshBracket}
            disabled={refreshing}
            className="btn flex items-center gap-2 absolute top-24 right-8"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'REFRESHING...' : 'REFRESH'}
          </button>
          <h2 className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-4">
            ROAD TO THE FINAL
          </h2>

          {/* Registered Teams Info */}
          {teams.length > 0 && (
            <div className="card inline-block mb-4">
              <p className="text-sm font-bold uppercase text-[var(--text-secondary)]">
                REGISTERED TEAMS: {teams.length}/8
              </p>
              {teams.length < 8 && (
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                  Waiting for {8 - teams.length} more team(s) to start tournament
                </p>
              )}
            </div>
          )}
        </div>

        {/* Tree Structure */}
        <div className="flex flex-col items-center gap-8">

          {/* Level 1: Quarter Finals (8 teams) */}
          <div className="w-full">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold">QUARTER FINALS</h3>
              <div className="h-1 w-32 bg-[var(--border)] mx-auto mt-2"></div>
            </div>

            {qf.length > 0 ? (
              <div className="grid grid-cols-4 gap-8 justify-items-center">
                {qf.map((match) => (
                  <MatchPair key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <div className="text-center">
                <div className="grid grid-cols-4 gap-8 justify-items-center">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="flex flex-col gap-2">
                      <EmptyCard label="Team TBD" />
                      <div className="text-center text-xs font-bold text-[var(--text-secondary)]">VS</div>
                      <EmptyCard label="Team TBD" />
                    </div>
                  ))}
                </div>
                <p className="text-[var(--text-secondary)] mt-4">
                  Quarter-finals will be generated when 8 teams are registered
                </p>
              </div>
            )}
          </div>

          {/* Arrow Down */}
          {qf.length > 0 && (
            <div className="flex gap-4">
              <ChevronDown className="w-8 h-8 text-[var(--text-secondary)] animate-bounce" />
              <ChevronDown className="w-8 h-8 text-[var(--text-secondary)] animate-bounce" style={{ animationDelay: '0.1s' }} />
              <ChevronDown className="w-8 h-8 text-[var(--text-secondary)] animate-bounce" style={{ animationDelay: '0.2s' }} />
              <ChevronDown className="w-8 h-8 text-[var(--text-secondary)] animate-bounce" style={{ animationDelay: '0.3s' }} />
            </div>
          )}

          {/* Level 2: Semi Finals (4 winners) */}
          <div className="w-full">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold">SEMI FINALS</h3>
              <div className="h-1 w-32 bg-[var(--border)] mx-auto mt-2"></div>
            </div>
            <div className="flex justify-center gap-16">
              {/* SF1 */}
              <div className="flex flex-col gap-2">
                <WinnerCard
                  team={qfWinners[0].team}
                  isWinner={sf[0] ? getWinner(sf[0])?.id === qfWinners[0].team?.id : false}
                  decided={!!sf[0] && (!!sf[0].winnerId || sf[0].status === 'completed')}
                />
                <div className="text-center text-xs font-bold text-[var(--text-secondary)]">VS</div>
                <WinnerCard
                  team={qfWinners[1].team}
                  isWinner={sf[0] ? getWinner(sf[0])?.id === qfWinners[1].team?.id : false}
                  decided={!!sf[0] && (!!sf[0].winnerId || sf[0].status === 'completed')}
                />
                {sf[0] && sf[0].status === 'completed' && (
                  <div className="text-center mt-2 px-3 py-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded">
                    <span className="font-bold text-lg">
                      {sf[0].homeScore} - {sf[0].awayScore}
                    </span>
                  </div>
                )}
              </div>

              {/* SF2 */}
              <div className="flex flex-col gap-2">
                <WinnerCard
                  team={qfWinners[2].team}
                  isWinner={sf[1] ? getWinner(sf[1])?.id === qfWinners[2].team?.id : false}
                  decided={!!sf[1] && (!!sf[1].winnerId || sf[1].status === 'completed')}
                />
                <div className="text-center text-xs font-bold text-[var(--text-secondary)]">VS</div>
                <WinnerCard
                  team={qfWinners[3].team}
                  isWinner={sf[1] ? getWinner(sf[1])?.id === qfWinners[3].team?.id : false}
                  decided={!!sf[1] && (!!sf[1].winnerId || sf[1].status === 'completed')}
                />
                {sf[1] && sf[1].status === 'completed' && (
                  <div className="text-center mt-2 px-3 py-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded">
                    <span className="font-bold text-lg">
                      {sf[1].homeScore} - {sf[1].awayScore}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Arrow Down */}
          {sf.length > 0 && (
            <div className="flex gap-4">
              <ChevronDown className="w-8 h-8 text-[var(--text-secondary)] animate-bounce" />
              <ChevronDown className="w-8 h-8 text-[var(--text-secondary)] animate-bounce" style={{ animationDelay: '0.1s' }} />
            </div>
          )}

          {/* Level 3: Final (2 winners) */}
          <div className="w-full">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold">FINAL</h3>
              <div className="h-1 w-32 bg-[var(--border)] mx-auto mt-2"></div>
            </div>
            <div className="flex justify-center">
              <div className="flex flex-col gap-2">
                <WinnerCard team={sfWinners[0].team} isWinner={sfWinners[0].isWinner} />
                <div className="text-center text-xs font-bold text-[var(--text-secondary)]">VS</div>
                <WinnerCard team={sfWinners[1].team} isWinner={sfWinners[1].isWinner} />
                {final && final.status === 'completed' && (
                  <div className="text-center mt-2 px-3 py-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded">
                    <span className="font-bold text-xl">
                      {final.homeScore} - {final.awayScore}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Arrow Down */}
          {champion && (
            <>
              <ChevronDown className="w-8 h-8 text-yellow-600 animate-bounce" />

              {/* Level 4: Champion */}
              <div className="w-full">
                <div className="text-center">
                  <div className="inline-block card bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-4 border-yellow-500 p-8">
                    <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-600 dark:text-yellow-400" />
                    <p className="font-bold uppercase text-sm mb-4 text-yellow-700 dark:text-yellow-400">
                      🏆 CHAMPION 🏆
                    </p>
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 border-4 border-white dark:border-gray-800 shadow-lg flex items-center justify-center mx-auto mb-4">
                      <span className={`fi fi-${getFlag(champion.country)}`} style={{ fontSize: '4rem' }}></span>
                    </div>
                    <h2 className="text-4xl font-bold">{champion.country}</h2>
                    <p className="text-sm text-[var(--text-secondary)] mt-2">MANAGER: {champion.manager}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};