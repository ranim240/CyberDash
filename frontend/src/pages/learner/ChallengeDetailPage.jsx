import { useNavigate } from "react-router-dom";

export default function ChallengeCard({ challenge }) {
  const navigate = useNavigate();

  return (
    <div className="border rounded-xl p-4 shadow hover:shadow-lg transition cursor-pointer"
      onClick={() => navigate(`/challenges/${challenge.challenge_id}`)}
    >
      <h2 className="text-lg font-bold">{challenge.title}</h2>

      <p className="text-sm text-gray-600 mt-1">
        {challenge.description}
      </p>

      <div className="flex justify-between mt-3 text-sm">
        <span>🔥 {challenge.points} XP</span>
        <span className="capitalize">{challenge.difficulty}</span>
      </div>
    </div>
  );
}