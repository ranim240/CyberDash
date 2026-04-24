import { useNavigate } from 'react-router-dom';

export default function Topbar() {
  const navigate = useNavigate();

  return (
    <div className="topbar">
      <div>
        <h2>Instructor Dashboard</h2>
        <p>// API connected</p>
      </div>

      <div>
        <button className="btn btn-purple">+ Challenge</button>
        <button className="btn btn-teal" onClick={() => navigate('/instructor/courses')}>+ Course</button>
      </div>
    </div>
  );
}