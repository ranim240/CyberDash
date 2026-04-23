import { useNavigate } from "react-router-dom";

const colors = {
  easy: "#22c55e",
  medium: "#f59e0b",
  hard: "#ef4444",b
};

const ChallengeCard = ({ challenge }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() =>
        navigate(`/learner/challenges/${challenge.challenge_id}`)
      }
      style={{
        background: "linear-gradient(145deg, #0f172a, #020617)",
        border: "1px solid #1e293b",
        borderRadius: "18px",
        padding: "18px",
        cursor: "pointer",
        color: "white",
        transition: "0.25s",
        boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0px)";
      }}
    >
      {/* Title */}
      <h3 style={{ margin: 0 }}>{challenge.title}</h3>

      {/* Description */}
      <p style={{ color: "#94a3b8", fontSize: "14px" }}>
        {challenge.description?.slice(0, 100)}...
      </p>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "12px",
          fontSize: "13px",
        }}
      >
        <span
          style={{
            color: colors[challenge.difficulty],
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        >
          {challenge.difficulty}
        </span>

        <span>🎯 {challenge.points} XP</span>
      </div>
    </div>
  );
};

export default ChallengeCard;