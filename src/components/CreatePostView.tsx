import React from 'react';

const CreatePostView: React.FC = () => {
  return (
    <div id="create-post-view">
      <form id="create-post-form">
        <input type="text" id="post-title" placeholder="Title" />
        <textarea id="markdown-input" placeholder="Enter markdown content..." />
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default CreatePostView;
