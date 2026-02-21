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

  // 1. Remove import
  content = content.replace(/import\s*{\s*useOnRoadPrice\s*}\s*from\s*['"]@\/hooks\/useOnRoadPrice['"];?\n?/g, '');

  // 2. Remove hook calls
  // `const { onRoadPrice, isOnRoadMode, city } = useOnRoadPrice({...})`
  // `const { onRoadPrice, isOnRoadMode } = useOnRoadPrice({...})`
  content = content.replace(/const\s*{\s*onRoadPrice[^}]*}\s*=\s*useOnRoadPrice\([\s\S]*?\);?/g, '');

  // 3. Replace startingPriceData calls
  content = content.replace(/const\s+startingPriceData\s*=\s*useOnRoadPrice\([\s\S]*?\);?/g, 'const startingPriceData = { isOnRoadMode: false, onRoadPrice: 0 };');
  content = content.replace(/const\s+endingPriceData\s*=\s*useOnRoadPrice\([\s\S]*?\);?/g, 'const endingPriceData = { isOnRoadMode: false, onRoadPrice: 0 };');

  // 4. Replace variable usages left hanging
  // e.g. isOnRoadMode ? onRoadPrice : car.startingPrice
  content = content.replace(/isOnRoadMode\s*\?\s*onRoadPrice\s*:\s*([\w.]+)/g, '$1');

  // Some price labels:
  // isOnRoadMode ? `On-Road Price in ${city}` : 'Ex-Showroom Price'
  content = content.replace(/isOnRoadMode\s*\?\s*`On-Road Price[^`]*`\s*:\s*'Ex-Showroom Price'/ig, "'Price'");
  content = content.replace(/isOnRoadMode\s*\?\s*'On-Road Price'\s*:\s*'Ex-Showroom Price'/ig, "'Price'");
  content = content.replace(/isOnRoadMode\s*\?\s*`On-Road Price[^`]*`\s*:\s*priceLabel/ig, "priceLabel");

  // 5. Replace text strings On-Road Price -> Price
  content = content.replace(/'On-Road Price'/g, "'Price'");
  content = content.replace(/>On-Road Price</g, '>Price<');
  content = content.replace(/>Get On-Road Price</g, '>View Details<');
  content = content.replace(/On-Road Price in Mumbai/g, 'Price');

  if (content !== initialContent) {
    fs.writeFileSync(file, content);
    changedTotal++;
  }
}

console.log(`Updated ${changedTotal} files.`);
