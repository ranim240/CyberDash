import { useCourses } from '../hooks/useCourses';
import {useChallenges } from '../hooks/useChallenge';
export default function StatsGrid() {
  const { courses} = useCourses();
  const {challenges} =useChallenges();
  return (
    <div className="stats-grid">
      <div className="stat-card teal">
        <p>Created Courses</p>
        <h2>{courses.length}</h2>
      </div>

      <div className="stat-card blue">
        <p>Created Challenges</p>
        <h2>{challenges.length}</h2>
      </div>

      <div className="stat-card purple">
        <p>Enrollments</p>
        <h2>342</h2>
      </div>
    </div>
  );
}