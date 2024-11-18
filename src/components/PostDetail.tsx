import React from 'react';

interface PostDetailProps {
  setShowPostDetail: (show: boolean) => void;
}

const PostDetail: React.FC<PostDetailProps> = ({ setShowPostDetail }) => {
  return (
    <div className="post-detail" id="post-detail">
      {/* Post detail will be shown here */}
      <button className="back-button" onClick={() => setShowPostDetail(false)}>← Back to Posts</button>
      <div className="detail-content"></div>
    </div>
  );
};

export default PostDetail;
