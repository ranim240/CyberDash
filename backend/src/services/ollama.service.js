/**
 * ollama.service.js — Centralized service for Ollama/Mistral API calls
 * Used by both the chat module and the submission feedback system.
 */
import axios from 'axios';

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const MODEL = process.env.OLLAMA_MODEL || 'mistral';

/**
 * Simple prompt → response (for auto-feedback on wrong submissions)
 */
export const generateResponse = async (prompt) => {
  try {
    const res = await axios.post(`${OLLAMA_URL}/api/generate`, {
      model: MODEL, prompt, stream: false,
    });
    return res.data.response;
  } catch (err) {
    console.error('Ollama generate error:', err.message);
    return null;
  }
};

/**
 * Conversational chat (for the interactive chatbot)
 * @param {Array} messages - [{ role: 'system'|'user'|'assistant', content: '...' }]
 */
export const chatCompletion = async (messages) => {
  try {
    const res = await axios.post(`${OLLAMA_URL}/api/chat`, {
      model: MODEL, messages, stream: false,
    });
    return res.data.message.content;
  } catch (err) {
    console.error('Ollama chat error:', err.message);
    return null;
  }
};
