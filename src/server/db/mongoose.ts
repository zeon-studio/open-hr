import variables from "@/config/variables";
import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalWithMongoose = global as typeof globalThis & {
  _mongoose?: MongooseCache;
};

const cached: MongooseCache = globalWithMongoose._mongoose || {
  conn: null,
  promise: null,
};

globalWithMongoose._mongoose = cached;

export const connectMongoose = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!variables.database_uri) {
    throw new Error("MONGO_URI is not configured");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(variables.database_uri, {
      dbName: process.env.MONGO_DB_NAME,
      bufferCommands: false,
      maxPoolSize: 20,
      minPoolSize: 5,
      socketTimeoutMS: 30000,
      serverSelectionTimeoutMS: 5000,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};
