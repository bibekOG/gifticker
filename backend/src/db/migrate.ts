import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function migrate() {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    console.error(
      "DATABASE_URL not set. Find it in Supabase dashboard:\n" +
      "  Project Settings → Database → Connection string (URI)\n" +
      "  Copy the 'postgresql://...' string and add to .env as DATABASE_URL"
    );
    process.exit(1);
  }

  const pool = new pg.Pool({ connectionString: dbUrl });

  try {
    const migrationsDir = path.resolve(__dirname, "../../supabase/migrations");
    const files = fs.readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    for (const file of files) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
      console.log(`Running migration: ${file}`);
      await pool.query(sql);
      console.log(`  ✓ ${file}`);
    }

    console.log("\nAll migrations complete.");
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
