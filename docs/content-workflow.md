# Content Management Walkthrough

I have refactored your project to make content management more reliable and easier to maintain, with full support for multilingual posts.

## Changes Made
- **Moved Content:** Post content is no longer stored in `src/data/posts.js`.
- **New Directory:** Created `src/data/content/` to hold individual HTML files for each post.
- **Imports:** `src/data/posts.js` now imports these HTML files.
- **Multilingual Support:** The import script automatically detects and groups language variants.

## How to Add a New Post (Automated)

I have created a script to automate the entire process for you, with support for both single-language and multilingual posts.

### Single-Language Post

1.  **Prepare Files:**
    - Name your HTML file and image file with the same name (e.g., `my-trip.html` and `my-trip.jpg`).
    - Ensure your HTML has an `<h1>` for the title and `<p>` tags for content.

2.  **Drop Files:**
    - Drag and drop both files into the `_input/` folder in your project root.

3.  **Run Script:**
    - Open your terminal and run:
        ```bash
        npm run import-posts
        ```

4.  **Done!**
    - The script will create a post with English-only content.

### Multilingual Post

1.  **Prepare Files:**
    - Name your files using language suffixes:
      - `my-trip.html` (English - default)
      - `my-trip.vi.html` (Vietnamese)
      - `my-trip.es.html` (Spanish)
    - Include ONE shared image: `my-trip.jpg`
    - Each HTML file should have its own `<h1>` title and content in that language.

2.  **Drop Files:**
    - Drag and drop all HTML files and the image into the `_input/` folder.

3.  **Run Script:**
    - Open your terminal and run:
        ```bash
        npm run import-posts
        ```

4.  **Done!**
    - The script will:
        - **Group** all language variants into a single post
        - **Extract** title and excerpt from each language version
        - **Share** the same image across all languages
        - **Create** a complete `translations` object in `posts.js`

### Adding Translations to Existing Posts

You can add translations to posts that currently only have English:

1.  **Create Translation:**
    - For example, to add Vietnamese to `why-the-name`:
    - Create `why-the-name.vi.html` with Vietnamese content

2.  **Drop File:**
    - Place `why-the-name.vi.html` in `_input/`

3.  **Run Script:**
    - Run `npm run import-posts`

4.  **Done!**
    - The script will merge the new translation into the existing post
    - English content remains unchanged

## Internal Links in Multilingual Posts

When writing post content that links to other pages (posts, about, home), use **relative paths without language prefixes**. The website's routing system automatically handles language switching.

### ✅ Correct Link Format

```html
<!-- Link to another post -->
<a href="/posts/why-the-name">Read more about our philosophy</a>

<!-- Link to about page -->
<a href="/about">Learn more about me</a>

<!-- Link to home -->
<a href="/">Back to home</a>
```

### ❌ Incorrect Link Format

```html
<!-- DON'T hardcode language prefixes -->
<a href="/en/posts/why-the-name">...</a>
<a href="/vi/about">...</a>
```

### How It Works

When a user switches languages (e.g., from English to Vietnamese):
- The URL changes from `/posts/my-post` to `/vi/posts/my-post`
- All internal links automatically update to include `/vi/` prefix
- If a translation doesn't exist, the site shows the English version (graceful fallback)

## Supported Languages

Currently supported language codes:
- `en` - English (default, no suffix needed)
- `vi` - Vietnamese (use `.vi.html` suffix)
- `es` - Spanish (use `.es.html` suffix)

To add more languages, update the `SUPPORTED_LANGUAGES` array in `scripts/import-posts.js`.

## How to Add a New Post (Manual)

If you prefer to do it manually:

1.  **Create the HTML File(s):**
    - Create files in `src/data/content/`, e.g., `my-new-post.html`
    - For additional languages: `my-new-post.vi.html`, `my-new-post.es.html`
    - Paste your raw HTML content into each file.

2.  **Register the Post:**
    - Open `src/data/posts.js`.
    - Import your new files at the top:
        ```javascript
        import myNewPostEn from './content/my-new-post.html?raw';
        import myNewPostVi from './content/my-new-post.vi.html?raw';
        ```
    - Add a new entry to the `posts` array with a `translations` object.


## How to Remove a Post
I have created a script to cleanly remove a post and its associated files.

**Command:**
```bash
npm run remove-post <post-id>
```

**Example:**
```bash
npm run remove-post my-trip
```

**What it does:**
- Deletes all HTML files (all language variants) from `src/data/content/`.
- Deletes the image file from `public/images/posts/`.
- Removes all imports and the post entry from `src/data/posts.js`.


## How to Clean Content (Utility)

I've also added a dedicated cleaning tool that you can use on **any** file or directory.

**Command:**
```bash
npm run clean-html <path>
```

**Examples:**
- Clean a single file: `npm run clean-html _input/my-post.html`
- Clean the entire content folder: `npm run clean-html src/data/content`

**What it does:**
- Removes `style="..."` attributes.
- Removes HTML comments.
- Removes empty paragraphs.

## How to Edit the About Page
The content for the "About" page is now located in:
`src/data/content/about.html`

You can edit this file directly to change the text or image on the About page.


## Verification
I have verified that the existing posts (English, Vietnamese, Spanish) are correctly extracted and linked. The site should function exactly as before, but with a much cleaner codebase and enhanced multilingual support.

