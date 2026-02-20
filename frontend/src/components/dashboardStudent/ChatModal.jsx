// ChatModal.jsx
import { useState, useEffect, useRef } from 'react';

const BASE_URL = 'http://localhost:5000/api';

function ChatModal({ onClose, cvData, initialMessages }) {
  const [messages, setMessages] = useState(
    initialMessages || [
      {
        role: 'assistant',
        content: cvData?.score
          ? `Hi ${cvData.filename ? '! I can see your CV **' + cvData.filename + '**' : ''}! 🎓 Your CV score is **${cvData.score}/100** and I found these skills: ${cvData.skills?.join(', ')}. I'm ready to help you improve your profile and find the perfect internship. What would you like to know?`
          : "Hi! I'm your AI Career Coach. Upload your CV first so I can give you personalized advice! How can I help you today? 🎓"
      }
    ]
  );
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${BASE_URL}/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: input,
          history: messages,
          cvData: cvData || null  // envoie les données du CV au backend
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error');

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.reply
      }]);

    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Sorry, something went wrong. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-modal">

      {/* HEADER */}
      <div className="chat-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>🤖</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px' }}>AI Career Coach</h3>
            {cvData?.score ? (
              <p style={{ margin: 0, fontSize: '11px', color: '#10b981' }}>
                ● CV Score: {cvData.score}/100
              </p>
            ) : (
              <p style={{ margin: 0, fontSize: '11px', color: '#10b981' }}>
                ● Powered by Groq AI
              </p>
            )}
          </div>
        </div>
        <button className="chat-close" onClick={onClose}>×</button>
      </div>

      {/* MESSAGES */}
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.role}`}>
            <div className="message-avatar">
              {msg.role === 'user' ? '👤' : '🤖'}
            </div>
            <div className="message-content">
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="chat-message assistant">
            <div className="message-avatar">🤖</div>
            <div className="message-content typing">
              <span>●</span><span>●</span><span>●</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="chat-input-area">
        <input
          type="text"
          placeholder={cvData?.score
            ? "Ask about your CV score, advice, or career..."
            : "Ask me about your career..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
        >
          {loading ? '⏳' : 'Send'}
        </button>
      </div>

    </div>
  );
}

export default ChatModal;