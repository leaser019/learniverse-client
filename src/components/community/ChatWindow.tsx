'use client'
import { useEffect, useRef, useState } from 'react';

export default function ChatWindow({ messages, onSend, selected, users }: any) {
  console.log(users);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  const handleSend = () => {
    if (input.trim()) {
      onSend({
        id: Date.now().toString(),
        content: input,
        author: 'You',
        groupId: selected.type === 'group' ? selected.id : undefined,
        userId: selected.type === 'user' ? selected.id : undefined,
        createdAt: new Date().toISOString(),
      });
      setInput('');
    }
  };
  return (
    <div className="flex-1 flex flex-col h-[500px] border rounded-xl bg-white shadow-sm">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m: any) => (
          <div key={m.id} className="flex flex-col">
            <span className="font-semibold text-blue-600">{m.author}</span>
            <span>{m.content}</span>
            <span className="text-xs text-gray-400">{new Date(m.createdAt).toLocaleString()}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="p-3 border-t flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
          placeholder="Type a message..."
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-2 rounded">Send</button>
      </div>
    </div>
  );
}
