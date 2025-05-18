import { useState } from 'react';

export default function ForumPostForm({ onAdd, topicId }: any) {
  const [content, setContent] = useState('');
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (content.trim()) {
      onAdd({
        id: Date.now().toString(),
        content,
        author: 'You',
        createdAt: new Date().toISOString(),
        topicId,
        topicName: '',
        votes: 0,
        comments: [],
      });
      setContent('');
    }
  };
  return (
    <form onSubmit={handleSubmit} className="mb-4 flex gap-3 items-center bg-white/80 dark:bg-background/80 rounded-xl shadow p-4 border border-border/30">
      <input
        value={content}
        onChange={e => setContent(e.target.value)}
        className="border border-border/40 rounded-lg px-4 py-2 flex-1 shadow-sm focus:ring-2 focus:ring-blue-300 outline-none bg-white dark:bg-background text-base transition-all"
        placeholder="What's on your mind?"
        maxLength={300}
      />
      <button type="submit" className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-2 rounded-lg font-semibold shadow hover:scale-105 active:scale-95 transition-all duration-200">Post</button>
    </form>
  );
}
