const fs = require('fs');
let content = fs.readFileSync('components/car-model/CarModelPage.tsx', 'utf8');

// We have extra wrapper divs like:
//                         </div>
//                         {/* ITEM 2 (Mobile Order 2) */}
//                         <div className="order-2 md:order-none w-full">
// 
// Let's just remove ALL these ITEM markers and their wrapping divs!

content = content.replace(/                        <\/div>\n                        \{\/\* ITEM \d[^]*?w-full">\n/g, '\n');
content = content.replace(/                        <\/div>\n                        \n                        \{\/\* ITEM \d[^]*?w-full">\n/g, '\n');
content = content.replace(/                        <\/div>\n                        \{\/\* ITEM \d[^]*?w-full py-2">\n/g, '\n');

// Also remove the first one
content = content.replace(/                        \{\/\* ITEM 1[^]*?w-full">\n/g, '\n');

console.log("Replaced wrapper divs");
fs.writeFileSync('components/car-model/CarModelPage.tsx', content);
