# Technical Strategy: Full Stack LLM-First Development

**Goal**: Build a modern, dynamic blog with custom features (comments, forms) while maintaining a "serverless" architecture. The primary objective is to leverage LLM-assisted development to build these systems from scratch rather than relying on drop-in 3rd party widgets, to gain full-stack familiarity.

## Core Architecture

We will use the **Vercel Ecosystem** to keep infrastructure management low while having full backend capabilities.

### 1. The Stack
*   **Frontend**: Existing Vite + Vanilla JS (Static).
*   **Backend**: **Vercel Serverless Functions**.
    *   Located in `api/` directory.
    *   Vercel automatically deploys these as endpoints (e.g., `api/comments.js` -> `/api/comments`).
    *   Allows us to write standard Node.js code to handle logic.
*   **Database**: **Vercel Postgres** (powered by Neon).
    *   Serverless-ready SQL database.
    *   Scales to zero (cost-effective).
*   **ORM (Object-Relational Mapping)**: **Drizzle ORM**.
    *   Lightweight, SQL-like syntax.
    *   Excellent for "LLM-first" dev because the schema definitions are clear and the query syntax is intuitive for AI to generate.
*   **Email**: **Resend**.
    *   API-first email sending.
    *   We build the HTML templates, Resend handles the delivery.

---

## Feature Implementation Plan

### 1. Custom Comments System
**Why build it?** Great introduction to CRUD (Create, Read, Update, Delete) operations and database relationships.

*   **Database Schema**:
    *   `comments` table: `id`, `post_slug`, `author_name`, `content`, `created_at`, `is_approved`.
*   **API Endpoints**:
    *   `GET /api/comments?slug=post-1`: Fetch approved comments.
    *   `POST /api/comments`: Submit a new comment (initially `is_approved=false` or auto-approve).
*   **Frontend**:
    *   Build a custom form in HTML/CSS.
    *   Use `fetch()` to POST data to our API.
    *   Render the returned list of comments.

### 2. Contact Form
**Why build it?** Teaches API integration (Resend) and server-side validation.

*   **API Endpoint**:
    *   `POST /api/contact`: Receives `{ name, email, message }`.
*   **Logic**:
    *   Validate inputs.
    *   Call Resend API to email `derek@...`.
    *   Return success/error to frontend.

### 3. "Like" / Reaction Button
**Why build it?** Simple "write-heavy" interaction.

*   **Database Schema**:
    *   `post_reactions` table: `slug`, `reaction_type`, `count`.
*   **Logic**:
    *   User clicks "Heart".
    *   `POST /api/react`.
    *   Database increments counter.
    *   UI updates instantly (optimistic UI).

---

## Why this approach is viable & powerful
1.  **Control**: You own the data. No "exporting from Disqus" later.
2.  **Cost**: Vercel and Neon free tiers are generous.
3.  **Learning**: You will understand exactly how data flows from a button click -> API -> Database -> Screen.
4.  **LLM Synergy**: This stack is perfect for LLMs. You can say "Create a table for comments and an API route to save them," and the LLM can generate the exact SQL and Node.js code needed.

## Next Steps
1.  **Initialize Database**: Set up Vercel Postgres.
2.  **Install Drizzle**: Configure the ORM.
3.  **Build First Feature**: Start with the **Contact Form** (easiest) or **Comments** (most rewarding).
