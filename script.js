// script.js
// Sidebar toggle function
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.querySelector('.main-content');
  if (sidebar.style.left === '0px') {
    sidebar.style.left = '-250px';
    mainContent.style.marginLeft = '0';
  } else {
    sidebar.style.left = '0';
    mainContent.style.marginLeft = '250px';
  }
}

// Close the sidebar
function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.querySelector('.main-content');
  sidebar.style.left = '-250px';
  mainContent.style.marginLeft = '0';
}

// Fetch and display blog posts from Markdown files
function loadPosts() {
  fetch('posts.md')
    .then(response => response.text())
    .then(data => {
      const postsContainer = document.getElementById('main-content');
      const posts = marked.parse(data); // Use marked.js to convert Markdown to HTML
      postsContainer.innerHTML = posts;
    })
    .catch(error => console.error('Error loading Markdown:', error));
}

// Load posts when the page loads
window.onload = function() {
  loadPosts();
}
