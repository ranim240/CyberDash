
import { useNavigate, useLocation } from "react-router-dom";
import { useInstructor } from "../../hooks/useInstructor";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useInstructor();

  // Determine which nav item is active based on current path
  const isActive = (path) => location.pathname === path;

  const handleNavClick = (path) => {
    navigate(path);
  };

  return (
    <div className="sidebar">
      <div className="logo-wrap">
        <div className="logo-hex">◈</div>
        <span className="logo-txt">CYBER</span>
      </div>

      <nav className="nav-sect">
        <div
          className={`nav-item ${isActive('/instructor/Dashboard') ? 'active' : ''}`}
          onClick={() => handleNavClick('/instructor/Dashboard')}
        >
          <span className="nav-ico">⬡</span> Dashboard
        </div>

        <div
          className={`nav-item ${isActive('/instructor/courses') ? 'active' : ''}`}
          onClick={() => handleNavClick('/instructor/courses')}
        >
          <span className="nav-ico">📚</span> My Courses
        </div>

        <div
          className={`nav-item ${isActive('/instructor/challenges') ? 'active' : ''}`}
          onClick={() => handleNavClick('/instructor/challenges')}
        >
          <span className="nav-ico">🚩</span> My Challenges
        </div>
      </nav>

      <nav className="nav-sect" style={{ marginTop: 12 }}>
        {/* <div className="nav-item" onClick={() => onNav?.("profile")}>
          <span className="nav-ico">👤</span> Profil
        </div> */}

        <div className="nav-item" onClick={() => navigate("/settings")}>
          <span className="nav-ico">⚙</span> Paramètres
        </div>

        <div
          className="nav-item"
          style={{ color: "var(--danger)" }}
          onClick={() => navigate("/login")}
        >
          <span className="nav-ico">↩</span> Déconnexion
        </div>
      </nav>

      <div className="sb-footer">
        <div className="user-wrap">
          <div className="av">AX</div>
          <div>
            <div className="u-name">{profile?.username || 'Instructor'}</div>
            <div className="u-role">● Instructor</div>
          </div>
        </div>
      </div>
    </div>
  );
}
