
const MONGODB_URI = process.env.MONGODB_URI;

// Build-time guard: prevent connection attempts or library loads during the Next.js build phase
if (!MONGODB_URI && process.env.NEXT_PHASE !== "phase-production-build") {
  throw new Error("Please define MONGODB_URI in .env.local");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    // Dynamic import inside the function to keep 'mongoose' out of the Edge Runtime
    const mongoose = (await import("mongoose")).default;
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
