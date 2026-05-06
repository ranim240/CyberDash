
import { useNavigate, useLocation } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';
import { useInstructor } from '../../hooks/useInstructor'; // adjust path


export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const { profile } = useInstructor(); // returns profile if instructor is logged in

  const isActive = (path) => location.pathname === path;

  const handleNavClick = (path) => {
    navigate(path);
    closeSidebar();
  };

  const handleLogout = () => {
    // Replace with your logout logic
    navigate('/login');
    closeSidebar();
  };

  // If profile exists, user is instructor – show instructor menu
  const isInstructor = !!profile;

  // Instructor menu (for instructor dashboard)
  const instructorMenu = [
    { path: '/instructor/dashboard', label: 'Dashboard', icon: '⬡' },
    { path: '/instructor/courses', label: 'My Courses', icon: '📚' },
    { path: '/instructor/challenges', label: 'My Challenges', icon: '🚩' },
  ];

  // Learner menu (for learner pages)
  const learnerMenu = [
    { path: '/courses', label: 'My Courses', icon: '📚' },
    { path: '/challenges', label: 'Challenges', icon: '🚩' },
    { path: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
  ];

  const menu = isInstructor ? instructorMenu : learnerMenu;

  const commonMenu = [
    { path: '/profile', label: 'Profile', icon: '👤' },
    { path: '/settings', label: 'Settings', icon: '⚙' },
  ];

  const username = profile?.username || 'User';
  const avatarInitial = username?.charAt(0).toUpperCase() || 'U';
  const roleLabel = isInstructor ? 'Instructor' : 'Learner';

  return (
    <>
      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}
      <aside className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="logo-wrap">
          <div className="logo-hex">◈</div>
          <span className="logo-txt">CYBER</span>
        </div>

        <nav className="nav-sect">
          {menu.map(({ path, label, icon }) => (
            <div
              key={path}
              className={`nav-item ${isActive(path) ? 'active' : ''}`}
              onClick={() => handleNavClick(path)}
            >
              <span className="nav-ico">{icon}</span> {label}
            </div>
          ))}
        </nav>

        <nav className="nav-sect" style={{ marginTop: 'auto', marginBottom: '20px' }}>
          {commonMenu.map(({ path, label, icon }) => (
            <div
              key={path}
              className="nav-item"
              onClick={() => handleNavClick(path)}
            >
              <span className="nav-ico">{icon}</span> {label}
            </div>
          ))}
          <div className="nav-item" onClick={handleLogout} style={{ color: 'var(--danger)' }}>
            <span className="nav-ico">↩</span> Logout
          </div>
        </nav>

        {/* User info footer */}
        <div className="sb-footer">
          <div className="user-wrap">
            <div className="av">{avatarInitial}</div>
            <div>
              <div className="u-name">{username}</div>
              <div className="u-role">● {roleLabel}</div>
            </div>
          </div>
        </div>
      </aside>

<style>{`
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 250px;
    background: var(--bg2);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    z-index: 1000;
    transform: translateX(-100%);
    transition: transform 0.25s ease-in-out;
  }
  
  .sidebar.sidebar-open {
    transform: translateX(0);
  }
  
  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 999;
    animation: fadeIn 0.2s ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .logo-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 20px 16px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 24px;
  }
  
  .logo-hex {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: white;
    font-weight: bold;
  }
  
  .logo-txt {
    font-weight: 700;
    font-size: 18px;
    font-family: var(--head);
    letter-spacing: 2px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .nav-sect {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 0 12px;
  }
  
  .nav-sect:first-of-type {
    margin-bottom: 24px;
  }
  
  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    color: var(--text);
    transition: all 0.2s;
  }
  
  .nav-item:hover {
    background: rgba(176, 110, 255, 0.08);
    color: var(--accent);
  }
  
  .nav-item.active {
    background: rgba(176, 110, 255, 0.12);
    color: var(--accent);
    font-weight: 600;
  }
  
  .nav-ico {
    font-size: 18px;
    width: 24px;
    text-align: center;
    opacity: 0.8;
  }
  
  .sb-footer {
    padding: 16px 16px 20px;
    border-top: 1px solid var(--border);
    margin-top: auto;
  }
  
  .user-wrap {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .av {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 14px;
    color: white;
  }
  
  .u-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 2px;
    line-height: 1.4;
  }
  
  .u-role {
    font-size: 11px;
    color: var(--muted);
    font-family: var(--mono);
    letter-spacing: 0.3px;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  /* Scrollbar */
  .sidebar::-webkit-scrollbar {
    width: 3px;
  }
  
  .sidebar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .sidebar::-webkit-scrollbar-thumb {
    background: var(--accent);
    border-radius: 3px;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .sidebar {
      width: 100%;
      max-width: 280px;
    }
    
    .logo-wrap {
      padding: 16px;
    }
    
    .logo-txt {
      font-size: 16px;
    }
    
    .nav-item {
      padding: 10px 12px;
      font-size: 14px;
    }
  }
`}</style>
    </>
  );
}
