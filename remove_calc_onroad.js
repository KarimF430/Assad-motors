const fs = require('fs');
const path = require('path');

function readDirRecursive(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!['node_modules', '.next', '.git'].includes(file)) {
        readDirRecursive(fullPath, fileList);
      }
    } else {
      if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
        fileList.push(fullPath);
      }
    }
  }
  return fileList;
}

const files = readDirRecursive('./');
let changedTotal = 0;

for (const file of files) {
  let initialContent = fs.readFileSync(file, 'utf8');
  let content = initialContent;

  // Remove imports for calculateOnRoadPrice
  content = content.replace(/import\s*{\s*(?:calculateOnRoadPrice|OnRoadPriceBreakup)(?:,\s*(?:calculateOnRoadPrice|OnRoadPriceBreakup))?\s*}\s*from\s*['"]@\/lib\/rto-data-optimized['"];?\n?/g, '');
  content = content.replace(/import\s*{\s*(?:calculateOnRoadPrice|OnRoadPriceBreakup)(?:,\s*(?:calculateOnRoadPrice|OnRoadPriceBreakup))?\s*}\s*from\s*['"]@\/lib\/rto-data['"];?\n?/g, '');

  content = content.replace(/const breakup = calculateOnRoadPrice(.*);/g, 'const breakup = { totalOnRoadPrice: $1.split(",")[0] };');

  // Specific for price breakup page which might return it directly
  content = content.replace(/return calculateOnRoadPrice\((.*)\)/g, 'return { totalOnRoadPrice: $1.split(",")[0] }');

  if (content !== initialContent) {
    fs.writeFileSync(file, content);
    changedTotal++;
  }
}

console.log(`Updated ${changedTotal} files.`);
