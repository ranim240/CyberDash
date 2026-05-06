import { useCourses }     from '../hooks/useCourses';
import { useChallenges }  from '../hooks/useChallengesInstructor';
import { useInstructor } from '../hooks/useInstructor';
export default function StatsGrid() {
  const { courses,    loading: loadingCourses    } = useCourses();
  const { challenges, loading: loadingChallenges } = useChallenges();
  const {engagements, loading: loadingEngagements} = useInstructor();
  const published = courses.filter(c => c.is_published).length;
  const active    = challenges.filter(c => c.status === 'active').length;
  
  return (
    <div className="stats-grid"style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 20, marginBottom: 32,
            }}>
      <div className="stat-card teal">
        <div className="stat-label">Created Courses</div>
        <div className="stat-value">{loadingCourses    ? '…' : courses.length}</div>
        <div className="stat-sub">{published} published</div>
      </div>

      <div className="stat-card blue">
        <div className="stat-label">Created Challenges</div>
        <div className="stat-value">{loadingChallenges ? '…' : challenges.length}</div>
        <div className="stat-sub">{active} active</div>
      </div>

      <div className="stat-card purple">
        <div className="stat-label">Engaged learners</div>
        <div className="stat-value">{loadingEngagements ? '…' : engagements}</div>
      
      </div>
    </div>
  );
}