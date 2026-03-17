const fs = require('fs');
const path = require('path');

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

        // 1. Fix event handlers
        newContent = newContent.replace(/\(e:(?:\s*React\.)?[A-Z]\w+Event\)/g, '(e)');
        newContent = newContent.replace(/\(e\s*:\s*any\)/g, '(e)');
        newContent = newContent.replace(/\(e\.FormEvent\)/g, '(e)');
        newContent = newContent.replace(/\(e\.MouseEvent\)/g, '(e)');
        newContent = newContent.replace(/\(e\.ChangeEvent\)/g, '(e)');

        // 2. Fix body.stringify -> body: JSON.stringify
        // Only if it looks like a fetch option
        newContent = newContent.replace(/body\.stringify/g, 'body: JSON.stringify');

        // 3. Fix parentheses-casts like (user).role or (session as any).user
        newContent = newContent.replace(/\(([a-zA-Z0-9_]+)\)\.([a-zA-Z0-9_]+)/g, '$1.$2');

        // 4. Fix destroyed Math.ceil
        newContent = newContent.replace(/([a-zA-Z0-9_]+)\.ceil\(/g, (match, p1) => {
            if (p1 === 'Math') return match;
            return 'Math.ceil(';
        });

        // 5. Fix remaining ! non-null assertions
        // Only at end of words not followed by = (to avoid !=)
        newContent = newContent.replace(/([a-zA-Z0-9_]+)!(?![=])/g, '$1');

        // 6. Fix broken type annotations in parameters like (id: string) -> (id)
        // But be careful not to match object keys
        newContent = newContent.replace(/\(([a-zA-Z0-9_,\s]+):\s*(?:string|number|boolean|any|void|ReactNode|React\.ReactNode|[\w\[\]]+)\)/g, '($1)');

        // 7. Fix destructuring corruption like ({ params }: { params: { id: string } })
        // If it was partially stripped it might look like ({ params }: { params{ id }> })
        newContent = newContent.replace(/\{ params \}:\s*\{ params\{ id \}>\s*\}/g, '{ params }');
        newContent = newContent.replace(/\{ params \}:\s*\{ params\s*\{ id \}\s*>\s*\}/g, '{ params }');

        if (newContent !== content) {
            console.log(`Fixing: ${filePath}`);
            fs.writeFileSync(filePath, newContent);
        }
    }
});
