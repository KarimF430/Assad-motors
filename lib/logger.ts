/**
 * Production-ready logger
 * Replaces console.log with proper logging
 */

const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'

interface LogContext {
  [key: string]: any
}

class Logger {
  private context: string

  constructor(context: string = 'App') {
    this.context = context
  }

  private formatMessage(level: string, message: string, data?: LogContext): string {
    const timestamp = new Date().toISOString()
    const contextStr = `[${this.context}]`
    const levelStr = `[${level.toUpperCase()}]`
    
    let logMessage = `${timestamp} ${levelStr} ${contextStr} ${message}`
    
    if (data) {
      logMessage += ` ${JSON.stringify(data)}`
    }
    
    return logMessage
  }

  private shouldLog(level: string): boolean {
    // In production, only log warnings and errors
    if (isProduction) {
      return ['warn', 'error'].includes(level)
    }
    return true
  }

  debug(message: string, data?: LogContext): void {
    if (this.shouldLog('debug') && isDevelopment) {
      console.debug(this.formatMessage('debug', message, data))
    }
  }

  info(message: string, data?: LogContext): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message, data))
    }
  }

  warn(message: string, data?: LogContext): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, data))
    }
  }

  error(message: string, error?: Error | LogContext): void {
    if (this.shouldLog('error')) {
      const errorData = error instanceof Error 
        ? { message: error.message, stack: error.stack }
        : error
      
      console.error(this.formatMessage('error', message, errorData))
      
      // Send to Sentry in production
      if (isProduction && typeof window !== 'undefined') {
        try {
          const Sentry = (window as any).Sentry
          if (Sentry && error instanceof Error) {
            Sentry.captureException(error, {
              contexts: {
                logger: {
                  context: this.context,
                  message
                }
              }
            })
          }
        } catch (e) {
          // Sentry not available
        }
      }
    }
  }

  // Performance logging
  time(label: string): void {
    if (isDevelopment) {
      console.time(`${this.context}:${label}`)
    }
  }

  timeEnd(label: string): void {
    if (isDevelopment) {
      console.timeEnd(`${this.context}:${label}`)
    }
  }

  // Group logging for better organization
  group(label: string): void {
    if (isDevelopment) {
      console.group(`${this.context}: ${label}`)
    }
  }

  groupEnd(): void {
    if (isDevelopment) {
      console.groupEnd()
    }
  }

  // Table logging for structured data
  table(data: any): void {
    if (isDevelopment) {
      console.table(data)
    }
  }
}

// Create default logger instance
const defaultLogger = new Logger('Default')

// Export both class and default instance
export { Logger }
export default defaultLogger

// Export convenience functions
export const logger = {
  debug: (message: string, data?: LogContext) => defaultLogger.debug(message, data),
  info: (message: string, data?: LogContext) => defaultLogger.info(message, data),
  warn: (message: string, data?: LogContext) => defaultLogger.warn(message, data),
  error: (message: string, error?: Error | LogContext) => defaultLogger.error(message, error),
  time: (label: string) => defaultLogger.time(label),
  timeEnd: (label: string) => defaultLogger.timeEnd(label),
  group: (label: string) => defaultLogger.group(label),
  groupEnd: () => defaultLogger.groupEnd(),
  table: (data: any) => defaultLogger.table(data),
  create: (context: string) => new Logger(context)
}

/**
 * Usage Examples:
 * 
 * // Import logger
 * import { logger } from '@/lib/logger'
 * 
 * // Basic logging
 * logger.info('User logged in', { userId: 123 })
 * logger.error('Database error', new Error('Connection failed'))
 * 
 * // Create context-specific logger
 * import { Logger } from '@/lib/logger'
 * const apiLogger = new Logger('API')
 * apiLogger.info('Request received', { method: 'GET', path: '/api/brands' })
 * 
 * // Performance timing
 * logger.time('database-query')
 * // ... perform query
 * logger.timeEnd('database-query')
 * 
 * // Grouped logging
 * logger.group('Processing items')
 * items.forEach(item => {
 *   logger.info('Processing', { id: item.id })
 * })
 * logger.groupEnd()
 */
