// Constants
const PATHS = {
  POSTS_JSON: '/resources/posts.json',
  POST_MARKDOWN: (id) => `/resources/${id}.md`
};

const SELECTORS = {
  POSTS_GRID: '#posts-grid',
  POST_DETAIL: '#post-detail',
  DETAIL_CONTENT: '.detail-content',
  BACK_BUTTON: '.back-button',
  CREATE_POST_FORM: '#create-post-form',
  MARKDOWN_INPUT: '#markdown-input'
};

const LOCAL_STORAGE_KEY = 'posts';

// Helper function to display error messages
function displayError(message) {
  const postsGrid = document.querySelector(SELECTORS.POSTS_GRID);
  postsGrid.innerHTML = `
    <div class="error-message">
      <h3>Error:</h3>
      <p>${message}</p>
    </div>
  `;
}

// Post Preview Class
class PostPreview {
  constructor(post) {
    this.post = post;
  }

  createPreviewElement() {
    const preview = document.createElement('div');
    preview.className = 'post-preview';
    preview.innerHTML = `
      <h2>${this.post.title}</h2>
      <div class="metadata">
        <span class="date">${this.formatDate(this.post.date)}</span>
        <span class="readTime">${this.post.readTime} min read</span>
      </div>
      <p class="excerpt">${this.post.excerpt}</p>
    `;
    preview.addEventListener('click', () => PostDetail.show(this.post.id));
    return preview;
  }

  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

// Post Detail Class
class PostDetail {
  static async show(postId) {
    try {
      const markdown = await this.fetchPostContent(postId);
      this.renderDetail(markdown);
      this.toggleViews(true);
    } catch (error) {
      displayError(`Error loading post detail: ${error.message}`);
    }
  }

  static async fetchPostContent(postId) {
    const response = await fetch(PATHS.POST_MARKDOWN(postId));
    if (!response.ok) {
      throw new Error(`Failed to load post ${postId}: ${response.status} ${response.statusText}`);
    }
    return response.text();
  }

  static renderDetail(markdown) {
    const detailView = document.querySelector(SELECTORS.POST_DETAIL);
    const detailContent = detailView.querySelector(SELECTORS.DETAIL_CONTENT);
    detailContent.innerHTML = marked.parse(markdown);
  }

  static hide() {
    this.toggleViews(false);
  }

  static toggleViews(showDetail) {
    const detailView = document.querySelector(SELECTORS.POST_DETAIL);
    const postsGrid = document.querySelector(SELECTORS.POSTS_GRID);
    detailView.classList.toggle('active', showDetail);
    postsGrid.style.display = showDetail ? 'none' : 'flex';
  }
}

// Posts Manager Class
class PostsManager {
  constructor() {
    this.postsGrid = document.querySelector(SELECTORS.POSTS_GRID);
    this.createPostForm = document.querySelector(SELECTORS.CREATE_POST_FORM);
    this.markdownInput = document.querySelector(SELECTORS.MARKDOWN_INPUT);
    this.createPostView = document.getElementById('create-post-view');
  }

  async initialize() {
    try {
      const posts = await this.loadPosts();
      this.renderPosts(posts);
      this.setupCreatePostForm();
    } catch (error) {
      displayError(`Error initializing posts: ${error.message}`);
    }
  }

  async loadPosts() {
    try {
      const response = await fetch(PATHS.POSTS_JSON);
      if (!response.ok) {
        throw new Error(`Failed to load posts from JSON: ${response.status} ${response.statusText}`);
      }
      const posts = await response.json();
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(posts));
      return posts;
    } catch (error) {
      const storedPosts = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedPosts) {
        return JSON.parse(storedPosts);
      } else {
        return []; 
      }
    }
  }

  renderPosts(posts) {
    this.postsGrid.innerHTML = '';
    posts.forEach(post => {
      const preview = new PostPreview(post);
      this.postsGrid.appendChild(preview.createPreviewElement());
    });
  }

  setupCreatePostForm() {
    this.createPostForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const markdown = this.markdownInput.value;
      if (markdown.trim() === '') return;
      const newPost = {
        id: Date.now().toString(),
        title: 'New Post',
        date: new Date().toISOString(),
        excerpt: markdown.substring(0, 100) + '...',
        readTime: 5,
        markdown: markdown
      };
      const posts = await this.loadPosts();
      posts.push(newPost);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(posts));
      await this.savePostsToJson(posts);
      this.renderPosts(posts); 
      this.markdownInput.value = '';
      this.createPostView.style.display = 'none';
      this.postsGrid.style.display = 'flex'; 
      location.reload(); 
    });
  }

  async savePostsToJson(posts) {
    try {
      const handle = await window.showOpenFilePicker({types: [{description: 'JSON files', accept: { 'application/json': ['.json'] }}]});
      const file = await handle.getFile();
      const writable = await file.createWritable();
      await writable.write(JSON.stringify(posts, null, 2));
      await writable.close();
    } catch (error) {
      displayError(`Error saving posts to JSON: ${error.message}`);
    }
  }
}

export { PostsManager, PostPreview, PostDetail };
