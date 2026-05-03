import { useState, useRef, useEffect } from 'react';
import api from '../../api/axios';

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your AI assistant. Ask me anything about cybersecurity, courses, or your learning path.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.post('/ai/chat', { message: userMessage.content });
      const assistantMessage = { role: 'assistant', content: response.data?.reply || 'Sorry, I could not process that.' };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('AI chat error', err);
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Failed to get response. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="chat-bubble"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        <span className="chat-icon">{isOpen ? '✕' : '💬'}</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div>
              <div className="chat-title">AI Assistant</div>
              <div className="chat-subtitle">⚡ Powered by LLM</div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="chat-close-btn"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`message-wrapper ${msg.role}`}
              >
                <div className={`message-bubble ${msg.role}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="message-wrapper assistant">
                <div className="message-bubble assistant">
                  <span className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="chat-input-area">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask me anything..."
              className="chat-input"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="chat-send-btn"
            >
              {loading ? '...' : 'Send'}
            </button>
          </div>
        </div>
      )}

      {/* Styles */}
      <style>{`
        /* Floating Chat Bubble */
        .chat-bubble {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b5cf6, #5b21b6);
          border: none;
          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1100;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .chat-bubble:hover {
          transform: scale(1.1);
          box-shadow: 0 8px 30px rgba(139, 92, 246, 0.5);
        }

        .chat-bubble:active {
          transform: scale(0.95);
        }

        .chat-icon {
          font-size: 28px;
          line-height: 1;
          transition: transform 0.3s ease;
        }

        /* Chat Window */
        .chat-window {
          position: fixed;
          bottom: 100px;
          right: 24px;
          width: 400px;
          max-width: calc(100vw - 48px);
          height: 600px;
          max-height: calc(100vh - 140px);
          background: var(--bg2, #1e1e2f);
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          border: 1px solid var(--border, #2d2d3a);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          z-index: 1050;
          animation: slideInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Header */
        .chat-header {
          padding: 20px;
          border-bottom: 1px solid var(--border, #2d2d3a);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), transparent);
        }

        .chat-title {
          font-weight: 600;
          font-size: 1.1rem;
          color: var(--text, #e4e4e7);
        }

        .chat-subtitle {
          font-size: 0.7rem;
          color: var(--muted2, #a1a1aa);
          margin-top: 2px;
        }

        .chat-close-btn {
          background: transparent;
          border: none;
          color: var(--muted2, #a1a1aa);
          font-size: 24px;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s;
          line-height: 1;
        }

        .chat-close-btn:hover {
          background: var(--bg3, #2a2a35);
          color: var(--text, #e4e4e7);
        }

        /* Messages */
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: var(--bg1, #12121a);
        }

        .chat-messages::-webkit-scrollbar {
          width: 6px;
        }

        .chat-messages::-webkit-scrollbar-track {
          background: transparent;
        }

        .chat-messages::-webkit-scrollbar-thumb {
          background: var(--border, #2d2d3a);
          border-radius: 3px;
        }

        .message-wrapper {
          display: flex;
        }

        .message-wrapper.user {
          justify-content: flex-end;
        }

        .message-wrapper.assistant {
          justify-content: flex-start;
        }

        .message-bubble {
          max-width: 80%;
          padding: 12px 16px;
          border-radius: 18px;
          font-size: 14px;
          line-height: 1.5;
          word-break: break-word;
          animation: messageIn 0.3s ease;
        }

        @keyframes messageIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message-bubble.user {
          background: linear-gradient(135deg, #8b5cf6, #5b21b6);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .message-bubble.assistant {
          background: var(--bg3, #2a2a35);
          color: var(--text, #e4e4e7);
          border: 1px solid var(--border, #2d2d3a);
          border-bottom-left-radius: 4px;
        }

        /* Typing Indicator */
        .typing-indicator {
          display: inline-flex;
          gap: 4px;
          align-items: center;
        }

        .typing-indicator span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--muted2, #a1a1aa);
          animation: typing 1.4s infinite;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% {
            opacity: 0.3;
            transform: translateY(0);
          }
          30% {
            opacity: 1;
            transform: translateY(-8px);
          }
        }

        /* Input Area */
        .chat-input-area {
          padding: 16px 20px;
          border-top: 1px solid var(--border, #2d2d3a);
          background: var(--bg2, #1e1e2f);
          display: flex;
          gap: 12px;
          align-items: flex-end;
        }

        .chat-input {
          flex: 1;
          background: var(--bg3, #2a2a35);
          border: 1px solid var(--border, #2d2d3a);
          border-radius: 20px;
          padding: 12px 16px;
          color: var(--text, #e4e4e7);
          font-family: inherit;
          font-size: 14px;
          resize: none;
          outline: none;
          transition: border-color 0.2s;
        }

        .chat-input:focus {
          border-color: #8b5cf6;
        }

        .chat-input::placeholder {
          color: var(--muted2, #a1a1aa);
        }

        .chat-send-btn {
          padding: 10px 24px;
          height: 44px;
          border-radius: 22px;
          font-weight: 500;
          background: linear-gradient(135deg, #8b5cf6, #5b21b6);
          border: none;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .chat-send-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
        }

        .chat-send-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .chat-send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Mobile Responsive */
        @media (max-width: 480px) {
          .chat-window {
            right: 12px;
            bottom: 90px;
            width: calc(100vw - 24px);
            height: calc(100vh - 120px);
          }

          .chat-bubble {
            right: 12px;
            bottom: 12px;
          }
        }
      `}</style>
    </>
  );
}