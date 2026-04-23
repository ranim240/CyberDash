import { useNavigate } from "react-router-dom";

export default function Sidebar({ onNav}) {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      {/* SIDEBAR */}

      <div className="logo-wrap">
        <div className="logo-hex">◈</div>
        <span className="logo-txt">CYBER</span>
      </div>

      <nav className="nav-sect">
        <div className="nav-item active">
          <span className="nav-ico">⬡</span> Dashboard
        </div>

        <div className="nav-item" onClick={() => navigate('/instructor/courses')}>
          <span className="nav-ico">📚</span> My Courses
        </div>

        <div className="nav-item" onClick={() => onNav?.("challenges")}>
          <span className="nav-ico">🚩</span> My Challenges
        </div>
       </nav>
    


      <nav className="nav-sect" style={{ marginTop: 12 }}>
        <div className="nav-item" onClick={() => onNav?.("profile")}>
          <span className="nav-ico">👤</span> Profil
        </div>

        <div className="nav-item" onClick={() => navigate("/settings")}>
          <span className="nav-ico">⚙</span> Paramètres
        </div>

        <div
          className="nav-item"
          style={{ color: "var(--danger)" }}
          onClick={() => navigate("/logout")}
        >
          <span className="nav-ico">↩</span> Déconnexion
        </div>
      </nav>

      <div className="sb-footer">
        <div className="user-wrap">
          <div className="av">AX</div>
          <div>
            <div className="u-name">Instructor-Name</div>
            <div className="u-role">
              ● Instructor
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}