import { ContentBlock } from '@/backend/server/db/news-storage'
import Link from 'next/link'

interface ArticleRendererProps {
  blocks: ContentBlock[]
  linkedCars?: any[] // Array of enriched car data objects
}

export default function ArticleRenderer({ blocks, linkedCars = [] }: ArticleRendererProps) {

  // Function to parse markdown-style links [text](url) and convert to React elements
  const parseLinks = (text: string) => {
    if (!text) return text

    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
    const parts: (string | JSX.Element)[] = []
    let lastIndex = 0
    let match
    let key = 0

    // Reset regex lastIndex
    linkRegex.lastIndex = 0

    while ((match = linkRegex.exec(text)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index))
      }

      // Add the link
      const linkText = match[1]
      const linkUrl = match[2]

      console.log('Found link:', linkText, '→', linkUrl) // Debug log

      parts.push(
        <Link
          key={`link-${key++}`}
          href={linkUrl}
          className="text-blue-600 hover:text-blue-800 underline font-medium cursor-pointer"
          target={linkUrl.startsWith('http') ? '_blank' : undefined}
          rel={linkUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {linkText}
        </Link>
      )

      lastIndex = match.index + match[0].length
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex))
    }

    return parts.length > 0 ? parts : text
  }

  const renderBlock = (block: ContentBlock) => {
    switch (block.type) {
      case 'heading1':
        return (
          <h1 key={block.id} className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {block.content}
          </h1>
        )

      case 'heading2':
        return (
          <h2 key={block.id} className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            {block.content}
          </h2>
        )

      case 'heading3':
        return (
          <h3 key={block.id} className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
            {block.content}
          </h3>
        )

      case 'paragraph':
        return (
          <p key={block.id} className="text-gray-700 leading-relaxed mb-4">
            {parseLinks(block.content)}
          </p>
        )

      case 'image':
        return (
          <figure key={block.id} className="mb-6">
            {block.imageUrl && (
              <img
                src={block.imageUrl.startsWith('blob:')
                  ? '/api/placeholder/800/600'
                  : block.imageUrl.startsWith('/uploads')
                    ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}${block.imageUrl}`
                    : block.imageUrl
                }
                alt={block.imageCaption || 'Article image'}
                className="w-full rounded-lg"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  e.currentTarget.src = '/api/placeholder/800/600'
                }}
              />
            )}
            {block.imageCaption && (
              <figcaption className="text-sm text-gray-600 mt-2 text-center italic">
                {block.imageCaption}
              </figcaption>
            )}
          </figure>
        )

      case 'bulletList':
        return (
          <ul key={block.id} className="list-disc list-inside space-y-2 mb-4 text-gray-700">
            {block.content.split('\n').map((item, index) => (
              <li key={index}>{item.replace(/^[•\-]\s*/, '')}</li>
            ))}
          </ul>
        )

      case 'numberedList':
        return (
          <ol key={block.id} className="list-decimal list-inside space-y-2 mb-4 text-gray-700">
            {block.content.split('\n').map((item, index) => (
              <li key={index}>{item.replace(/^\d+\.\s*/, '')}</li>
            ))}
          </ol>
        )

      case 'quote':
        return (
          <blockquote key={block.id} className="border-l-4 border-primary pl-4 py-2 mb-4 italic text-gray-700">
            {block.content}
          </blockquote>
        )

      case 'code':
        return (
          <pre key={block.id} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
            <code className="text-sm font-mono">{block.content}</code>
          </pre>
        )

      default:
        return null
    }
  }

  return (
    <div className="article-content space-y-4">
      {blocks.map((block) => renderBlock(block))}
    </div>
  )
}
