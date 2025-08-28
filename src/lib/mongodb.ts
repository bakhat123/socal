import { MongoClient } from "mongodb";

const uri = process.env.DATABASE_URI;
if (!uri) {
  throw new Error("Please define the DATABASE_URI environment variable inside .env.local");
}

// Get database name from environment variable, default to 'socal-frontend'
const dbName = process.env.MONGODB_DB || 'socal-frontend';

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;

export async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db(dbName);
  return { client, db };
}