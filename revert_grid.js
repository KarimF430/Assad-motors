const fs = require('fs');
const path = 'components/car-model/CarModelPage.tsx';

let content = fs.readFileSync(path, 'utf8');

// I will extract the core HTML blocks for EMI, AD, Highlights, KeyFeatures, Similar Cars, and FAQ.
// Then I will reconstruct them linearly.

const startMarker = '{/* Responsive Desktop Side-by-Side Grid Layout */}';
const endMarker = '{/* Section 11: AD Banner */}';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    let block = content.substring(startIndex, endIndex);

    // Instead of parsing, I will just write the original structure by extracting the inner parts.
    
    function getOuterDiv(str, marker) {
        const mIdx = str.indexOf(marker);
        if (mIdx === -1) return '';
        
        // Find the start of the div wrapping it.
        // Actually since I injected this, I know exactly what's inside.
        // Let's just use string extraction.
        
        let start = str.lastIndexOf('<div', mIdx);
        // It's wrapped in `<div className="order-...">...</div>`
        // We know what's exactly inside the order divs.
        
        // For EMI:
        const emiStart = str.indexOf('{/* EMI Calculator */}');
        const emiEnd = str.indexOf('</div>\n                        </div>\n                        {/* ITEM 2', emiStart);
        const emiContent = str.substring(emiStart, emiEnd);

        const adStart = str.indexOf('{/* Ad Banner */}');
        const adEnd = str.indexOf('</div>\n                    </div>\n                </div>\n\n                {/* --- LEFT COLUMN', adStart);
        const adContent = str.substring(adStart, adEnd);

        const hStart = str.indexOf('{/* Model Highlights */}');
        const hEnd = str.indexOf('</div>\n                        </div>\n                        \n                        {/* ITEM 4', hStart);
        const hContent = str.substring(hStart, hEnd);

        const kfStart = str.indexOf('{/* Section 3: Key Features Spec Sheet */}');
        const kfEnd = str.indexOf('</div>\n                        </div>\n                        \n                        {/* ITEM 5', kfStart);
        const kfContent = str.substring(kfStart, kfEnd);

        const scStart = str.indexOf('{/* Section 4: Similar Cars You Might Like */}');
        const scEnd = str.indexOf('</div>\n                        </div>\n                        \n                        {/* ITEM 6', scStart);
        const scContent = str.substring(scStart, scEnd);

        const faqStart = str.indexOf('{/* Section 5: FAQ & Reviews */}');
        const faqEnd = str.indexOf('</div>\n                    </div>\n                </div>\n\n            </div>\n        </PageSection>', faqStart);
        const faqContent = str.substring(faqStart, faqEnd);
        
        // Let's refine the extraction using simple regex to grab the contents of the `order-X` divs.
        
        return { emiContent, adContent, hContent, kfContent, scContent, faqContent };
    }

    const { emiContent, adContent, hContent, kfContent, scContent, faqContent } = getOuterDiv(block, '');
    
    // Fallback if extraction fails: Just regex the `order-X` contents
    let parts = {};
    for (let i = 1; i <= 6; i++) {
        const orderMarker = `{/* ITEM ${i} (Mobile Order ${i}) */}`;
        const nextOrderMarker = i === 6 ? `{/* ---` : `{/* ITEM ${i+1}`;
        const start = block.indexOf(orderMarker);
        let end = block.indexOf(nextOrderMarker, start);
        if (end === -1) end = block.indexOf('</div>\n                    </div>\n                </div>', start); // For item 2 and item 6
        
        let itemBlock = block.substring(start, end);
        // Remove the wrapping <div className="order-X ..."> and its closing </div>
        itemBlock = itemBlock.replace(/\{\/\* ITEM \d .*?\*\/\}\n\s*<div className="order-\d.*?">\n/, '');
        itemBlock = itemBlock.substring(0, itemBlock.lastIndexOf('</div>')).trim();
        parts[i] = itemBlock;
    }

    const newLayout = `
        {/* Section 2: EMI Calculator + AD Banner + Model Highlights */}
        <PageSection background="white" maxWidth="7xl">
          <div id="emi-highlights" className="space-y-8">
            ${parts[1]}
            ${parts[2]}
            ${parts[3]}
          </div>
        </PageSection>

        {/* Section 3: Key Features Spec Sheet */}
        <PageSection background="white" maxWidth="7xl">
            ${parts[4]}
        </PageSection>

        {/* Section 4: Similar Cars You Might Like */}
        <PageSection background="white" maxWidth="7xl">
            ${parts[5]}
        </PageSection>

        {/* Section 5: FAQ & Reviews */}
        <PageSection background="white" maxWidth="7xl">
            ${parts[6]}
        </PageSection>
\n`;

    const before = content.substring(0, startIndex);
    const after = content.substring(endIndex);
    fs.writeFileSync(path, before + newLayout + after);
    console.log("Successfully reverted grid layout to linear PageSections.");
} else {
    console.log("Could not find start/end markers.");
}
