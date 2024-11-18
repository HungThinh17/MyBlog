import React from 'react';

interface PostsGridProps {
  setShowPostDetail: (show: boolean) => void;
}

const PostsGrid: React.FC<PostsGridProps> = ({ setShowPostDetail }) => {
  return (
    <div className="posts-grid" id="posts-grid">
      {/* Post previews will be injected here */}
    </div>
  );
};

export default PostsGrid;
