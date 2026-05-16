'use client';

import { useState } from 'react';

export default function Home() {
  const [mode, setMode] = useState('llm');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Pick a mode, then ask a question.' }
  ]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
    const nextMessages = [...messages, userMsg];

    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`/api/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();

      setMessages([
        ...nextMessages,
        { role: 'assistant', content: data.reply || data.error || 'No response' }
      ]);
    } catch {
      setMessages([
        ...nextMessages,
        { role: 'assistant', content: 'Request failed.' }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1 style={{ marginBottom: 16 }}>OpenAI AI Demo</h1>

      <div style={{ marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
        <label htmlFor="mode">Mode:</label>
        <select id="mode" value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="llm">LLM</option>
          <option value="rag">RAG</option>
          <option value="agent">Agent</option>
        </select>
      </div>

      <div style={{
        background: 'white',
        border: '1px solid #ddd',
        borderRadius: 12,
        padding: 16,
        minHeight: 400,
        marginBottom: 16
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <strong style={{ textTransform: 'capitalize' }}>{m.role}:</strong> {m.content}
          </div>
        ))}
        {loading && <div><strong>assistant:</strong> typing...</div>}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 8,
            border: '1px solid #ccc'
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: '12px 18px',
            borderRadius: 8,
            border: 'none',
            background: '#111827',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </div>
    </main>
  );
}