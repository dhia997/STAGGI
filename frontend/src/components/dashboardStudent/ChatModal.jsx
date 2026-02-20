// ChatModal.jsx
import { useState, useEffect, useRef } from 'react';

const BASE_URL = 'http://localhost:5000/api';

function ChatModal({ onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your AI Career Coach powered by Gemini. I can help you improve your CV, prepare for interviews, and find the best internships. How can I help you today? 🎓"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Pour auto-scroll vers le dernier message
  const messagesEndRef = useRef(null);

  // Auto-scroll chaque fois qu'un nouveau message arrive
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

      // Envoie le message au backend → backend appelle Gemini
      const res = await fetch(`${BASE_URL}/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: input,
          // Envoie tout l'historique pour que Gemini ait le contexte
          history: messages.map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Error');

      // Ajoute la réponse Gemini
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
            <p style={{ margin: 0, fontSize: '11px', color: '#10b981' }}>● Powered by Gemini</p>
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

        {/* Typing indicator pendant que Gemini répond */}
        {loading && (
          <div className="chat-message assistant">
            <div className="message-avatar">🤖</div>
            <div className="message-content typing">
              <span>●</span><span>●</span><span>●</span>
            </div>
          </div>
        )}

        {/* Anchor pour le scroll automatique */}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="chat-input-area">
        <input
          type="text"
          placeholder="Ask me about your CV or career..."
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