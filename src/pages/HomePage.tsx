import africanLogo from '../assets/africa.png';

export const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="">AFRICAN NATIONS LEAGUE</h1>
          <img src={africanLogo} alt="African Nations League Logo" className="w-24 h-24 mx-auto my-4" />
          <p className="text-xl mb-8 text-[var(--text-secondary)]">
            ELITE KNOCKOUT TOURNAMENT MANAGEMENT SYSTEM
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/bracket" className="btn btn-primary">
              VIEW BRACKET
            </a>
            <a href="/scorers" className="btn">
              TOP SCORERS
            </a>
            
          </div>
        </div>

        {/* <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="card">
            <Trophy className="w-12 h-12 mb-4" />
            <h3 className="mb-3">TOURNAMENT FORMAT</h3>
            <p className="text-[var(--text-secondary)]">
              8-team knockout competition featuring Africa's finest national teams.
              Quarter-finals, semi-finals, and grand final.
            </p>
          </div>

          <div className="card">
            <Users className="w-12 h-12 mb-4" />
            <h3 className="mb-3">TEAM MANAGEMENT</h3>
            <p className="text-[var(--text-secondary)]">
              Federation representatives can register and manage their national teams
              with 23-player squads.
            </p>
          </div>

          <div className="card">
            <Target className="w-12 h-12 mb-4" />
            <h3 className="mb-3">MATCH SIMULATION</h3>
            <p className="text-[var(--text-secondary)]">
              Advanced match engine with live commentary and realistic scoring based
              on team ratings.
            </p>
          </div>

          <div className="card">
            <Shield className="w-12 h-12 mb-4" />
            <h3 className="mb-3">ROLE-BASED ACCESS</h3>
            <p className="text-[var(--text-secondary)]">
              Secure authentication system with visitor, federation, and admin roles
              for proper access control.
            </p>
          </div>
        </div>

        <div className="divider" />

        <div className="card bg-[var(--bg-secondary)]">
          <h3 className="mb-4">USER ROLES</h3>
          <div className="space-y-3">
            <div className="border-l-4 border-[var(--border)] pl-4">
              <p className="font-bold uppercase text-sm mb-1">VISITOR</p>
              <p className="text-sm text-[var(--text-secondary)]">
                View bracket, match results, and top scorers
              </p>
            </div>
            <div className="border-l-4 border-[var(--border)] pl-4">
              <p className="font-bold uppercase text-sm mb-1">FEDERATION REPRESENTATIVE</p>
              <p className="text-sm text-[var(--text-secondary)]">
                Register team, manage players, view analytics
              </p>
            </div>
            <div className="border-l-4 border-[var(--border)] pl-4">
              <p className="font-bold uppercase text-sm mb-1">ADMINISTRATOR</p>
              <p className="text-sm text-[var(--text-secondary)]">
                Start tournament, simulate matches, full system control
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};
