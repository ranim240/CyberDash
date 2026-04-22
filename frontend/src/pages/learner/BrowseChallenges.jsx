import { useEffect, useState } from "react";
import { getChallenges } from "../../api/challenges";
import ChallengeCard from "../../components/learner/ChallengeCard";

const BrowseChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getChallenges();
        setChallenges(res.data.data || res.data);
      } catch (err) {
        console.error("Failed to load challenges", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          padding: "40px",
          color: "white",
        }}
      >
        Loading challenges...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        padding: "30px",
        color: "white",
      }}
    >
      {/* Header */}
      <h1 style={{ marginBottom: "20px" }}>
        🔥 Browse Challenges
      </h1>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "18px",
        }}
      >
        {challenges.map((ch) => (
          <ChallengeCard key={ch.challenge_id} challenge={ch} />
        ))}
      </div>
    </div>
  );
};

export default BrowseChallenges;