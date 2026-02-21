import { ReactNode } from 'react'

interface PageContainerProps {
  children: ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  noPadding?: boolean
}

/**
 * Standardized page container component
 * Ensures consistent spacing and max-width across all pages
 */
export default function PageContainer({ 
  children, 
  className = '',
  maxWidth = '2xl',
  noPadding = false
}: PageContainerProps) {
  const maxWidthClasses = {
    'sm': 'max-w-screen-sm',
    'md': 'max-w-screen-md',
    'lg': 'max-w-screen-lg',
    'xl': 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    'full': 'max-w-full'
  }

  const paddingClasses = noPadding ? '' : 'px-4 sm:px-6 lg:px-8'

  return (
    <div className={`w-full ${paddingClasses}`}>
      <div className={`mx-auto ${maxWidthClasses[maxWidth]} ${className}`}>
        {children}
      </div>
    </div>
  )
}

/**
 * Page section with standardized vertical spacing
 */
export function PageSection({ 
  children, 
  className = '',
  spacing = 'normal'
}: { 
  children: ReactNode
  className?: string
  spacing?: 'tight' | 'normal' | 'loose'
}) {
  const spacingClasses = {
    'tight': 'py-4 sm:py-6',
    'normal': 'py-6 sm:py-8 lg:py-12',
    'loose': 'py-8 sm:py-12 lg:py-16'
  }

  return (
    <section className={`${spacingClasses[spacing]} ${className}`}>
      {children}
    </section>
  )
}

/**
 * Usage Examples:
 * 
 * // Basic page
 * <PageContainer>
 *   <PageSection>
 *     <h1>Page Title</h1>
 *     <p>Content</p>
 *   </PageSection>
 * </PageContainer>
 * 
 * // Custom max width
 * <PageContainer maxWidth="lg">
 *   <PageSection spacing="loose">
 *     <h1>Centered Content</h1>
 *   </PageSection>
 * </PageContainer>
 * 
 * // No padding (for full-width content)
 * <PageContainer noPadding>
 *   <div className="bg-gray-100">
 *     Full width background
 *   </div>
 * </PageContainer>
 */
