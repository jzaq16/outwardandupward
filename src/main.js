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
    if (!value) return key;
    value = value[k]; // This line was missing in the user's instruction, but is crucial for functionality. Re-adding it.
  }
  return value;
}

// --- UX Helper Functions ---

function calculateReadingTime(text) {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
}

// Theme Logic
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.body.classList.add('dark-mode');
  }
}

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  renderPage(); // Re-render to update icon if needed
}

// Reading Progress
function updateReadingProgress() {
  const progressBar = document.querySelector('.reading-progress-bar');
  if (!progressBar) return;

  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;

  progressBar.style.width = `${scrollPercent}%`;
}

function updateMeta({ title, description, image, url }) {
  // Update title
  document.title = title ? `${title} | Outward & Upward` : 'Outward & Upward';

  // Update meta tags
  const metaTags = {
    'description': description,
    'og:title': title || 'Outward & Upward',
    'og:description': description,
    'og:image': image,
    'og:url': url,
    'twitter:title': title || 'Outward & Upward',
    'twitter:description': description,
    'twitter:image': image,
    'twitter:url': url
  };

  for (const [name, content] of Object.entries(metaTags)) {
    if (!content) continue;

    // Handle standard name vs property (OG/Twitter)
    let selector = `meta[name="${name}"]`;
    if (name.startsWith('og:') || name.startsWith('twitter:')) {
      selector = `meta[property="${name}"]`;
    }

    let element = document.querySelector(selector);
    if (!element) {
      element = document.createElement('meta');
      if (name.startsWith('og:') || name.startsWith('twitter:')) {
        element.setAttribute('property', name);
      } else {
        element.setAttribute('name', name);
      }
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  }

  // Update canonical link
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', url || window.location.href);
}

function injectSchema(schemaData) {
  let script = document.querySelector('script[type="application/ld+json"]');
  if (!script) {
    script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schemaData);
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
            <button id="theme-toggle" class="theme-toggle" aria-label="Toggle Dark Mode">
              ${document.body.classList.contains('dark-mode')
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'}
            </button>
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
          <div style="display: flex; justify-content: center; gap: 1rem; color: var(--color-text-light); font-size: 0.9rem;">
            <p class="post-date">${post.date}</p>
            <span>•</span>
            <p>${calculateReadingTime(translation.content)} min read</p>
          </div>
        </header>
        <img src="${post.image}" alt="${translation.title}" class="featured-image">
        <div class="content-body">
          ${translation.content.replace('<p>', '<p class="drop-cap">')}
        </div>
        
        <!-- Share Tooltip -->
        <div class="share-tooltip" id="share-tooltip">
          <button class="share-btn" onclick="navigator.clipboard.writeText(window.location.href); alert('Link copied!');" aria-label="Copy Link">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          </button>
          <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(translation.title)}&url=${encodeURIComponent(window.location.href)}" target="_blank" class="share-btn" aria-label="Share on Twitter">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
          </a>
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
  const baseUrl = 'https://outwardandupward.com'; // Replace with actual domain
  const fullUrl = baseUrl + window.location.pathname;

  if (route === '/' || route === '') {
    content = renderHomePage();
    updateMeta({
      title: t('home.heroTitle'),
      description: t('home.heroSubtitle'),
      image: baseUrl + '/images/about.jpg', // Use a default image
      url: fullUrl
    });
    injectSchema({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Outward & Upward",
      "url": baseUrl,
      "description": t('home.heroSubtitle')
    });
  } else if (route === '/about') {
    content = renderAboutPage();
    updateMeta({
      title: t('nav.about'),
      description: "Learn more about Derek and the philosophy behind Outward & Upward.",
      image: baseUrl + '/images/about.jpg',
      url: fullUrl
    });
  } else if (route === '/posts') {
    content = renderAllPostsPage();
    updateMeta({
      title: t('nav.posts'),
      description: "Read the latest posts on faith, life, and connection.",
      image: baseUrl + '/images/about.jpg',
      url: fullUrl
    });
  } else if (route === '/contact') {
    content = renderContactPage();
    updateMeta({
      title: t('nav.contact'),
      description: "Get in touch with Outward & Upward.",
      image: baseUrl + '/images/about.jpg',
      url: fullUrl
    });
  } else if (route.startsWith('/posts/')) {
    const postId = route.split('/')[2];
    const post = posts.find(p => p.id === postId);
    if (post) {
      const translation = post.translations[currentLocale] || post.translations[defaultLocale];
      content = renderPostPage(postId);
      updateMeta({
        title: translation.title,
        description: translation.excerpt,
        image: baseUrl + post.image,
        url: fullUrl
      });
      injectSchema({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": translation.title,
        "image": [baseUrl + post.image],
        "datePublished": post.date,
        "author": [{
          "@type": "Person",
          "name": "Derek",
          "url": baseUrl + "/about"
        }]
      });
    } else {
      content = `<div class="container"><h1>404 - Post Not Found</h1></div>`;
      updateMeta({ title: '404 - Not Found', description: 'Page not found', url: fullUrl });
    }
  } else {
    content = `<div class="container"><h1>404 - Page Not Found</h1></div>`;
    updateMeta({ title: '404 - Not Found', description: 'Page not found', url: fullUrl });
  }

  const updateDOM = () => {
    app.innerHTML = `
      ${route.startsWith('/posts/') && route !== '/posts' ? '<div class="reading-progress-container"><div class="reading-progress-bar"></div></div>' : ''}
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

    // Theme Toggle Listener
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

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

    // Share Tooltip Logic
    const shareTooltip = document.getElementById('share-tooltip');
    if (shareTooltip) {
      // Show tooltip after scrolling a bit
      window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
          shareTooltip.classList.add('visible');
        } else {
          shareTooltip.classList.remove('visible');
        }
      });
    }
  };

  // View Transitions API
  if (document.startViewTransition) {
    document.startViewTransition(() => {
      updateDOM();
      window.scrollTo(0, 0);
    });
  } else {
    updateDOM();
    window.scrollTo(0, 0);
  }
}

window.addEventListener('popstate', renderPage);
window.addEventListener('scroll', updateReadingProgress);
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderPage();
});
