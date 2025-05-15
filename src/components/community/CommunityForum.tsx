'use client'
import { useState } from 'react';
import ForumPostForm from './ForumPostForm';
import ForumPostList from './ForumPostList';
import ForumTopicList from './ForumTopicList';
import { mockPosts, mockTopics } from './mockForumData';

export default function CommunityForum() {
  const [selectedTopic, setSelectedTopic] = useState(mockTopics[0].id);
  const [posts, setPosts] = useState(mockPosts);

  const handleSelectTopic = (topicId: string) => setSelectedTopic(topicId);
  const handleAddPost = (post: any) => setPosts([post, ...posts]);
  const handleVote = (postId: string, delta: number) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, votes: p.votes + delta } : p));
  };
  const handleAddComment = (postId: string, comment: any) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, comments: [comment, ...p.comments] } : p));
  };

  return (
    <div className="flex gap-8 bg-white/80 dark:bg-background/80 rounded-2xl shadow-xl p-6 backdrop-blur-md border border-border/40">
      <ForumTopicList topics={mockTopics} selected={selectedTopic} onSelect={handleSelectTopic} />
      <div className="flex-1 flex flex-col gap-6">
        <ForumPostForm onAdd={handleAddPost} topicId={selectedTopic} />
        <ForumPostList
          posts={posts.filter(p => p.topicId === selectedTopic)}
          onVote={handleVote}
          onAddComment={handleAddComment}
        />
      </div>
    </div>
  );
}
