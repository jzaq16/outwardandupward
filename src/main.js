import './style.css';
import en from './locales/en.js';
import vi from './locales/vi.js';
import es from './locales/es.js';
import { posts } from './data/posts.js';

const locales = { en, vi, es };
const defaultLocale = 'en';

// Simple router state
let currentLocale = defaultLocale;
let currentPath = '/';

function getLocaleFromPath(path) {
  const parts = path.split('/').filter(Boolean);
  if (parts.length > 0 && locales[parts[0]]) {
    return parts[0];
  }
  return defaultLocale;
}

function getRouteFromPath(path) {
  const parts = path.split('/').filter(Boolean);
  if (parts.length > 0 && locales[parts[0]]) {
    parts.shift(); // Remove locale
  }
  return '/' + parts.join('/');
}

function t(key) {
  const keys = key.split('.');
  let value = locales[currentLocale];
  for (const k of keys) {
    value = value[k];
    if (!value) return key;
  }
  return value;
}

function renderHeader() {
  return `
    <header class="site-header">
      <div class="container header-content">
        <a href="/${currentLocale === defaultLocale ? '' : currentLocale}" class="logo" data-link>
          Outward & Upward
        </a>
        <nav style="display: flex; align-items: center; gap: var(--spacing-md);">
          <ul class="nav-links">
            <li><a href="/${currentLocale === defaultLocale ? '' : currentLocale}" data-link>${t('nav.home')}</a></li>
            <li><a href="/${currentLocale === defaultLocale ? '' : currentLocale + '/'}about" data-link>${t('nav.about')}</a></li>
            <li><a href="/${currentLocale === defaultLocale ? '' : currentLocale + '/'}posts" data-link>${t('nav.posts')}</a></li>
            <li><a href="/${currentLocale === defaultLocale ? '' : currentLocale + '/'}contact" data-link>${t('nav.contact')}</a></li>
          </ul>
          <div class="controls">
            <select id="lang-select" aria-label="Language selector">
              <option value="en" ${currentLocale === 'en' ? 'selected' : ''}>EN</option>
              <option value="vi" ${currentLocale === 'vi' ? 'selected' : ''}>VI</option>
              <option value="es" ${currentLocale === 'es' ? 'selected' : ''}>ES</option>
            </select>
          </div>
        </nav>
      </div>
    </header>
  `;
}

function renderFooter() {
  return `
    <footer class="site-footer">
      <div class="container">
        <p>${t('footer.copyright')}</p>
      </div>
    </footer>
  `;
}

function renderHomePage() {
  const recentPosts = posts.slice(0, 3).map(post => {
    const translation = post.translations[currentLocale] || post.translations[defaultLocale];
    if (!translation) return '';
    const postLink = `/${currentLocale === defaultLocale ? '' : currentLocale + '/'}posts/${post.id}`;
    return `
      <article class="post-card fade-in">
        <a href="${postLink}" data-link class="post-link-wrapper">
          <img src="${post.image}" alt="${translation.title}" loading="lazy" />
        </a>
        <div class="post-content-wrapper">
          <a href="${postLink}" data-link class="post-link-wrapper">
            <h3>${translation.title}</h3>
          </a>
          <p class="post-date">${post.date}</p>
          <p>${translation.excerpt}</p>
          <a href="${postLink}" class="read-more" data-link>${t('home.readMore')}</a>
        </div>
      </article>
    `;
  }).join('');

  return `
    <div class="page-home">
      <section class="hero">
        <div class="container">
          <h1 class="fade-in">${t('home.heroTitle')}</h1>
          <p class="subtitle fade-in">${t('home.heroSubtitle')}</p>
        </div>
      </section>
      <section class="recent-posts container">
        <h2>${t('home.recentPosts')}</h2>
        <div class="posts-grid">
          ${recentPosts}
        </div>
      </section>
    </div>
  `;
}

function renderAboutPage() {
  const philosophyPostLink = `/${currentLocale === defaultLocale ? '' : currentLocale + '/'}posts/why-the-name`;
  return `
    <div class="page-about container fade-in">
      <section class="hero-small">
        <h1>${t('nav.about')}</h1>
      </section>
      <div style="margin-top: var(--spacing-lg); max-width: 900px; margin-left: auto; margin-right: auto;">
        <div style="display: flex; gap: 2rem; align-items: flex-start; flex-wrap: wrap; margin-bottom: 1.5rem;">
            <img src="/images/about.jpg" alt="About Me" style="max-width: 300px; width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
            <div style="flex: 1; min-width: 300px;">
                <p>Hi, I'm Derek! I'm a tech worker in the California Bay Area, but far more importantly, I'm a Christian, a husband, and a parent. When I'm not with my family, I enjoy trying new tech, appreciating nature, and exploring new ideas.</p>
                <p>My goal is simple: to build bridges of connection by sharing down-to-earth perspectives on Christian living and faith in real life. Naturally, a lot of this will relate to my experiences as a member of The Church of Jesus Christ of Latter-day Saints (sometimes called "Mormons"). In part, I hope I can help demystify my faith in an accessible and genuine way for anyone who has ever wondered about it.</p>
            </div>
        </div>
        <p>It's important to note that the thoughts I share here are my own; I don't speak for my church. But my faith is central to who I am, and I'll frequently refer to the scriptures and other sources that guide and inspire me.</p>
        <p>Thanks for stopping by. I hope you'll join the conversation!</p>
        <div style="margin-top: 2rem; text-align: center;">
            <a href="${philosophyPostLink}" class="btn" data-link>Site Philosophy</a>
        </div>
      </div>
    </div>
  `;
}

