/**
 * Log levels for the logger.
 * 
 * @typedef {('info' | 'warn' | 'error')} LogLevel
 * 
 * @description
 * This type defines the available log levels that the logger can use for categorizing log messages.
 */
type LogLevel = 'info' | 'warn' | 'error'

/**
 * Formats a log message with a timestamp, log level, message, and optional context.
 * 
 * @param {LogLevel} level - The log level for the message (e.g., 'info', 'warn', 'error').
 * @param {string} message - The message to log.
 * @param {Record<string, unknown>} [context] - Optional additional context to include in the log.
 * 
 * @returns {string} The formatted log message.
 * 
 * @example
 * formatMessage('info', 'Application started', { userId: 123 })
 * // Output: "[2023-10-01T12:00:00.000Z] [INFO] Application started {\"userId\":123}]"
 */
function formatMessage(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const timestamp = new Date().toISOString()
  const base = `[${timestamp}] [${level.toUpperCase()}] ${message}`
  return context ? `${base} ${JSON.stringify(context)}` : base
}

/**
 * Logger utility for different log levels: info, warn, and error.
 * 
 * This object provides methods for logging messages at different levels (info, warn, and error),
 * with optional context for debugging purposes.
 * 
 * @type {object}
 * @property {function(string, Record<string, unknown>?): void} info - Logs an info-level message.
 * @property {function(string, Record<string, unknown>?): void} warn - Logs a warn-level message.
 * @property {function(string, Record<string, unknown>?): void} error - Logs an error-level message.
 */
export const logger = {
  /**
   * Logs an info-level message to the console.
   * 
   * @param {string} message - The message to log.
   * @param {Record<string, unknown>} [context] - Optional additional context to include in the log.
   */
  info: (message: string, context?: Record<string, unknown>) => {
    console.log(formatMessage('info', message, context))
  },

  /**
   * Logs a warn-level message to the console.
   * 
   * @param {string} message - The message to log.
   * @param {Record<string, unknown>} [context] - Optional additional context to include in the log.
   */
  warn: (message: string, context?: Record<string, unknown>) => {
    console.warn(formatMessage('warn', message, context))
  },

  /**
   * Logs an error-level message to the console.
   * 
   * @param {string} message - The message to log.
   * @param {Record<string, unknown>} [context] - Optional additional context to include in the log.
   */
  error: (message: string, context?: Record<string, unknown>) => {
    console.error(formatMessage('error', message, context))
  },
}
