import * as marked from 'marked';

// Constants
const BASE_URL = window.location.pathname.replace(/\/$/, '');
const PATHS = {
  POSTS_JSON: `${BASE_URL}/resources/posts.json`,
  POST_MARKDOWN: (id: string): string => `${BASE_URL}/resources/${id}.md`
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
function displayError(message: string): void {
  const postsGrid = document.querySelector(SELECTORS.POSTS_GRID);
  if (postsGrid) {
    postsGrid.innerHTML = `
    <div class="error-message">
      <h3>Error:</h3>
      <p>${message}</p>
    </div>
  `;
  }
}

// Post Preview Class
class PostPreview {
  constructor(public post: Post) {}

  createPreviewElement(): HTMLElement {
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

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

interface Post {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  readTime: number;
  markdown: string;
}


// Post Detail Class
class PostDetail {
  static async show(postId: string): Promise<void> {
    try {
      const markdown = await this.fetchPostContent(postId);
      this.renderDetail(markdown);
      this.toggleViews(true);
    } catch (error: any) {
      displayError(`Error loading post detail: ${error.message}`);
    }
  }

  static async fetchPostContent(postId: string): Promise<string> {
    const response = await fetch(PATHS.POST_MARKDOWN(postId));
    if (!response.ok) {
      throw new Error(`Failed to load post ${postId}: ${response.status} ${response.statusText}`);
    }
    return response.text();
  }

  static async renderDetail(markdown: string): Promise<void> {
    const detailContent = document.querySelector(SELECTORS.DETAIL_CONTENT);
    if (detailContent) {
      detailContent.innerHTML = await marked.parse(markdown);
    }
  }

  static hide(): void {
    this.toggleViews(false);
  }

  static toggleViews(showDetail: boolean): void {
    const detailView = document.querySelector(SELECTORS.POST_DETAIL);
    const postsGrid = document.querySelector(SELECTORS.POSTS_GRID) as HTMLElement;
    if (detailView && postsGrid) {
      detailView.classList.toggle('active', showDetail);
      postsGrid.style.display = showDetail ? 'none' : 'flex';
    }
  }}

// Posts Manager Class
class PostsManager {
  postsGrid: HTMLElement | null;
  createPostForm: HTMLFormElement | null;
  markdownInput: HTMLTextAreaElement | null;
  createPostView: HTMLElement | null;

  constructor() {
    this.postsGrid = document.querySelector(SELECTORS.POSTS_GRID);
    this.createPostForm = document.querySelector(SELECTORS.CREATE_POST_FORM) as HTMLFormElement | null;
    this.markdownInput = document.querySelector(SELECTORS.MARKDOWN_INPUT) as HTMLTextAreaElement | null;
    this.createPostView = document.getElementById('create-post-view');
  }

  async initialize(): Promise<void> {
    try {
      const posts = await this.loadPosts();
      this.renderPosts(posts);
      this.setupCreatePostForm();
    } catch (error: any) {
      displayError(`Error initializing posts: ${error.message}`);
    }
  }

  async loadPosts(): Promise<Post[]> {
    try {
      const response = await fetch(PATHS.POSTS_JSON);
      if (!response.ok) {
        throw new Error(`Failed to load posts from JSON: ${response.status} ${response.statusText}`);
      }
      const posts: Post[] = await response.json();
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(posts));
      return posts;
    } catch (error: any) {
      const storedPosts = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedPosts) {
        return JSON.parse(storedPosts);
      } else {
        return [];
      }
    }
  }

  renderPosts(posts: Post[]): void {
    if (this.postsGrid) {
      this.postsGrid.innerHTML = '';
      posts.forEach(post => {
        const preview = new PostPreview(post);
        this.postsGrid.appendChild(preview.createPreviewElement());
      });
    }
  }

  setupCreatePostForm(): void {
    if (this.createPostForm && this.markdownInput && this.createPostView) {
      this.createPostForm.addEventListener('submit', async (event: Event) => {
        event.preventDefault();
        const markdown = this.markdownInput.value;
        if (markdown.trim() === '') return;
        const newPost: Post = {
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
        this.postsGrid!.style.display = 'flex';
        location.reload();
      });
    }
  }

  async savePostsToJson(posts: Post[]): Promise<void> {
    try {
      // Check if the File System Access API is supported
      if ('showOpenFilePicker' in window) {
        const [fileHandle] = await (window as any).showOpenFilePicker({
          types: [{ description: 'JSON files', accept: { 'application/json': ['.json'] } }],
          suggestedName: 'posts.json',
          mode: 'save'
        });
        const writable = await fileHandle.createWritable();
        await writable.write(JSON.stringify(posts, null, 2));
        await writable.close();
      } else {
        // Fallback for environments that don't support File System Access API
        const blob = new Blob([JSON.stringify(posts, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'posts.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error: any) {
      displayError(`Error saving posts to JSON: ${error.message}`);
    }
  }}

export { PostsManager, PostPreview, PostDetail };
