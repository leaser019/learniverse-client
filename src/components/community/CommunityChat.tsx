"use client";
import { useState } from 'react';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import { mockGroups, mockMessages, mockUsers } from './mockChatData';

export default function CommunityChat() {
  const [selected, setSelected] = useState({ type: 'group', id: mockGroups[0].id });
  const [messages, setMessages] = useState(mockMessages);

  const handleSelect = (type: string, id: string) => setSelected({ type, id });
  const handleSend = (msg: any) => setMessages([...messages, msg]);

  const chatMessages = messages.filter(m =>
    selected.type === 'group' ? m.groupId === selected.id : m.userId === selected.id
  );

  return (
    <div className="flex gap-8">
      <ChatSidebar groups={mockGroups} users={mockUsers} selected={selected} onSelect={handleSelect} />
      <ChatWindow
        messages={chatMessages}
        onSend={handleSend}
        selected={selected}
        users={mockUsers}
      />
    </div>
  );
}
