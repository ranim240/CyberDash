import { useNavigate } from 'react-router-dom';

export default function Topbar() {
  const navigate = useNavigate();

  return (
    <div className="topbar">
      <div>
        <h2>Instructor Dashboard</h2>
        
      </div>

      <div style={{ display: 'flex', gap: '16px' }}>
  <button className="btn btn-purple" onClick={() => navigate('/instructor/challenges/create')}>
    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>+</span> Challenge
  </button>
  <button className="btn btn-teal" onClick={() => navigate('/instructor/courses/create')}>
    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>+</span> Course
  </button>
</div>
    </div>
  );
}