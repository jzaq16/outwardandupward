import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DIR = path.join(__dirname, '../_input');
const CONTENT_DIR = path.join(__dirname, '../src/data/content');
const IMAGES_DIR = path.join(__dirname, '../public/images/posts');
const POSTS_FILE = path.join(__dirname, '../src/data/posts.js');

// Ensure directories exist
if (!fs.existsSync(CONTENT_DIR)) fs.mkdirSync(CONTENT_DIR, { recursive: true });
if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

function camelCase(str) {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

function processFiles() {
    const files = fs.readdirSync(INPUT_DIR);
    const htmlFiles = files.filter(file => file.endsWith('.html'));

    if (htmlFiles.length === 0) {
        console.log('No .html files found in _input/');
        return;
    }

    let postsFileContent = fs.readFileSync(POSTS_FILE, 'utf8');
    let importsToAdd = '';
    let postsToAdd = '';

    htmlFiles.forEach(file => {
        const id = path.basename(file, '.html');
        const inputPath = path.join(INPUT_DIR, file);
        const contentPath = path.join(CONTENT_DIR, file);

        console.log(`Processing ${file}...`);

        // Read and clean content
        let content = fs.readFileSync(inputPath, 'utf8');

        // Extract Title
        const titleMatch = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
        const title = titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : 'Untitled Post';

        // Extract Excerpt (first paragraph)
        const excerptMatch = content.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
        let excerpt = excerptMatch ? excerptMatch[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : '';
        if (excerpt.length > 100) excerpt = excerpt.substring(0, 100) + '...';

        // Clean HTML (remove style attributes)
        content = content.replace(/ style="[^"]*"/g, '');

        // Write cleaned content to src/data/content
        fs.writeFileSync(contentPath, content);
        console.log(`  -> Moved and cleaned HTML to src/data/content/${file}`);

        // Handle Image
        let imagePath = '/images/about.jpg'; // Default
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
        let foundImage = null;

        for (const ext of imageExtensions) {
            const imgFile = id + ext;
            if (fs.existsSync(path.join(INPUT_DIR, imgFile))) {
                foundImage = imgFile;
                break;
            }
        }

        if (foundImage) {
            const srcImg = path.join(INPUT_DIR, foundImage);
            const destImg = path.join(IMAGES_DIR, foundImage);
            fs.renameSync(srcImg, destImg);
            imagePath = `/images/posts/${foundImage}`;
            console.log(`  -> Moved image to public/images/posts/${foundImage}`);
        }

        // Check if post already exists in posts.js
        const idRegex = new RegExp(`id:\\s*'${id}'`);
        if (idRegex.test(postsFileContent)) {
            console.log(`  -> Post '${id}' already exists. Updating metadata...`);

            // 1. Find the variable name used for this file's import
            // Look for: import varName from './content/filename.html?raw';
            const importRegex = new RegExp(`import\\s+(\\w+)\\s+from\\s+'\\./content/${file}\\?raw';`);
            const importMatch = postsFileContent.match(importRegex);

            let varName;
            if (importMatch) {
                varName = importMatch[1];
            } else {
                // Import missing but post exists? Weird. Add import.
                varName = camelCase(id) + 'Content';
                importsToAdd += `import ${varName} from './content/${file}?raw';\n`;
            }

            // 2. Update the Post Object
            // We need to find the specific object block for this ID and replace fields

            // Find the start of the object
            const objectStartRegex = new RegExp(`{\\s*id:\\s*'${id}'`, 'g');
            const match = objectStartRegex.exec(postsFileContent);

            if (match) {
                const startIndex = match.index;
                // Find the closing brace of this object (simple counter)
                let braceCount = 1;
                let endIndex = startIndex + match[0].length;
                while (braceCount > 0 && endIndex < postsFileContent.length) {
                    if (postsFileContent[endIndex] === '{') braceCount++;
                    if (postsFileContent[endIndex] === '}') braceCount--;
                    endIndex++;
                }

                const objectBlock = postsFileContent.substring(startIndex, endIndex);
                let newObjectBlock = objectBlock;

                // Update Title (English) - Handle both single and double quotes
                newObjectBlock = newObjectBlock.replace(/title:\s*(['"])([\s\S]*?)\1/, `title: '${title.replace(/'/g, "\\'")}'`);
                // Update Excerpt (English)
                newObjectBlock = newObjectBlock.replace(/excerpt:\s*(['"])([\s\S]*?)\1/, `excerpt: '${excerpt.replace(/'/g, "\\'")}'`);
                // Update Image (if we found a new one)
                if (foundImage) {
                    newObjectBlock = newObjectBlock.replace(/image:\s*(['"])([\s\S]*?)\1/, `image: '${imagePath}'`);
                }

                // Replace in file content
                postsFileContent = postsFileContent.replace(objectBlock, newObjectBlock);
            }

        } else {
            // New Post
            const varName = camelCase(id) + 'Content';
            importsToAdd += `import ${varName} from './content/${file}?raw';\n`;

            const today = new Date().toISOString().split('T')[0];

            postsToAdd += `    {
        id: '${id}',
        date: '${today}',
        image: '${imagePath}',
        translations: {
            en: {
                title: '${title.replace(/'/g, "\\'")}',
                excerpt: '${excerpt.replace(/'/g, "\\'")}',
                content: ${varName}
            }
        }
    },\n`;
        }

        // Remove original HTML file
        fs.unlinkSync(inputPath);
    });

    // Inject/Update posts.js
    if (importsToAdd) {
        postsFileContent = postsFileContent.replace('// -- IMPORTS --', importsToAdd + '// -- IMPORTS --');
    }
    if (postsToAdd) {
        postsFileContent = postsFileContent.replace('// -- POSTS --', '// -- POSTS --\n' + postsToAdd);
    }

    // Write back changes (whether from updates or new additions)
    fs.writeFileSync(POSTS_FILE, postsFileContent);
    console.log('Successfully updated src/data/posts.js');
}

processFiles();
