import { BaseError } from '@/errors/base-error'
import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

/**
 * Handles known and unknown errors, logs them, and returns a standardized API response.
 *
 * @param error - The error to handle.
 * @returns {NextResponse} - A properly formatted error response.
 */
export function handleError(error: unknown): NextResponse {
  if (error instanceof BaseError) {
    logger.warn(error.message, {
      type: error.type,
      statusCode: error.statusCode,
    })

    return NextResponse.json(
      {
        error: {
          message: error.message,
          type: error.type,
        },
      },
      { status: error.statusCode }
    )
  }

  logger.error('Unexpected error', {
    message: (error as Error)?.message ?? 'unknown',
    stack: (error as Error)?.stack,
  })

  return NextResponse.json(
    {
      error: {
        message: 'Something went wrong',
        type: 'internal_error',
      },
    },
    { status: 500 }
  )
}
