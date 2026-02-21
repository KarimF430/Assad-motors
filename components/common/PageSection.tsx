interface PageSectionProps {
  children: React.ReactNode
  className?: string
  background?: 'white' | 'gray' | 'blue'
  title?: string
  subtitle?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl'
}

export default function PageSection({
  children,
  className = '',
  background = 'white',
  title,
  subtitle,
  maxWidth = '7xl'
}: PageSectionProps) {
  const bgClasses = {
    white: 'bg-transparent',
    gray: 'bg-gray-50/80',
    blue: 'bg-blue-50/80'
  }

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '7xl': 'max-w-7xl'
  }

  return (
    <section className={`${bgClasses[background]} py-3 sm:py-8 ${className}`}>
      <div className={`${maxWidthClasses[maxWidth]} mx-auto px-3 sm:px-4 lg:px-6 xl:px-8`}>
        {(title || subtitle) && (
          <div className="mb-4 sm:mb-6">
            {title && (
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm sm:text-base text-gray-600">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}