// Pagination state
let currentPage = 1;
const postsPerPage = 6; // Set to 6 for demo, though we only have 3 posts currently

function renderAllPostsPage() {
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const start = (currentPage - 1) * postsPerPage;
  const end = start + postsPerPage;
  const currentPosts = posts.slice(start, end);

  const postsHtml = currentPosts.map(post => {
    const translation = post.translations[currentLocale] || post.translations[defaultLocale];
    if (!translation) return '';
    const postLink = `/${currentLocale === defaultLocale ? '' : currentLocale + '/'}posts/${post.id}`;
    return `
      <article class="post-card">
        <a href="${postLink}" data-link class="post-link-wrapper">
          <img src="${post.image}" alt="${translation.title}" loading="lazy" />
        </a>
        <div class="post-content-wrapper">
          <a href="${postLink}" data-link class="post-link-wrapper">
            <h3>${translation.title}</h3>
          </a>
          <p class="post-date">${post.date}</p>
          <p>${translation.excerpt}</p>
          <a href="${postLink}" class="read-more" data-link>${t('home.readMore')}</a>
        </div>
      </article>
    `;
  }).join('');

  const paginationControls = `
    <div class="pagination-controls" style="margin-top: 2rem; display: flex; justify-content: center; gap: 1rem;">
      <button class="btn" ${currentPage === 1 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''} id="prev-page">Previous</button>
      <span style="align-self: center;">Page ${currentPage} of ${totalPages || 1}</span>
      <button class="btn" ${currentPage === totalPages || totalPages === 0 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''} id="next-page">Next</button>
    </div>
  `;

  return `
    <div class="page-posts container fade-in">
      <section class="hero-small">
        <h1>${t('nav.posts')}</h1>
      </section>
      <div class="posts-grid">
        ${postsHtml}
      </div>
      ${posts.length > 0 ? paginationControls : ''}
    </div>
  `;
}

function renderContactPage() {
  return `
    <div class="page-contact container fade-in">
      <section class="hero-small">
        <h1>${t('nav.contact')}</h1>
      </section>
      <div class="content">
        <p>Want to connect? Send me an email at <a href="mailto:hello@outwardandupward.com">hello@outwardandupward.com</a></p>
      </div>
    </div>
  `;
}

function renderPostPage(postId) {
  const post = posts.find(p => p.id === postId);
  if (!post) {
    // Return 404 content instead of redirecting immediately
    return `<div class="container"><h1>404 - Post Not Found</h1></div>`;
  }

  const translation = post.translations[currentLocale] || post.translations[defaultLocale];

  return `
    <div class="page-post container fade-in">
      <article class="post-content">
        <header style="text-align: center; margin-bottom: 0.8rem;">
          <h1>${translation.title}</h1>
          <p class="post-date" style="justify-content: center;">${post.date}</p>
        </header>
        <img src="${post.image}" alt="${translation.title}" class="featured-image">
        <div class="content-body">
          ${translation.content}
        </div>
        <div style="margin-top: 4rem; text-align: center;">
          <a href="/posts" class="btn" data-link>← Back to All Posts</a>
        </div>
      </article>
    </div>
  `;
}

function renderPage() {
  const app = document.querySelector('#app');
  const route = getRouteFromPath(window.location.pathname);
  currentLocale = getLocaleFromPath(window.location.pathname);

  let content = '';
  if (route === '/' || route === '') {
    content = renderHomePage();
  } else if (route === '/about') {
    content = renderAboutPage();
  } else if (route === '/posts') {
    content = renderAllPostsPage();
  } else if (route === '/contact') {
    content = renderContactPage();
  } else if (route.startsWith('/posts/')) {
    const postId = route.split('/')[2];
    content = renderPostPage(postId);
  } else {
    content = `<div class="container"><h1>404 - Page Not Found</h1></div>`;
  }

  app.innerHTML = `
    ${renderHeader()}
    <main>
      ${content}
    </main>
    ${renderFooter()}
  `;

  // Re-attach event listeners
  document.querySelectorAll('a[data-link]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const href = e.currentTarget.getAttribute('href');
      history.pushState(null, null, href);
      renderPage();
    });
  });

  document.getElementById('lang-select').addEventListener('change', (e) => {
    const newLocale = e.target.value;
    let newPath = window.location.pathname;

    // Remove old locale prefix if present
    if (currentLocale !== defaultLocale && newPath.startsWith('/' + currentLocale)) {
      newPath = newPath.replace('/' + currentLocale, '');
    }

    // Add new locale prefix if not default
    if (newLocale !== defaultLocale) {
      newPath = '/' + newLocale + newPath;
    }

    // Clean up double slashes
    newPath = newPath.replace('//', '/');
    if (newPath === '') newPath = '/';

    history.pushState(null, null, newPath);
    renderPage();
  });

  // Pagination listeners
  const prevBtn = document.getElementById('prev-page');
  const nextBtn = document.getElementById('next-page');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderPage();
        window.scrollTo(0, 0);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const totalPages = Math.ceil(posts.length / postsPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        renderPage();
        window.scrollTo(0, 0);
      }
    });
  }
}

window.addEventListener('popstate', renderPage);
document.addEventListener('DOMContentLoaded', renderPage);
