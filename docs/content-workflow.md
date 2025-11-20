# Content Management Walkthrough

I have refactored your project to make content management more reliable and easier to maintain.

## Changes Made
- **Moved Content:** Post content is no longer stored in `src/data/posts.js`.
- **New Directory:** Created `src/data/content/` to hold individual HTML files for each post.
- **Imports:** `src/data/posts.js` now imports these HTML files.

## How to Add a New Post (Automated)

I have created a script to automate the entire process for you.

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
    - The script will:
        - **Clean** your HTML (remove inline styles).
        - **Move** the HTML to `src/data/content/`.
        - **Move** the image to `public/images/posts/`.
        - **Update** `src/data/posts.js` automatically.

## How to Add a New Post (Manual)

If you prefer to do it manually:

1.  **Create the HTML File:**
    - Create a new file in `src/data/content/`, e.g., `my-new-post.html`.
    - Paste your raw HTML content into this file.

2.  **Register the Post:**
    - Open `src/data/posts.js`.
    - Import your new file at the top:
        ```javascript
        import myNewPostContent from './content/my-new-post.html?raw';
        ```
    - Add a new entry to the `posts` array.


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
- Deletes the HTML file from `src/data/content/`.
- Deletes the image file from `public/images/posts/`.
- Removes the import and post entry from `src/data/posts.js`.


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
I have verified that the existing posts (English, Vietnamese, Spanish) are correctly extracted and linked. The site should function exactly as before, but with a much cleaner codebase.
