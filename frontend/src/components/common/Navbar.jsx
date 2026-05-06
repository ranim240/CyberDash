import { useLocation, Link } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';

export default function Navbar() {
  const location = useLocation();
  const { toggleSidebar } = useSidebar();
  const isLoggedIn = !!localStorage.getItem('token');

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/challenges', label: 'Challenges' },
    { path: '/leaderboard', label: 'Leaderboard' },
    { path: '/courses', label: 'Courses' },
    { path: '/about', label: 'About' },
  ];

  return (
    <>
      <style>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 5%;
          height: 200px !important;
          border-bottom: 1px solid var(--border);
          background: rgba(5, 7, 15, 0.9);
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            min-height: 90px;
  max-height: 90px;
          
        }

        .navbar-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .hamburger-btn {
          background: none;
          border: none;
          font-size: 22px;
          cursor: pointer;
          color: var(--muted);
          padding: 4px 8px;
          border-radius: 6px;
          transition: color 0.2s;
          line-height: 1;
          display: flex;
          align-items: center;
        }
        .hamburger-btn:hover { color: var(--text); }

        .nav-logo { display: flex; align-items: center; gap: 12px; text-decoration: none; }
        .nav-logo-hex {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: #fff;
          font-weight: 700;
        }
        .nav-logo-txt {
          font-family: var(--head);
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 3px;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .nav-center { display: flex; gap: 48px; }

        .nav-link {
          font-family: var(--mono);
          font-size: 15px;
          letter-spacing: 2px;
          color: var(--muted);
          transition: color 0.2s;
          text-transform: uppercase;
          font-weight: 700;
          text-decoration: none;
        }
        .nav-link:hover { color: var(--accent); }
        .nav-link.active { color: var(--accent); }

        .nav-right { display: flex; gap: 24px; align-items: center; }
        .nav-end { width: 40px; }

        .btn-ghost {
          font-family: var(--mono);
          font-size: 15px;
          color: var(--muted);
          letter-spacing: 2px;
          transition: color 0.2s;
          font-weight: 700;
          text-transform: uppercase;
          text-decoration: none;
        }
        .btn-ghost:hover { color: #fff; }

        .btn-pri {
          background: linear-gradient(135deg, var(--accent), #7c3aed);
          color: #fff;
          font-family: var(--head);
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 2px;
          padding: 14px 28px;
          border-radius: 4px;
          transition: box-shadow 0.2s;
          text-transform: uppercase;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .btn-pri:hover { box-shadow: 0 0 24px rgba(176, 110, 255, 0.45); }

        @media (max-width: 1024px) { .nav-center { display: none; } }
        @media (max-width: 768px) {
          .navbar { padding: 0 20px; height: 70px; }
          .nav-logo-txt { font-size: 18px; }
        }
      `}</style>

      <div className="navbar">
        {/* LEFT: hamburger (logged in) + logo */}
        <div className="navbar-left">
          {isLoggedIn && (
            <button className="hamburger-btn" onClick={toggleSidebar} aria-label="Toggle menu">
              ☰
            </button>
          )}
          <Link to="/" className="nav-logo">
            <div className="nav-logo-hex">◈</div>
            <span className="nav-logo-txt">CyberDash</span>
          </Link>
        </div>

        {/* CENTER: nav links */}
        <div className="nav-center">
          {navLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`nav-link ${isActive(path) ? 'active' : ''}`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* RIGHT: auth or spacer */}
        {isLoggedIn ? (
          <div className="nav-end" />
        ) : (
          <div className="nav-right">
            <Link to="/login" className="btn-ghost">Login</Link>
            <Link to="/register" className="btn-pri">Get Started →</Link>
          </div>
        )}
      </div>
    </>
  );
}