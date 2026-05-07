"""
Feature engineering — extracts the 11 ML features per (learner, challenge) pair.
"""
import pandas as pd

def build_features(learner_data: dict, challenge: dict) -> dict:
    """
    Builds the feature vector from learner stats and challenge info.
    
    Features:
      1. success_rate         — overall success ratio
      2. avg_attempts         — average attempts per challenge
      3. avg_time_seconds     — average time per attempt
      4. hint_usage_rate      — % of attempts where hint was used
      5. course_read_rate     — % of related courses read
      6. abandon_rate         — % of challenges abandoned
      7. skill_score          — learner's score for this challenge's primary skill
      8. skill_confidence     — confidence in that skill score
      9. challenge_difficulty — numeric: beginner=1, intermediate=2, advanced=3
      10. challenge_points    — point value of the challenge
      11. xp_level            — learner's current level
    """
    diff_map = {'beginner': 1, 'intermediate': 2, 'advanced': 3}

    return {
        'success_rate': learner_data.get('success_rate', 0.0),
        'avg_attempts': learner_data.get('avg_attempts', 1.0),
        'avg_time_seconds': learner_data.get('avg_time_seconds', 300),
        'hint_usage_rate': learner_data.get('hint_usage_rate', 0.0),
        'course_read_rate': learner_data.get('course_read_rate', 0.0),
        'abandon_rate': learner_data.get('abandon_rate', 0.0),
        'skill_score': learner_data.get('skill_score', 0.0),
        'skill_confidence': learner_data.get('skill_confidence', 0.0),
        'challenge_difficulty': diff_map.get(challenge.get('difficulty', 'beginner'), 1),
        'challenge_points': challenge.get('points', 50),
        'xp_level': learner_data.get('xp_level', 1),
    }


def features_to_dataframe(features: dict) -> pd.DataFrame:
    """Convert a feature dict to a single-row DataFrame for prediction."""
    return pd.DataFrame([features])
