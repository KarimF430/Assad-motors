
import React from 'react'
import { Quote } from 'lucide-react'

// Reuse the types from ArticleRenderer or define locally if needed
interface ContentBlock {
    id: string
    type: 'paragraph' | 'heading1' | 'heading2' | 'heading3' | 'image' | 'bulletList' | 'numberedList' | 'quote' | 'code'
    content: string
    imageUrl?: string
    imageCaption?: string
}

interface ReviewRendererProps {
    blocks: ContentBlock[]
}

export default function ReviewRenderer({ blocks }: ReviewRendererProps) {
    if (!blocks || blocks.length === 0) return null

    return (
        <div className="space-y-8 font-serif">
            {blocks.map((block) => {
                switch (block.type) {
                    case 'paragraph':
                        // Check if it's a "Drop Cap" start (first paragraph) for magazine feel
                        // For now, just elegant typography
                        return (
                            <p key={block.id} className="text-lg text-gray-800 leading-relaxed">
                                {block.content}
                            </p>
                        )

                    case 'heading1':
                        return (
                            <h2 key={block.id} className="text-3xl font-bold text-gray-900 mt-10 mb-4 border-l-4 border-red-600 pl-4">
                                {block.content}
                            </h2>
                        )

                    case 'heading2':
                        return (
                            <h3 key={block.id} className="text-2xl font-bold text-gray-900 mt-8 mb-3">
                                {block.content}
                            </h3>
                        )

                    case 'heading3':
                        return (
                            <h4 key={block.id} className="text-xl font-bold text-gray-800 mt-6 mb-2">
                                {block.content}
                            </h4>
                        )

                    case 'image':
                        return (
                            <figure key={block.id} className="my-8 relative group">
                                <div className="overflow-hidden rounded-xl shadow-lg">
                                    <img
                                        src={block.imageUrl}
                                        alt={block.imageCaption || 'Review Image'}
                                        className="w-full h-auto transform group-hover:scale-[1.01] transition-transform duration-700"
                                    />
                                </div>
                                {block.imageCaption && (
                                    <figcaption className="text-sm text-gray-500 mt-2 text-center italic">
                                        {block.imageCaption}
                                    </figcaption>
                                )}
                            </figure>
                        )

                    case 'quote':
                        return (
                            <blockquote key={block.id} className="my-8 p-6 bg-gray-50 border-l-4 border-red-600 rounded-r-xl relative">
                                <Quote className="absolute top-4 left-4 w-8 h-8 text-red-200 -z-10" />
                                <p className="text-xl text-gray-800 italic font-medium relative z-10">
                                    "{block.content}"
                                </p>
                            </blockquote>
                        )

                    case 'bulletList':
                        const listItems = block.content.split('\n').filter(item => item.trim());
                        return (
                            <ul key={block.id} className="space-y-3 my-6 pl-4">
                                {listItems.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2.5 flex-shrink-0"></span>
                                        <span className="text-lg text-gray-800">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        )

                    case 'numberedList':
                        const numberedItems = block.content.split('\n').filter(item => item.trim());
                        return (
                            <ol key={block.id} className="space-y-3 my-6 pl-4 list-decimal list-inside marker:text-red-600 marker:font-bold">
                                {numberedItems.map((item, idx) => (
                                    <li key={idx} className="text-lg text-gray-800 pl-2">
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ol>
                        )

                    default:
                        return null
                }
            })}
        </div>
    )
}
