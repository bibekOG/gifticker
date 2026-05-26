import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "3001", 10),
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  uploadDir: process.env.UPLOAD_DIR || "./uploads",
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "10485760", 10), // 10MB
  supabaseUrl: process.env.SUPABASE_URL || "",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || "",
} as const;
