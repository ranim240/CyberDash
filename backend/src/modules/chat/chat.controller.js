import { v4 as uuid } from 'uuid';
import db from '../../config/db.js';
import * as chatQ from './chat.queries.js';
import { chatCompletion } from '../../services/ollama.service.js';
import { success, error } from '../../utils/response.js';

// ── Start a new chat session ──
export const startSession = async (req, res) => {
  try {
    const learnerId = req.user.userId;
    const { context_type, context_id } = req.body;

    const [session] = await chatQ.createSession({
      session_id: uuid(),
      learner_id: learnerId,
      context_type: context_type || 'general',
      context_id: context_id || null,
    });

    return success(res, session, 201);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

// ── Send a message and get Mistral's response ──
export const sendMessage = async (req, res) => {
  try {
    const { session_id, content } = req.body;
    const learnerId = req.user.userId;

    // 1. Verify session ownership
    const session = await chatQ.getSessionById(session_id);
    if (!session) return error(res, 'Session introuvable', 404);
    if (session.learner_id !== learnerId) return error(res, 'Accès refusé', 403);

    // 2. Save user message
    await chatQ.addMessage({ message_id: uuid(), session_id, sender: 'user', content });

    // 3. Load full history
    const history = await chatQ.getMessagesBySession(session_id);

    // 4. Build system prompt
    let systemPrompt = `You are CyberDash's pedagogical AI assistant, a cybersecurity learning platform.
Rules: NEVER reveal the flag or the direct solution. Be encouraging and concise (3-4 sentences max). Always respond in English. Guide the learner with hints and methodology, not answers.`;

    // 5. Add challenge context if applicable
    if (session.context_type === 'challenge' && session.context_id) {
      const ch = await db('challenge').where({ challenge_id: session.context_id }).first();
      if (ch) {
        systemPrompt += `\nContexte : Challenge "${ch.title}" (${ch.difficulty}). Description : ${ch.description}`;
      }
    }

    // 6. Enrich with skill_profile (XGBoost link)
    const skills = await db('skill_profile')
      .where({ learner_id: learnerId })
      .join('skill', 'skill.skill_id', 'skill_profile.skill_id')
      .select('skill.name', 'skill_profile.score');

    if (skills.length > 0) {
      const weak = skills.filter(s => s.score < 0.4).map(s => s.name);
      const strong = skills.filter(s => s.score > 0.7).map(s => s.name);
      if (weak.length) systemPrompt += `\nLearner's weak skills: ${weak.join(', ')}`;
      if (strong.length) systemPrompt += `\nLearner's strong skills: ${strong.join(', ')}`;
    }

    // 7. Format messages for Ollama
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.content })),
    ];

    // 8. Call Mistral
    const aiResponse = await chatCompletion(messages);
    const reply = aiResponse || 'L\'assistant est temporairement indisponible.';

    // 9. Save assistant response
    await chatQ.addMessage({ message_id: uuid(), session_id, sender: 'assistant', content: reply });

    return success(res, { message: reply });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

// ── Get chat history ──
export const getHistory = async (req, res) => {
  try {
    const messages = await chatQ.getMessagesBySession(req.params.sessionId);
    return success(res, messages);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

// ── List learner's sessions ──
export const getSessions = async (req, res) => {
  try {
    const sessions = await chatQ.getSessionsByLearner(req.user.userId);
    return success(res, sessions);
  } catch (err) {
    return error(res, err.message, 500);
  }
};
