interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: Array<{label: string, href?: string}>
  background?: 'white' | 'blue' | 'gradient'
  actions?: React.ReactNode
}

export default function PageHeader({ 
  title, 
  subtitle, 
  breadcrumbs,
  background = 'white',
  actions
}: PageHeaderProps) {
  const backgroundClasses = {
    white: 'bg-white border-b border-gray-200',
    blue: 'bg-blue-50 border-b border-blue-100',
    gradient: 'bg-gradient-to-br from-blue-600 to-blue-800 text-white'
  }

  return (
    <section className={`${backgroundClasses[background]} py-6`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {breadcrumbs && (
          <nav className="mb-4">
            <ol className="flex items-center space-x-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                  {crumb.href ? (
                    <a href={crumb.href} className="text-blue-600 hover:text-blue-700">
                      {crumb.label}
                    </a>
                  ) : (
                    <span className={background === 'gradient' ? 'text-blue-100' : 'text-gray-600'}>
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${background === 'gradient' ? 'text-white' : 'text-gray-900'} mb-2`}>
              {title}
            </h1>
            {subtitle && (
              <p className={`text-lg ${background === 'gradient' ? 'text-blue-100' : 'text-gray-600'}`}>
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center space-x-4">
              {actions}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}