import { MongoClient, Db } from 'mongodb'
import { MongoConnectionError } from '@/errors/mongo-connection-error'

let client: MongoClient | null = null
let db: Db | null = null

/**
 * Returns a singleton MongoDB connection using the native MongoDB driver.
 * 
 * If a connection has already been established, it returns the cached instance.
 * Otherwise, it creates a new connection and caches it.
 *
 * It also ensures that an index is created on the `authorId` field for improved query performance.
 *
 * @returns {Promise<{ client: MongoClient; db: Db }>} A connected MongoDB client and database instance
 * @throws {MongoConnectionError} If the connection fails or the URI is missing
 *
 * @example
 * const { db } = await getMongoDB()
 * const users = await db.collection('users').find().toArray()
 */
export async function getMongoDB(): Promise<{ client: MongoClient; db: Db }> {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    throw new MongoConnectionError('The environment variable MONGODB_URI is not defined.')
  }

  if (client && db) {
    return { client, db }
  }

  try {
    client = new MongoClient(uri)
    await client.connect()
    db = client.db()

    // Create an index on the 'authorId' field for better performance on queries
    await db.collection('articles').createIndex({ authorId: 1 });

    return { client, db }
  } catch (error) {
    throw new MongoConnectionError(`Failed to connect to MongoDB: ${(error as Error).message}`)
  }
}
