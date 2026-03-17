const fs = require('fs');
const path = require('path');

const patterns = [
    { regex: /\(e\.FormEvent\)/g, replacement: '(e)' },
    { regex: /\(e\.MouseEvent\)/g, replacement: '(e)' },
    { regex: /\(e\.ChangeEvent\)/g, replacement: '(e)' },
    { regex: /body\.stringify/g, replacement: 'body: JSON.stringify' },
    { regex: /const\s+([a-zA-Z0-9]+)\s*\{[\s\w,;!]+?\}\s*>\s*=/g, replacement: 'const $1 =' },
    { regex: /:\s*\{[\s\w,;!]+?\}\s*([=),])/g, replacement: '$1' },
    { regex: /:\s*(?:string|number|boolean|any|void|unknown|never|Promise<[^>]+>|React\.[A-Z]\w+|[A-Z]\w+(?:\[\])?)\s*[=),]/g, (match) => match.slice(-1) },
{ regex: /as\s+[\w\{][^;)]*/g, replacement: '' }
];

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

const targetDir = path.join(process.cwd(), 'src');

walkDir(targetDir, (filePath) => {
    if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content;

        // Basic replacements
        newContent = newContent.replace(/\(e\.FormEvent\)/g, '(e)');
        newContent = newContent.replace(/\(e\.MouseEvent\)/g, '(e)');
        newContent = newContent.replace(/\(e\.ChangeEvent\)/g, '(e)');
        newContent = newContent.replace(/body\.stringify/g, 'body: JSON.stringify');

        // Fix parentheses-casts like (user).role
        newContent = newContent.replace(/\(([a-zA-Z0-9_]+)\)\.([a-zA-Z0-9_]+)/g, '$1.$2');

        // Fix destroyed Math.ceil
        newContent = newContent.replace(/(\w+)\.ceil/g, (match, p1) => {
            if (p1 === 'Math') return match;
            return 'Math.ceil';
        });

        if (newContent !== content) {
            console.log(`Fixing: ${filePath}`);
            fs.writeFileSync(filePath, newContent);
        }
    }
});
