import Sidebar from '../../components/common/Sidebar.jsx';
import Topbar from './instructorTopBar.jsx';
import StatsGrid from '../../components/StatsGrid.jsx';
import CoursesTable from '../../components/CoursesTable.jsx';
import ChallengesTable from '../../components/ChallengesTable.jsx';


import './InstructorDashboard.css';
import '../../styles/dashboard.css';
import Navbar from '../../components/common/Navbar.jsx';

export default function InstructorDashboard() {
  return (
    <>
    <Navbar />
    <div className="layout">
      
      
    <Sidebar />
      <div className="main">
        <Topbar />

        <StatsGrid />

        <div className="grid2">
          <CoursesTable />
          <ChallengesTable />
        </div>
     
        
      </div>
    </div>
    </>
  );
}