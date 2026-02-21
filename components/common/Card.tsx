interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
  hover?: boolean
  border?: boolean
}

export default function Card({ 
  children, 
  className = '', 
  padding = 'md',
  hover = false,
  border = true
}: CardProps) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  return (
    <div className={`
      bg-white rounded-lg shadow-sm
      ${border ? 'border border-gray-200' : ''}
      ${paddingClasses[padding]}
      ${hover ? 'hover:shadow-md transition-shadow duration-200' : ''}
      ${className}
    `}>
      {children}
    </div>
  )
}