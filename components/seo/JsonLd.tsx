'use client'

import React from 'react'

interface JsonLdProps {
    data: Record<string, any>
    id?: string
}

const JsonLd: React.FC<JsonLdProps> = ({ data, id }) => {
    if (!data) return null

    return (
        <script
            id={id}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    )
}

export default JsonLd
