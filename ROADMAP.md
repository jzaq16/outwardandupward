# Project Roadmap: Outward & Upward

This document serves as the single source of truth for the project's direction, replacing scattered checklists. It is organized by **Phases** to ensure a structured approach to growth.

## Phase 1: Foundation & MVP (Current Status: 90% Complete)
*Goal: Rebuild the existing site with modern tech, better design, and multilingual support.*
- [x] **Core Tech Stack**: Vite, Vanilla JS, CSS.
- [x] **Routing**: Custom client-side router.
- [x] **Multilingual Support**: English, Vietnamese, Spanish structure.
- [x] **Design System**: "Ocean" theme established as default.
- [x] **Basic Content**: Home, About, Contact, and 3 recent posts.
- [x] **Polish**: Sticky footer, inline navigation, pagination.

## Phase 2: Scalability & Content Structure (Immediate Focus)
*Goal: Prepare the architecture to handle dozens or hundreds of posts without degrading UX.*
- [ ] **Data Structure**: Add `categories` and `tags` to post data.
- [ ] **Navigation**: Add "Browse by Category" to the Posts page.
- [ ] **UX Polish**: Implement "blur-up" or skeleton loading for images to prevent layout shifts.
- [ ] **SEO**: Dynamic meta tags (title, description) for each blog post.

## Phase 3: Discovery & Engagement (Next Up)
*Goal: Help users find relevant content and engage with it.*
- [ ] **Search**: Client-side search functionality for blog posts.
- [ ] **Archives**: Browse posts by Month/Year.
- [ ] **Related Posts**: Suggest similar content at the bottom of articles.
- [ ] **RSS Feed**: Generate an RSS feed for readers.

## Phase 4: Infrastructure & Operations
*Goal: Ensure long-term maintainability and ease of deployment.*
- [ ] **CMS Integration**: (Optional) Connect to a Headless CMS (like Contentful or Sanity) so you don't have to edit code to write posts.
- [ ] **Testing**: Add basic unit tests for the router and utility functions.
- [ ] **CI/CD**: Automated deployment pipelines (GitHub Actions -> Netlify/Vercel).

## Active Sprint Backlog (See `task.md` for daily tracking)
1. Implement Categories/Tags.
2. Add Image Loading states.
3. SEO Meta Tag updates.
