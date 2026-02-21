#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

const mdFile = process.argv[2];
const outputPdf = process.argv[3] || mdFile.replace('.md', '.pdf');

console.log('Converting markdown to HTML...');

const mdContent = fs.readFileSync(mdFile, 'utf8');

const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; line-height: 1.6; max-width: 1000px; margin: 0 auto; padding: 40px 20px; font-size: 11pt; }
        h1 { color: #1a1a1a; border-bottom: 3px solid #e74c3c; padding-bottom: 10px; margin-top: 30px; font-size: 28pt; }
        h2 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 6px; margin-top: 25px; font-size: 20pt; }
        h3 { color: #34495e; margin-top: 20px; font-size: 16pt; }
        h4 { color: #555; margin-top: 15px; font-size: 14pt; }
        code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; font-family: Monaco, monospace; font-size: 10pt; color: #e74c3c; }
        pre { background: #2d2d2d; color: #f8f8f2; padding: 15px; border-radius: 5px; overflow-x: auto; font-size: 9pt; line-height: 1.4; }
        pre code { background: none; color: #f8f8f2; padding: 0; }
        ul, ol { margin-left: 20px; }
        li { margin-bottom: 5px; }
        hr { border: none; border-top: 2px solid #e1e4e8; margin: 30px 0; }
    </style>
</head>
<body>
${convertMd(mdContent)}
</body>
</html>`;

function convertMd(md) {
    return md
        .replace(/```[\s\S]*?```/g, m => `<pre><code>${m.slice(3, -3)}</code></pre>`)
        .replace(/^#### (.*)$/gim, '<h4>$1</h4>')
        .replace(/^### (.*)$/gim, '<h3>$1</h3>')
        .replace(/^## (.*)$/gim, '<h2>$1</h2>')
        .replace(/^# (.*)$/gim, '<h1>$1</h1>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/^---$/gim, '<hr>')
        .replace(/^[*-] (.+)$/gim, '<li>$1</li>')
        .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
        .split('\n\n').map(p => p.trim() && !p.startsWith('<') ? `<p>${p}</p>` : p).join('\n');
}

const htmlFile = outputPdf.replace('.pdf', '.html');
fs.writeFileSync(htmlFile, html);
console.log('✅ HTML file created:', htmlFile);
console.log('\nYou can now:');
console.log('1. Open the HTML file in Safari/Chrome and Print to PDF');
console.log('2. Or install pandoc: brew install pandoc');
console.log('   Then run: pandoc ' + htmlFile + ' -o ' + outputPdf);
