// Constants
const PATHS = {
  POSTS_JSON: '/resources/posts.json',
  POST_MARKDOWN: (id) => `/resources/${id}.md`
};

const SELECTORS = {
  POSTS_GRID: '#posts-grid',
  POST_DETAIL: '#post-detail',
  DETAIL_CONTENT: '.detail-content',
  BACK_BUTTON: '.back-button'
};

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
        <span class="read-time">${this.post.readTime} min read</span>
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
  }

  async initialize() {
    try {
      const posts = await this.loadPosts();
      this.renderPosts(posts);
    } catch (error) {
      displayError(`Error initializing posts: ${error.message}`);
    }
  }

  async loadPosts() {
    try {
      const response = await fetch(PATHS.POSTS_JSON);
      if (!response.ok) {
        throw new Error(`Failed to load posts: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error loading posts: ${error.message}`);
    }
  }

  renderPosts(posts) {
    this.postsGrid.innerHTML = '';
    posts.forEach(post => {
      const preview = new PostPreview(post);
      this.postsGrid.appendChild(preview.createPreviewElement());
    });
  }
}

export { PostsManager, PostPreview, PostDetail };
