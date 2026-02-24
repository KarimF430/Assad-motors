const fs = require('fs');
const path = require('path');

const DIRECTORIES_TO_SCAN = ['app', 'components', 'lib', 'public', 'backend'];
const IGNORE_DIRS = ['node_modules', '.next', '.git', 'dist'];

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // Conversions:
    // 1. "Gadizone" -> "Assad Motors" (Title Case)
    // 2. "GadiZone" -> "Assad Motors" (CamelCase/PascalCase)
    // 3. "gadizone" -> "assadmotors" (lower case, usually for URLs and emails)
    // 4. "GADIZONE" -> "ASSAD_MOTORS" (UPPER CASE, usually for env vars)

    content = content.replace(/GadiZone/g, 'Assad Motors');
    content = content.replace(/Gadizone/g, 'Assad Motors');
    content = content.replace(/gadizone/g, 'assadmotors');
    content = content.replace(/GADIZONE/g, 'ASSAD_MOTORS');

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

function scanDirectory(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (!IGNORE_DIRS.includes(file)) {
                scanDirectory(fullPath);
            }
        } else if (stat.isFile()) {
            // only process text-based files
            if (/\.(js|jsx|ts|tsx|html|css|json|md|yaml|yml|env|txt)$/.test(file) || file === '.env') {
                try {
                    replaceInFile(fullPath);
                } catch (e) {
                    console.error(`Error processing file ${fullPath}:`, e);
                }
            }
        }
    }
}

DIRECTORIES_TO_SCAN.forEach(dir => {
    const fullDirPath = path.join(__dirname, dir);
    if (fs.existsSync(fullDirPath)) {
        scanDirectory(fullDirPath);
    }
});

console.log('Replacement complete.');
