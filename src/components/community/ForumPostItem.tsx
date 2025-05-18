import { useState } from 'react';

export default function ForumPostItem({ post, onVote, onAddComment }: any) {
  const [comment, setComment] = useState('');
  const handleComment = () => {
    if (comment.trim()) {
      onAddComment(post.id, { id: Date.now().toString(), content: comment, author: 'You', createdAt: new Date().toISOString() });
      setComment('');
    }
  };
  return (
    <div className="border border-blue-100 dark:border-blue-900/30 rounded-2xl p-5 bg-white/90 dark:bg-background/80 shadow-lg transition-all duration-300 hover:shadow-2xl">
      <div className="flex items-center gap-3 mb-2">
        <span className="font-bold text-blue-700 dark:text-cyan-300 text-lg">{post.author}</span>
        <span className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleString()}</span>
        <span className="ml-auto text-sm text-blue-500 font-semibold">{post.topicName}</span>
      </div>
      <div className="mb-3 text-base text-gray-800 dark:text-gray-100 leading-relaxed">{post.content}</div>
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => onVote(post.id, 1)} className="text-green-500 text-xl hover:scale-125 transition-transform">▲</button>
        <span className="font-semibold text-lg text-gray-700 dark:text-gray-200">{post.votes}</span>
        <button onClick={() => onVote(post.id, -1)} className="text-red-500 text-xl hover:scale-125 transition-transform">▼</button>
      </div>
      <div className="mt-4 bg-blue-50/60 dark:bg-blue-900/20 rounded-xl p-3">
        <div className="font-semibold mb-2 text-blue-700 dark:text-cyan-300">Comments</div>
        <ul className="space-y-2">
          {post.comments.map((c: any) => (
            <li key={c.id} className="bg-white/80 dark:bg-background/70 rounded p-2 flex flex-col shadow-sm border border-border/20">
              <span className="font-medium text-blue-600 dark:text-cyan-200">{c.author}:</span> {c.content}
              <span className="ml-2 text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
        <div className="flex gap-2 mt-3">
          <input
            value={comment}
            onChange={e => setComment(e.target.value)}
            className="border border-border/40 rounded-lg px-3 py-1 flex-1 focus:ring-2 focus:ring-blue-300 outline-none bg-white dark:bg-background text-sm transition-all"
            placeholder="Add a comment..."
            maxLength={200}
          />
          <button onClick={handleComment} className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-4 py-1.5 rounded-lg font-semibold shadow hover:scale-105 active:scale-95 transition-all duration-200">Send</button>
        </div>
      </div>
    </div>
  );
}
