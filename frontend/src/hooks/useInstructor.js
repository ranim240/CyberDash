import { useState, useEffect } from 'react';
import instructorApi from '../api/instructor.js';
export function useInstructor() {
    
  const [engagements, setEngagements] = useState([]);
  const [profile, setProfile] = useState({
});
  const [loading, setLoading] = useState(true);
  const MOCK_Engagements = 10;
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
  instructorApi.getEngagedlearners()
    .then((res) => {
      const value = res.data?.engaged_learners;

      const numericValue = Number(value);

      if (!isNaN(numericValue)) {
        setEngagements(numericValue);
      } else {
        setEngagements(MOCK_Engagements);
      }
    })
    .catch(() => {
      setEngagements(MOCK_Engagements);
      setUsingMock(true);
    })
    .finally(() => setLoading(false));
  instructorApi.getMyProfile()
    .then((res) => {
      setProfile(res.data);
    })
    .catch(() => {
      setProfile("instructor name");
    });}, []);



  return { engagements,profile, setProfile,setEngagements, loading, usingMock };
}