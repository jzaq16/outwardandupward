# Rebuild outwardandupward.com

Rebuild the existing WordPress/PHP site `outwardandupward.com` as a modern, high-performance web application using Vite, Vanilla JavaScript, and Vanilla CSS. The goal is to improve aesthetics, performance, and maintainability while keeping the core content and "soul" of the site.

## User Review Required

> [!IMPORTANT]
> **Technology Stack**: I am proposing **Vite + Vanilla JS + Vanilla CSS**. This ensures a lightweight, fast, and future-proof foundation without the overhead of heavy frameworks, while still allowing for a "premium" feel with custom animations and design.

> [!NOTE]
> **Content Migration**: I will migrate the visible content (Home, About, Contact, and the 3 recent posts).
> **Multilingual Support**: The site will support English (default), Vietnamese (`/vi`), and Spanish (`/es`). I will implement a locale-aware router and content management system.
> **Hosting & Git**: I will initialize a Git repository. For hosting, I recommend **Vercel** or **Netlify** for their seamless integration with GitHub and excellent performance for static sites.

## Proposed Changes

### Project Structure
I will initialize a new Vite project with the following structure:
- `index.html`: Main entry point.
- `src/main.js`: Main logic and router (updated to handle locales).
- `src/style.css`: Global styles and variables.
- `src/components/`: Reusable UI components (Header, Footer, PostCard, LanguageSwitcher).
- `src/pages/`: Page specific logic.
- `src/locales/`: Translation files for UI strings (en.js, vi.js, es.js).
- `src/data/`: Content data.
    - `posts.js`: Blog posts with locale support.

### Core Features
- **Client-Side Routing**: Custom router handling `/`, `/vi/`, `/es/` prefixes.
- **Responsive Design**: Mobile-first approach.
- **Premium Aesthetics**: Custom design system.
- **Multilingual Support**:
    - Language Switcher component.
    - Content fallback (if a post isn't translated, show default or hide).
    - Localized UI elements (menus, buttons).

### Hosting & Source Control
- **Git**: Initialize repository and create `.gitignore`.
- **Hosting**: Ready for deployment to Vercel/Netlify.

### Design Exploration
- **Theme Switcher**: Added a temporary (or permanent) theme switcher to the header to allow real-time comparison of color palettes.
- **Themes**:
    - **Forest** (Default): Earthy greens and creams.
    - **Ocean**: Calming blues and teals.
    - **Sunset**: Warm reds, oranges, and yellows.

### Pages
#### [NEW] [index.html](file:///Users/derekjohanson/Documents/Coding/outwardandupward/index.html)
- The shell of the application.

#### [NEW] [src/main.js](file:///Users/derekjohanson/Documents/Coding/outwardandupward/src/main.js)
- Handles routing and app initialization.

#### [NEW] [src/style.css](file:///Users/derekjohanson/Documents/Coding/outwardandupward/src/style.css)
- CSS variables for colors, typography, and spacing.
- Global reset and utility classes.

#### [NEW] [src/data/posts.js](file:///Users/derekjohanson/Documents/Coding/outwardandupward/src/data/posts.js)
- Array of post objects (title, date, excerpt, content/link).

## Verification Plan

### Automated Tests
- **Build Check**: Run `npm run build` to ensure the project builds without errors.
- **Lint Check**: Ensure code quality (if linting is added).

### Manual Verification
- **Browser Testing**:
    - Open the local development server (`npm run dev`).
    - Navigate to Home, About, All Posts, and Contact pages.
    - Verify the "Recent Posts" are displayed correctly.
    - Test the responsive design on mobile and desktop viewports.
    - Verify the language switcher toggles (even if just mock content for now).
