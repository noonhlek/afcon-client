import { useTheme } from '../../hooks/useTheme';
import { LogOut, Moon, Sun, Menu, X, User, ChevronDown, TrophyIcon } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { RoleRestricted } from '../auth/RoleRestricted';
import { useMernAccess } from 'mern-access-client';
import { useLocation } from 'react-router-dom'; // If using React Router

export const Header = () => {
  const { user } = useMernAccess();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation(); // Get current route

  const handleSignOut = async () => {
    localStorage.removeItem('9943577a4b314dfeec97dd0e654a494c');
    window.location.href = '/';
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper function to check if a link is active
  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  // Navigation link component to avoid repetition
  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const isActive = isActiveLink(href);
    
    return (
      <a
        href={href}
        className={`font-bold uppercase text-sm hover:opacity-70 ${
          isActive ? 'text-[var(--accent)] border-b-2 border-[var(--accent)]' : ''
        }`}
      >
        {children}
      </a>
    );
  };

  // Mobile navigation link component
  const MobileNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const isActive = isActiveLink(href);
    
    return (
      <a
        href={href}
        className={`block py-2 font-bold uppercase text-sm hover:bg-[var(--bg-secondary)] px-4 ${
          isActive ? 'text-[var(--accent)] bg-[var(--bg-secondary)]' : ''
        }`}
      >
        {children}
      </a>
    );
  };

  return (
    <header className="border-b-2 border-[var(--border)] bg-[var(--bg-primary)] sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="font-bold text-xl tracking-wider uppercase">
            <TrophyIcon className="inline w-6 h-6 mr-2" />
          </a>

          <div>
            <div className="hidden md:flex items-center gap-4">
              <nav className="flex items-center gap-4 mr-4">
                <NavLink href="/">HOME</NavLink>
                <NavLink href="/bracket">BRACKET</NavLink>
                <NavLink href="/scorers">TOP SCORERS</NavLink>

                {user?.role === 'federation' && (
                  <NavLink href="/federation/dashboard">MY TEAM</NavLink>
                )}

                <RoleRestricted allowedRoles={['admin']}>
                  <NavLink href="/admin/dashboard">ADMIN</NavLink>
                </RoleRestricted>
              </nav>

              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1 border-2 border-[var(--border)] hover:bg-[var(--bg-secondary)]"
                  >
                    <User className="w-4 h-4" />
                    <span className="font-bold uppercase text-xs">{user.username}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-[var(--bg-primary)] border-2 border-[var(--border)] shadow-lg">
                      <div className="p-4">
                        <div className="text-xs text-[var(--text-secondary)] mb-2">SIGNED IN AS</div>
                        <div className="font-bold text-sm mb-2">{user.email}</div>
                        <div className="text-xs text-[var(--text-secondary)] mb-1">ROLE</div>
                        <div className="font-bold text-sm mb-4 uppercase">{user.role}</div>
                        <button
                          onClick={handleSignOut}
                          className="btn w-full flex items-center justify-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          LOGOUT
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <a href="/auth" className="btn btn-primary">
                  LOGIN
                </a>
              )}

              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-[var(--bg-secondary)]"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="md:hidden p-2 hover:bg-[var(--bg-secondary)]"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {menuOpen && (
            <div className="md:hidden absolute top-24 right-6 border-2 border-[var(--border)] py-4 space-y-2 bg-[var(--bg-primary)] w-[calc(100%-3rem)]">
              <MobileNavLink href="/">HOME</MobileNavLink>
              <MobileNavLink href="/bracket">BRACKET</MobileNavLink>
              <MobileNavLink href="/scorers">TOP SCORERS</MobileNavLink>

              {user?.role === 'federation' && (
                <MobileNavLink href="/federation/dashboard">MY TEAM</MobileNavLink>
              )}

              <RoleRestricted allowedRoles={['admin']}>
                <MobileNavLink href="/admin/dashboard">ADMIN</MobileNavLink>
              </RoleRestricted>

              <div className="px-4 pt-4 border-t-2 border-[var(--border)] space-y-2">
                {user ? (
                  <>
                    <div className="font-bold uppercase text-xs border-2 border-[var(--border)] px-3 py-2">
                      <div className="text-xs text-[var(--text-secondary)] mb-2">SIGNED IN AS</div>
                      <div className="font-bold text-sm mb-2">{user.email}</div>
                      <div className="text-xs text-[var(--text-secondary)] mb-1">ROLE</div>
                      <div className="font-bold text-sm mb-4 uppercase">{user.role}</div>
                    </div>
                    <button onClick={handleSignOut} className="btn w-full flex items-center justify-center gap-2">
                      <LogOut className="w-4 h-4" />
                      LOGOUT
                    </button>
                  </>
                ) : (
                  <a href="/auth" className="btn btn-primary w-full block text-center">
                    LOGIN
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};