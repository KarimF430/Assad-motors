import React from 'react'

interface CarGridProps {
  children: React.ReactNode
  className?: string
}

export default function CarGrid({ children, className = '' }: CarGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 ${className}`}>
      {children}
    </div>
  )
}
