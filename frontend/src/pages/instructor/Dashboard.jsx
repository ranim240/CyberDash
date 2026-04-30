import Sidebar from '../../components/common/Sidebar.jsx';
import Topbar from '../../components/common/Navbar.jsx';
import StatsGrid from '../../components/StatsGrid.jsx';
import CoursesTable from '../../components/CoursesTable.jsx';
import ChallengesTable from '../../components/ChallengesTable.jsx';
import Analytics from '../../components/Analytics.jsx';
import AIChat from '../../components/ai/AIChat';

import './InstructorDashboard.css';
import '../../styles/dashboard.css';

export default function InstructorDashboard() {
  return (
    <div className="layout">
      <Sidebar />

      <div className="main">
        <Topbar />

        <StatsGrid />

        <div className="grid2">
          <CoursesTable />
          <ChallengesTable />
        </div>
     <AIChat />
        
      </div>
    </div>
  );
}