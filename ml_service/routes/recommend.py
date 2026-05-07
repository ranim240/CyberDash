"""
Recommendation route — called by Express backend.
POST /api/recommend  { learner_id }
Returns top 3 challenges in the "flow zone" (50-85% predicted success).
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import psycopg2
import psycopg2.extras
from config import DATABASE_URL
from services.feature_engineering import build_features, features_to_dataframe
from services.prediction import predict_success_probability

router = APIRouter()

class RecommendRequest(BaseModel):
    learner_id: str

def get_db_connection():
    return psycopg2.connect(DATABASE_URL, cursor_factory=psycopg2.extras.RealDictCursor)

def fetch_learner_stats(conn, learner_id: str) -> dict:
    """Aggregate learner behavioral stats from the database."""
    cur = conn.cursor()

    # Basic learner info
    cur.execute("SELECT xp_points, current_level FROM learner WHERE user_id = %s", (learner_id,))
    learner = cur.fetchone()
    if not learner:
        raise HTTPException(status_code=404, detail="Learner not found")

    # Success rate
    cur.execute("""
        SELECT COUNT(*) FILTER (WHERE s.is_correct) AS wins, COUNT(*) AS total
        FROM submission s
        JOIN challenge_session cs ON cs.session_id = s.session_id
        WHERE cs.learner_id = %s
    """, (learner_id,))
    sub = cur.fetchone()
    success_rate = sub['wins'] / max(sub['total'], 1)

    # Average attempts
    cur.execute("""
        SELECT AVG(attempt_count) AS avg_att
        FROM challenge_session WHERE learner_id = %s AND attempt_count > 0
    """, (learner_id,))
    avg_att = cur.fetchone()['avg_att'] or 1.0

    # Average time
    cur.execute("""
        SELECT AVG(time_spent_seconds) AS avg_time
        FROM challenge_attempt_metrics cam
        JOIN submission s ON s.submission_id = cam.submission_id
        JOIN challenge_session cs ON cs.session_id = s.session_id
        WHERE cs.learner_id = %s
    """, (learner_id,))
    avg_time = cur.fetchone()['avg_time'] or 300

    # Hint usage rate
    cur.execute("""
        SELECT COUNT(*) FILTER (WHERE cam.hint_used) AS hints, COUNT(*) AS total
        FROM challenge_attempt_metrics cam
        JOIN submission s ON s.submission_id = cam.submission_id
        JOIN challenge_session cs ON cs.session_id = s.session_id
        WHERE cs.learner_id = %s
    """, (learner_id,))
    hint = cur.fetchone()
    hint_rate = hint['hints'] / max(hint['total'], 1)

    # Course read rate
    cur.execute("""
        SELECT COUNT(*) FROM learner_activity_log
        WHERE user_id = %s AND action_type = 'read_course'
    """, (learner_id,))
    reads = cur.fetchone()['count']
    cur.execute("SELECT COUNT(*) FROM course WHERE is_published = true")
    total_courses = cur.fetchone()['count']
    course_rate = reads / max(total_courses, 1)

    # Abandon rate
    cur.execute("""
        SELECT COUNT(*) FILTER (WHERE action_type = 'abandon_challenge') AS abandons,
               COUNT(*) FILTER (WHERE action_type = 'start_challenge') AS starts
        FROM learner_activity_log WHERE user_id = %s
    """, (learner_id,))
    ab = cur.fetchone()
    abandon_rate = ab['abandons'] / max(ab['starts'], 1)

    return {
        'success_rate': float(success_rate),
        'avg_attempts': float(avg_att),
        'avg_time_seconds': float(avg_time),
        'hint_usage_rate': float(hint_rate),
        'course_read_rate': min(float(course_rate), 1.0),
        'abandon_rate': float(abandon_rate),
        'xp_level': learner['current_level'],
    }

def fetch_skill_for_challenge(conn, learner_id: str, challenge_id: str) -> dict:
    """Get the learner's skill score for a challenge's primary skill."""
    cur = conn.cursor()
    cur.execute("""
        SELECT sp.score, sp.confidence
        FROM skill_profile sp
        JOIN challenge_skill cs ON cs.skill_id = sp.skill_id
        WHERE sp.learner_id = %s AND cs.challenge_id = %s
        ORDER BY cs.weight DESC LIMIT 1
    """, (learner_id, challenge_id))
    row = cur.fetchone()
    return {'skill_score': row['score'] if row else 0.0, 'skill_confidence': row['confidence'] if row else 0.0}

@router.post("/recommend")
def recommend(req: RecommendRequest):
    conn = get_db_connection()
    try:
        learner_stats = fetch_learner_stats(conn, req.learner_id)
        cur = conn.cursor()

        # Get challenges the learner hasn't solved yet
        cur.execute("""
            SELECT c.challenge_id, c.title, c.difficulty, c.points, c.category_id
            FROM challenge c
            WHERE c.status = 'active'
            AND c.challenge_id NOT IN (
                SELECT cs.challenge_id FROM challenge_session cs
                JOIN submission s ON s.session_id = cs.session_id
                WHERE cs.learner_id = %s AND s.is_correct = true
            )
        """, (req.learner_id,))
        unsolved = cur.fetchall()

        # Score each challenge
        scored = []
        for ch in unsolved:
            skill_data = fetch_skill_for_challenge(conn, req.learner_id, ch['challenge_id'])
            combined = {**learner_stats, **skill_data}
            features = build_features(combined, ch)
            df = features_to_dataframe(features)
            proba = predict_success_probability(df)

            # Flow zone: 50-85% success probability
            if 0.50 <= proba <= 0.85:
                scored.append({
                    'challenge_id': ch['challenge_id'],
                    'title': ch['title'],
                    'difficulty': ch['difficulty'],
                    'points': ch['points'],
                    'predicted_success': round(proba, 3),
                })

        # Sort by proximity to 0.65 (sweet spot) and return top 3
        scored.sort(key=lambda x: abs(x['predicted_success'] - 0.65))
        return {"recommendations": scored[:3]}
    finally:
        conn.close()
