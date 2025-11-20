import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const target = process.argv[2];

if (!target) {
    console.error('Usage: npm run clean-html <path-to-file-or-directory>');
    process.exit(1);
}

const absoluteTarget = path.resolve(process.cwd(), target);

if (!fs.existsSync(absoluteTarget)) {
    console.error(`Error: Path not found: ${absoluteTarget}`);
    process.exit(1);
}

function cleanContent(content) {
    // Remove style attributes
    content = content.replace(/ style="[^"]*"/g, '');
    content = content.replace(/ style='[^']*'/g, '');

    // Remove HTML comments
    content = content.replace(/<!--[\s\S]*?-->/g, '');

    // Remove empty paragraphs (including those with just whitespace or &nbsp;)
    content = content.replace(/<p>\s*<\/p>/g, '');
    content = content.replace(/<p>&nbsp;<\/p>/g, '');

    // Remove multiple blank lines
    content = content.replace(/\n\s*\n/g, '\n\n');

    return content.trim() + '\n';
}

function processFile(filePath) {
    if (!filePath.endsWith('.html')) return;

    console.log(`Cleaning ${path.relative(process.cwd(), filePath)}...`);
    const content = fs.readFileSync(filePath, 'utf8');
    const cleaned = cleanContent(content);
    fs.writeFileSync(filePath, cleaned);
}

function processDirectory(dirPath) {
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else {
            processFile(fullPath);
        }
    });
}

const stat = fs.statSync(absoluteTarget);
if (stat.isDirectory()) {
    processDirectory(absoluteTarget);
} else {
    processFile(absoluteTarget);
}

console.log('Done!');
