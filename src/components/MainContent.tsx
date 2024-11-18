import React from 'react';
import { PostsManager, PostDetail } from '../service/post';
import CreatePostView from './CreatePostView';

const MainContent: React.FC = () => {
  const postsManager = new PostsManager();

  React.useEffect(() => {
    postsManager.initialize();
  }, []);

  return (
    <div className="main-content" id="main-content">
      <div id="posts-grid"></div>
      <div id="post-detail" className="post-detail">
        <div className="detail-content"></div>
        <button className="back-button" onClick={PostDetail.hide}>Back</button>
      </div>
      <CreatePostView />
    </div>
  );
};

export default MainContent;
