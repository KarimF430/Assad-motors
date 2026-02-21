const fs = require('fs');

const carModelPath = 'components/car-model/CarModelPage.tsx';
let carModelLines = fs.readFileSync(carModelPath, 'utf8').split('\n');

const sec2StartIdx = carModelLines.findIndex(l => l.includes('{/* Section 2: EMI Calculator + AD Banner + Model Highlights */}'));
const adBanner11Start = carModelLines.findIndex(l => l.includes('{/* Section 11: AD Banner */}'));

if (sec2StartIdx !== -1 && adBanner11Start !== -1) {
    // We want to capture everything from Section 2 start up to Section 11 start.
    const originalBlock = carModelLines.slice(sec2StartIdx, adBanner11Start).join('\n');
    console.log('Successfully captured block of size ' + originalBlock.length + ' characters.');

    // We need to carefully extract the HTML components to restructure them into our grid.
    
    // Step 1: Extract EMI and Ad Carousel
    const emiRegex = /<\!-- EMI Calculator -->.*?<\/div>/s; // We can't rely on regex for nested divs.
    
    // Let's do string replacement instead.
    // Wrap the entire block in the new PageSection + Grid.
    
    // We will find and replace the individual <PageSection> wrappers to nullify them or morph them.
    // It's safer to just inject wrappers around the specific components. But wait, we need to split the "Highlights" from the "EMI & Ad" because they are currently in the same `space-y-8` div.
    
    // Instead of regex hacking a 500-line chunk, let's write a targeted AST-like replacement or just use precise string splits.
    
    // The structure:
    // {/* Section 2: EMI Calculator + AD Banner + Model Highlights */}
    // <PageSection>
    //   <div id="emi-highlights" className="space-y-8">
    //     {/* EMI Calculator */} ...
    //     {/* Ad Banner */} ...
    //     {/* Model Highlights */} ...
    //   </div>
    // </PageSection>

    // Since we need to put EMI and Ad on the right side, and Highlights, Features, Similar Cars, FAQ on the left...
    // Let's dynamically find the boundaries of EMI, AD, Highlights using indexOf and matching closing tags.
    
    function getOuterOuterDiv(str, startStr) {
        const start = str.indexOf(startStr);
        if (start === -1) return { start: -1, length: 0 };
        
        let i = start;
        let depth = 0;
        let firstDivFound = false;
        
        while (i < str.length) {
            const nextOpen = str.indexOf('<div', i);
            const nextClose = str.indexOf('</div', i);
            
            if (nextOpen === -1 && nextClose === -1) break;
            
            if (nextOpen !== -1 && nextOpen < nextClose) {
                depth++;
                firstDivFound = true;
                i = nextOpen + 4;
            } else if (nextClose !== -1) {
                depth--;
                i = nextClose + 6; // length of '</div>'
                if (depth === 0 && firstDivFound) {
                    return { start, content: str.substring(start, i), end: i };
                }
            }
        }
        return { start: -1, content: "" };
    }

    const emiBlock = getOuterOuterDiv(originalBlock, '{/* EMI Calculator */}');
    const adBannerBlock = getOuterOuterDiv(originalBlock, '{/* Ad Banner */}');
    const highlightsBlock = getOuterOuterDiv(originalBlock, '{/* Model Highlights */}');
    
    const keyFeaturesBlockRaw = originalBlock.substring(originalBlock.indexOf('{/* Section 3: Key Features Spec Sheet */}'), originalBlock.indexOf('{/* Section 4: Similar Cars You Might Like */}'));
    const similarCarsBlockRaw = originalBlock.substring(originalBlock.indexOf('{/* Section 4: Similar Cars You Might Like */}'), originalBlock.indexOf('{/* Section 5: FAQ & Reviews */}'));
    const faqBlockRaw = originalBlock.substring(originalBlock.indexOf('{/* Section 5: FAQ & Reviews */}'), originalBlock.length);

    // Clean out the PageSections from the extracted blocks to prevent nested padding
    function stripPageSection(str) {
        return str.replace(/<PageSection[^>]*>/g, '').replace(/<\/PageSection>/g, '');
    }

    const newLayout = `
        {/* Responsive Desktop Side-by-Side Grid Layout */}
        <PageSection background="white" maxWidth="7xl">
            <div className="flex flex-col gap-y-8 md:grid md:grid-cols-12 md:gap-8 lg:gap-12 relative">
                
                {/* 
                  MOBILE: These items will stack vertically (order 1-6)
                  DESKTOP: They will be grouped into the left/right columns via 'contents'
                */}
                
                {/* --- RIGHT COLUMN (Desktop) --- */}
                <div className="contents md:block md:col-span-5 lg:col-span-4 md:order-2">
                    <div className="md:sticky md:top-24 space-y-6">
                        {/* ITEM 1 (Mobile Order 1) */}
                        <div className="order-1 md:order-none w-full">
                            ${emiBlock.content}
                        </div>
                        {/* ITEM 2 (Mobile Order 2) */}
                        <div className="order-2 md:order-none w-full">
                            ${adBannerBlock.content}
                        </div>
                    </div>
                </div>

                {/* --- LEFT COLUMN (Desktop) --- */}
                <div className="contents md:block md:col-span-7 lg:col-span-8 md:order-1">
                    <div className="space-y-8 md:space-y-12">
                        {/* ITEM 3 (Mobile Order 3) */}
                        <div className="order-3 md:order-none w-full">
                            ${highlightsBlock.content}
                        </div>
                        
                        {/* ITEM 4 (Mobile Order 4) */}
                        <div className="order-4 md:order-none w-full py-2">
                            ${stripPageSection(keyFeaturesBlockRaw)}
                        </div>
                        
                        {/* ITEM 5 (Mobile Order 5) */}
                        <div className="order-5 md:order-none w-full">
                            ${stripPageSection(similarCarsBlockRaw)}
                        </div>
                        
                        {/* ITEM 6 (Mobile Order 6) */}
                        <div className="order-6 md:order-none w-full">
                            ${stripPageSection(faqBlockRaw)}
                        </div>
                    </div>
                </div>

            </div>
        </PageSection>
    `;

    carModelLines.splice(sec2StartIdx, adBanner11Start - sec2StartIdx, newLayout);
    fs.writeFileSync(carModelPath, carModelLines.join('\n'));
    console.log("Successfully replaced layout.");
} else {
    console.log('Markers not found');
}
