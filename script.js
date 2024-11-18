function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.querySelector('.main-content');
  sidebar.classList.toggle('open');
  mainContent.classList.toggle('sidebar-open');
}

document.addEventListener('click', (e) => {
  const sidebar = document.getElementById('sidebar');
  const menuBtn = document.getElementById('menu-btn');
  if (!sidebar.contains(e.target) && !menuBtn.contains(e.target) && sidebar.classList.contains('open')) {
    toggleSidebar();
  }
});

window.addEventListener('resize', () => {
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.querySelector('.main-content');
  if (window.innerWidth <= 480 && sidebar.classList.contains('open')) {
    mainContent.classList.remove('sidebar-open');
  }
});

import { PostsManager, PostDetail } from './post.js';

document.addEventListener('DOMContentLoaded', () => {
  const postsManager = new PostsManager();
  postsManager.initialize();
  document.getElementById('menu-btn').addEventListener('click', toggleSidebar);
  document.querySelector('.back-button').addEventListener('click', () => PostDetail.hide());
  const createPostLink = document.getElementById('create-post-link');
  createPostLink.addEventListener('click', () => {
    // createPostLink.style.pointerEvents = 'none'; // Disable link
    alert('The create post feature is not yet supported.');
    setTimeout(() => {
      location.reload();
    }, 1000); //Reload after 1 second
  });
});
