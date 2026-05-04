import { useNavigate, useLocation } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';


export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleSidebar } = useSidebar();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/challenges', label: 'Challenges', icon: '🚩' },
    { path: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
    { path: '/courses', label: 'Courses', icon: '📚' },
  ];

  return (
    <>
      <style>{`
        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 24px;
          background: var(--bg2);
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .hamburger-btn {
          background: none;
          border: none;
          font-size: 26px;
          cursor: pointer;
          color: var(--text);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
        }
        .nav-logo {
          font-weight: bold;
          font-size: 22px;
          font-family: var(--mono);
          color: var(--accent);
          letter-spacing: 1px;
        }
        .nav-links {
          display: flex;
          gap: 8px;
          background: var(--bg3);
          padding: 4px;
          border-radius: 40px;
        }
        .nav-link {
          background: transparent;
          border: none;
          padding: 8px 20px;
          border-radius: 32px;
          font-family: var(--body);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          color: var(--muted2);
          transition: all 0.2s;
        }
        .nav-link.active {
          background: var(--accent);
          color: white;
        }
        .nav-link:hover:not(.active) {
          background: var(--bg2);
          color: var(--text);
        }
        .nav-end {
          width: 40px;
        }
        @media (max-width: 768px) {
          .nav-link {
            padding: 6px 12px;
            font-size: 12px;
          }
          .nav-logo {
            font-size: 18px;
          }
        }
      `}</style>

      <div className="navbar">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button className="hamburger-btn" onClick={toggleSidebar} aria-label="Menu">
            ☰
          </button>
          <div className="nav-logo">CYBER</div>
        </div>

        <div className="nav-links">
          {navLinks.map(({ path, label, icon }) => (
            <button
              key={path}
              className={`nav-link ${isActive(path) ? 'active' : ''}`}
              onClick={() => navigate(path)}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        <div className="nav-end" />
      </div>
    </>
  );
}
