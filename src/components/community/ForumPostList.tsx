import ForumPostItem from './ForumPostItem';

export default function ForumPostList({ posts, onVote, onAddComment }: any) {
  return (
    <div className="space-y-6 mt-2">
      {posts.length === 0 ? (
        <div className="text-gray-400 text-center py-8 italic">No posts in this topic yet. Be the first to spill the tea!</div>
      ) : (
        posts.map((p: any) => (
          <ForumPostItem key={p.id} post={p} onVote={onVote} onAddComment={onAddComment} />
        ))
      )}
    </div>
  );
}
