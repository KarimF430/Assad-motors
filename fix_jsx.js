const fs = require('fs');
const path = 'components/car-model/CarModelPage.tsx';

let content = fs.readFileSync(path, 'utf8');

// I am going to cleanly rewrite the blocks from line 1203 to 1873.

const startMarker = '{/* Section 2: EMI Calculator + AD Banner + Model Highlights */}';
const endMarker = '{/* Section 11: AD Banner */}';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    let block = content.substring(startIndex, endIndex);

    // I will extract the inner content of each section perfectly to avoid `</div>` mismatch.
    function extractDiv(marker) {
        let mIdx = block.indexOf(marker);
        if (mIdx === -1) return '';
        // Because of the previous script, we just have the raw extracted inner divs. Let's see how they are structured.
        // Wait, the previous script took `parts[1]`, `parts[2]`, etc. which were chunks from the `order-X` divs.
        // `parts[1]` was the EMI calculator (started with `<div className="bg-white rounded-lg border border-gray-200 p-6">` and ended correctly).
        // Let's just fix the missing closing tags manually using regex.
        
        return mIdx;
    }
}

// Actually, let's just use string replacement on the exact faulty lines I saw:
// Line 1662: `</PageSection>` -> Wait, where does section 2's `<div id="emi-highlights"...>` close?
// It was missing a `</div>` for `<div id="emi-highlights" className="space-y-8">`.

// Let's replace the block from `1660` to `1666`:
// 1660:             </div>
// 1661:           </div>
// 1662:         </PageSection>
// 1663: 
// 1664:         {/* Section 3: Key Features Spec Sheet */}
// 1665:         <PageSection background="white" maxWidth="7xl">

// We need ONE MORE `</div>` before `</PageSection>` for `id="emi-highlights"`.
content = content.replace(
    '          </div>\n        </PageSection>\n\n        {/* Section 3: Key Features Spec Sheet */}',
    '          </div>\n          </div>\n        </PageSection>\n\n        {/* Section 3: Key Features Spec Sheet */}');

// The next error was `1775`.
// 1773:           
// 1774:         </div>
// 1775:         </PageSection>
// 1776: 
// 1777:         {/* Section 4: Similar Cars You Might Like */}
// 1778:         <PageSection background="white" maxWidth="7xl">

// Section 3 starts with:
// 1665:         <PageSection background="white" maxWidth="7xl">
// 1666:             {/* Section 3: Key Features Spec Sheet */}
// 1667:         <div id="features" className="py-2">
// 1668:           
// 1669:             <div className="sm:mx-2 lg:mx-0">
// We need TWO `</div>` to close `<div className="sm:mx-2 lg:mx-0">` and `<div id="features"...>`.
content = content.replace(
    '        </div>\n        </PageSection>\n\n        {/* Section 4: Similar Cars You Might Like */}',
    '          </div>\n        </div>\n        </PageSection>\n\n        {/* Section 4: Similar Cars You Might Like */}'
);

content = content.replace(
    '        </div>\n        </PageSection>\n\n        {/* Section 5: FAQ & Reviews */}',
    '        </PageSection>\n\n        {/* Section 5: FAQ & Reviews */}'
);

// Section 4 starts:
// 1778:         <PageSection background="white" maxWidth="7xl">
// 1779:             {/* Section 4: Similar Cars You Might Like */}
// 1780:         {
// ...
// 1848:           ) : null
// 1849:         }
// 1850:         </PageSection>
// 1851: 
// 1852:         {/* Section 5: FAQ & Reviews */}
// It seems fine. It returns a conditional block, no extra unclosed divs.

// Section 5 starts:
// 1853:         <PageSection background="white" maxWidth="7xl">
// 1854:             {/* Section 5: FAQ & Reviews */}
// 1855:         
// 1856:           <div className="space-y-12">
// 1857:             <div id="faq" className="scroll-mt-24">
// 1858:               <ModelFAQ 
// 1859:                 brandName={model?.brand || ''} 
// 1860:                 modelName={model?.name || ''} 
// 1861:                 faqs={model?.faqs || []} 
// 1862:               />
// 1863:             </div>
// 1864:         </PageSection>
// Wait, missing a `</div>` for `<div className="space-y-12">` !
content = content.replace(
    '            </div>\n        </PageSection>\n\n{/* Section 11: AD Banner */}',
    '            </div>\n          </div>\n        </PageSection>\n\n{/* Section 11: AD Banner */}'
);

fs.writeFileSync(path, content);
console.log("Fixed JSX syntax.");
