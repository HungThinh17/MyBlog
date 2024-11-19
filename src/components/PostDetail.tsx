import React, { useState, useEffect } from 'react';
import { marked } from 'marked';

interface PostDetailProps {
  postId: string;
}

const PostDetail: React.FC<PostDetailProps> = ({ postId }) => {
  const [markdown, setMarkdown] = useState('');
  const [error, setError] = useState('');

  //Check if it's production build by checking if process.env.NODE_ENV is production
  const isProduction = process.env.NODE_ENV === 'production';
  const baseUrl = isProduction ? 'https://hungthinh17.github.io/MyBlog/dist' : window.location.pathname.replace(/\/$/, '');
  const PATHS = {
    POSTS_JSON: `${baseUrl}/resources/posts.json`,
    POST_MARKDOWN: (id: string) => `${baseUrl}/resources/${id}.md`
  };


  useEffect(() => {
    const fetchPostContent = async () => {
      try {
        const response = await fetch(PATHS.POST_MARKDOWN(postId));
        if (!response.ok) {
          throw new Error(`Failed to load post ${postId}: ${response.status} ${response.statusText}`);
        }
        const data = await response.text();
        setMarkdown(data);
      } catch (error: any) {
        setError(`Error loading post detail: ${error.message}`);
      }
    };

    fetchPostContent();
  }, [postId]);

  if (error) {
    return <div className="error-message"><h3>Error:</h3><p>{error}</p></div>;
  }

  return (
    <div className="detail-content">
      <div dangerouslySetInnerHTML={{ __html: marked.parse(markdown) }} />
    </div>
  );
};

export default PostDetail;
