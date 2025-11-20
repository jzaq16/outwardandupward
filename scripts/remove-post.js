import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, '../src/data/content');
const IMAGES_DIR = path.join(__dirname, '../public/images/posts');
const POSTS_FILE = path.join(__dirname, '../src/data/posts.js');

const postId = process.argv[2];

if (!postId) {
    console.error('Please provide a post ID to remove.');
    console.error('Usage: npm run remove-post <post-id>');
    process.exit(1);
}

console.log(`Removing post: ${postId}...`);

let postsFileContent = fs.readFileSync(POSTS_FILE, 'utf8');

// 1. Find the post entry to get the image path
const idRegex = new RegExp(`{\\s*id:\\s*'${postId}'`, 'g');
const match = idRegex.exec(postsFileContent);

if (!match) {
    console.error(`Post with ID '${postId}' not found in src/data/posts.js`);
    process.exit(1);
}

// Find the full object block
const startIndex = match.index;
let braceCount = 1;
let endIndex = startIndex + match[0].length;
while (braceCount > 0 && endIndex < postsFileContent.length) {
    if (postsFileContent[endIndex] === '{') braceCount++;
    if (postsFileContent[endIndex] === '}') braceCount--;
    endIndex++;
}

const objectBlock = postsFileContent.substring(startIndex, endIndex);

// Extract image path
const imageMatch = objectBlock.match(/image:\s*'(.*?)'/);
const imagePath = imageMatch ? imageMatch[1] : null;

// 2. Remove HTML file
// We need to find the filename from the import statement
// import varName from './content/filename.html?raw';
// But we don't know the varName easily.
// However, we know the convention is usually id.html or id.lang.html
// Let's try to find the import line that matches the content variable used in the object.

const contentVarMatch = objectBlock.match(/content:\s*(\w+)/);
const contentVar = contentVarMatch ? contentVarMatch[1] : null;

if (contentVar) {
    const importRegex = new RegExp(`import\\s+${contentVar}\\s+from\\s+'\\./content/(.*?)(\\?raw)?';`);
    const importMatch = postsFileContent.match(importRegex);

    if (importMatch) {
        const htmlFilename = importMatch[1];
        const htmlFilePath = path.join(CONTENT_DIR, htmlFilename);

        if (fs.existsSync(htmlFilePath)) {
            fs.unlinkSync(htmlFilePath);
            console.log(`  -> Deleted HTML file: ${htmlFilename}`);
        }

        // Remove the import line
        postsFileContent = postsFileContent.replace(importMatch[0], '');
    }
}

// 3. Remove Image (if it's in /images/posts/ and not a default)
if (imagePath && imagePath.startsWith('/images/posts/')) {
    const imageFilename = path.basename(imagePath);
    const imageFilePath = path.join(IMAGES_DIR, imageFilename);

    if (fs.existsSync(imageFilePath)) {
        fs.unlinkSync(imageFilePath);
        console.log(`  -> Deleted image file: ${imageFilename}`);
    }
}

// 4. Remove the post object from posts.js
// We also need to remove the comma after it if it exists, or before it.
// Simple approach: replace objectBlock with empty string, then clean up empty lines/commas.
postsFileContent = postsFileContent.replace(objectBlock, '');

// Clean up dangling commas or extra newlines
postsFileContent = postsFileContent.replace(/,\s*,/g, ','); // double commas
postsFileContent = postsFileContent.replace(/,\s*]/g, '\n]'); // trailing comma before array end

// Write back
fs.writeFileSync(POSTS_FILE, postsFileContent);
console.log('Successfully removed post from src/data/posts.js');
