import React, { useEffect, useState } from 'react';
import { marked } from 'marked';

interface Post {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  readTime: number;
  markdown: string;
}

interface PostsGridProps {
  setShowPostDetail: (show: boolean) => void;
  setSelectedPostId: (postId: string) => void;
}

const PostsGrid: React.FC<PostsGridProps> = ({ setShowPostDetail, setSelectedPostId }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/assets/posts.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="posts-grid" id="posts-grid">
      {posts.map((post) => (
        <div key={post.id} className="post-preview" onClick={() => {
          setShowPostDetail(true);
          setSelectedPostId(post.id);
        }}>
          <h2>{post.title}</h2>
          <div className="metadata">
            <span className="date">{formatDate(post.date)}</span>
            <span className="readTime">{post.readTime} min read</span>
          </div>
          <p className="excerpt">{post.excerpt}</p>
        </div>
      ))}
    </div>
  );
};

export default PostsGrid;
