import React, { useState } from 'react';
import PostsGrid from './PostsGrid';
import CreatePostView from './CreatePostView';
import PostDetail from './PostDetail';

interface MainContentProps {
  openCreatePost: () => void;
  closeCreatePost: () => void;
}

const MainContent: React.FC<MainContentProps> = ({ openCreatePost, closeCreatePost }) => {
  const [showPostDetail, setShowPostDetail] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);

  return (
    <div className="main-content" id="main-content">
      <PostsGrid setShowPostDetail={setShowPostDetail} setSelectedPostId={setSelectedPostId} />
      {showPostDetail && (
        <div id="post-detail" className="post-detail active">
          <PostDetail postId={selectedPostId} />
          <button className="back-button" onClick={() => setShowPostDetail(false)}>Back</button>
        </div>
      )}
    </div>
  );
};

export default MainContent;
