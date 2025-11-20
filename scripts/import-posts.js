import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DIR = path.join(__dirname, '../_input');
const CONTENT_DIR = path.join(__dirname, '../src/data/content');
const IMAGES_DIR = path.join(__dirname, '../public/images/posts');
const POSTS_FILE = path.join(__dirname, '../src/data/posts.js');

// Supported languages
const SUPPORTED_LANGUAGES = ['en', 'vi', 'es'];

// Ensure directories exist
if (!fs.existsSync(CONTENT_DIR)) fs.mkdirSync(CONTENT_DIR, { recursive: true });
if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

function camelCase(str) {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

/**
 * Parse language code from filename
 * Examples: 
 *   'my-post.html' -> { baseId: 'my-post', lang: 'en' }
 *   'my-post.vi.html' -> { baseId: 'my-post', lang: 'vi' }
 *   'my-post.es.html' -> { baseId: 'my-post', lang: 'es' }
 */
function parseLanguageFromFilename(filename) {
    const nameWithoutExt = filename.replace('.html', '');

    // Check if filename ends with a supported language code
    for (const lang of SUPPORTED_LANGUAGES) {
        if (nameWithoutExt.endsWith(`.${lang}`)) {
            const baseId = nameWithoutExt.substring(0, nameWithoutExt.length - lang.length - 1);
            return { baseId, lang };
        }
    }

    // Default to English
    return { baseId: nameWithoutExt, lang: 'en' };
}

/**
 * Group HTML files by their base ID
 * Returns: { 'post-id': ['post-id.html', 'post-id.vi.html'], ... }
 */
function groupFilesByBaseId(htmlFiles) {
    const groups = {};

    for (const file of htmlFiles) {
        const { baseId } = parseLanguageFromFilename(file);
        if (!groups[baseId]) {
            groups[baseId] = [];
        }
        groups[baseId].push(file);
    }

    return groups;
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

    // Group files by base ID
    const fileGroups = groupFilesByBaseId(htmlFiles);

    // Process each post (which may have multiple language variants)
    for (const [baseId, groupFiles] of Object.entries(fileGroups)) {
        console.log(`\nProcessing post: ${baseId}`);
        console.log(`  Found ${groupFiles.length} language variant(s): ${groupFiles.join(', ')}`);

        const translations = {};
        const importVars = {};
        let sharedImagePath = '/images/about.jpg'; // Default

        // Process each language variant
        for (const file of groupFiles) {
            const { lang } = parseLanguageFromFilename(file);
            const inputPath = path.join(INPUT_DIR, file);
            const contentPath = path.join(CONTENT_DIR, file);

            console.log(`  Processing ${lang}: ${file}...`);

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
            console.log(`    -> Moved and cleaned HTML to src/data/content/${file}`);

            // Store translation data
            const varName = camelCase(baseId) + (lang === 'en' ? 'En' : lang.charAt(0).toUpperCase() + lang.slice(1));
            importVars[lang] = varName;

            translations[lang] = {
                title: title.replace(/'/g, "\\'"),
                excerpt: excerpt.replace(/'/g, "\\'"),
                varName
            };

            // Remove original HTML file
            fs.unlinkSync(inputPath);
        }

        // Handle Image (shared across all language variants)
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
        let foundImage = null;

        for (const ext of imageExtensions) {
            const imgFile = baseId + ext;
            if (fs.existsSync(path.join(INPUT_DIR, imgFile))) {
                foundImage = imgFile;
                break;
            }
        }

        if (foundImage) {
            const srcImg = path.join(INPUT_DIR, foundImage);
            const destImg = path.join(IMAGES_DIR, foundImage);
            fs.renameSync(srcImg, destImg);
            sharedImagePath = `/images/posts/${foundImage}`;
            console.log(`  -> Moved image to public/images/posts/${foundImage}`);
        }

        // Check if post already exists in posts.js
        const idRegex = new RegExp(`id:\\s*'${baseId}'`);
        if (idRegex.test(postsFileContent)) {
            console.log(`  -> Post '${baseId}' already exists. Merging translations...`);

            // Add imports for new language variants
            for (const [lang, varName] of Object.entries(importVars)) {
                const file = lang === 'en' ? `${baseId}.html` : `${baseId}.${lang}.html`;
                const importRegex = new RegExp(`import\\s+${varName}\\s+from\\s+'\\./content/${file}\\?raw';`);
                if (!importRegex.test(postsFileContent)) {
                    importsToAdd += `import ${varName} from './content/${file}?raw';\n`;
                }
            }

            // Find and update the post object
            const objectStartRegex = new RegExp(`{\\s*id:\\s*'${baseId}'`, 'g');
            const match = objectStartRegex.exec(postsFileContent);

            if (match) {
                const startIndex = match.index;
                let braceCount = 1;
                let endIndex = startIndex + match[0].length;
                while (braceCount > 0 && endIndex < postsFileContent.length) {
                    if (postsFileContent[endIndex] === '{') braceCount++;
                    if (postsFileContent[endIndex] === '}') braceCount--;
                    endIndex++;
                }

                const objectBlock = postsFileContent.substring(startIndex, endIndex);
                let newObjectBlock = objectBlock;

                // Update image if we found a new one
                if (foundImage) {
                    newObjectBlock = newObjectBlock.replace(/image:\s*(['"])([\\s\\S]*?)\1/, `image: '${sharedImagePath}'`);
                }

                // Update or add translations
                for (const [lang, data] of Object.entries(translations)) {
                    const langRegex = new RegExp(`${lang}:\\s*{[^}]*}`, 's');
                    if (langRegex.test(newObjectBlock)) {
                        // Update existing translation
                        newObjectBlock = newObjectBlock.replace(
                            langRegex,
                            `${lang}: {\n                title: '${data.title}',\n                excerpt: '${data.excerpt}',\n                content: ${data.varName}\n            }`
                        );
                    } else {
                        // Add new translation (insert before closing brace of translations object)
                        const translationsEndRegex = /(\s*)(}\s*},)/;
                        newObjectBlock = newObjectBlock.replace(
                            translationsEndRegex,
                            `,\n            ${lang}: {\n                title: '${data.title}',\n                excerpt: '${data.excerpt}',\n                content: ${data.varName}\n            }$1$2`
                        );
                    }
                }

                postsFileContent = postsFileContent.replace(objectBlock, newObjectBlock);
            }

        } else {
            // New Post
            console.log(`  -> Creating new post '${baseId}'`);

            // Add imports
            for (const [lang, varName] of Object.entries(importVars)) {
                const file = lang === 'en' ? `${baseId}.html` : `${baseId}.${lang}.html`;
                importsToAdd += `import ${varName} from './content/${file}?raw';\n`;
            }

            const today = new Date().toISOString().split('T')[0];

            // Build translations object
            let translationsStr = '';
            for (const [lang, data] of Object.entries(translations)) {
                translationsStr += `            ${lang}: {
                title: '${data.title}',
                excerpt: '${data.excerpt}',
                content: ${data.varName}
            },\n`;
            }

            postsToAdd += `    {
        id: '${baseId}',
        date: '${today}',
        image: '${sharedImagePath}',
        translations: {
${translationsStr}        }
    },\n`;
        }
    }

    // Inject/Update posts.js
    if (importsToAdd) {
        postsFileContent = postsFileContent.replace('// -- IMPORTS --', importsToAdd + '// -- IMPORTS --');
    }
    if (postsToAdd) {
        postsFileContent = postsFileContent.replace('// -- POSTS --', '// -- POSTS --\n' + postsToAdd);
    }

    // Write back changes
    fs.writeFileSync(POSTS_FILE, postsFileContent);
    console.log('\n✅ Successfully updated src/data/posts.js');
}

processFiles();
