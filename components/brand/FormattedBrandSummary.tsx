'use client'

interface FormattedBrandSummaryProps {
  summary: string;
  brandName: string;
}

export default function FormattedBrandSummary({ summary, brandName }: FormattedBrandSummaryProps) {
  if (!summary) {
    return null;
  }

  // Format the summary into sections
  const formatSummary = (text: string, brand: string) => {
    const sections: Array<{ title: string; content: string }> = [];
    let priceInfo = '';

    // Split by line breaks and filter empty lines
    const lines = text.split('\n').filter(line => line.trim());
    let currentSection = '';
    let currentContent: string[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Check for section headers
      if (trimmedLine.includes('Start of operations in India:')) {
        // Save previous section
        if (currentSection && currentContent.length > 0) {
          sections.push({
            title: currentSection,
            content: currentContent.join(' ').trim()
          });
        }
        currentSection = 'Start of operations in India:';
        currentContent = [];
      } else if (trimmedLine.includes('Market Share:')) {
        // Save previous section
        if (currentSection && currentContent.length > 0) {
          sections.push({
            title: currentSection,
            content: currentContent.join(' ').trim()
          });
        }
        currentSection = 'Market Share:';
        currentContent = [];
      } else if (trimmedLine.includes('Key Aspects:')) {
        // Save previous section
        if (currentSection && currentContent.length > 0) {
          sections.push({
            title: currentSection,
            content: currentContent.join(' ').trim()
          });
        }
        currentSection = 'Key Aspects:';
        currentContent = [];
      } else if (trimmedLine.includes('Competitors:')) {
        // Save previous section
        if (currentSection && currentContent.length > 0) {
          sections.push({
            title: currentSection,
            content: currentContent.join(' ').trim()
          });
        }
        currentSection = 'Competitors:';
        currentContent = [];
      } else if (trimmedLine.includes('car price starts at') || 
                 trimmedLine.includes('cheapest model') ||
                 trimmedLine.includes('most expensive model')) {
        // Extract price information for separate section
        priceInfo = trimmedLine;
      } else if (currentSection) {
        // Add to current section content
        currentContent.push(trimmedLine);
      } else {
        // First paragraph (overview) - if no section started yet
        if (!sections.length) {
          sections.push({
            title: `${brand} Cars`,
            content: trimmedLine
          });
        }
      }
    }

    // Add final section
    if (currentSection && currentContent.length > 0) {
      sections.push({
        title: currentSection,
        content: currentContent.join(' ').trim()
      });
    }

    // Add price info as separate section if exists
    if (priceInfo) {
      sections.push({
        title: `${brand} Cars Price List (October 2025) in India`,
        content: priceInfo
      });
    }

    return sections;
  };

  const sections = formatSummary(summary, brandName);

  return (
    <div className="space-y-6">
      {sections.map((section, index) => (
        <div key={index} className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">
            {section.title}
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {section.content}
          </p>
        </div>
      ))}
    </div>
  );
}
