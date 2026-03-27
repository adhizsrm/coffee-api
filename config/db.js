import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

// This helps us find the absolute path to our project folder
const __dirname = path.dirname(fileURLToPath(import.meta.url));

let dbInstance = null;

export async function getDBConnection() {
  if (dbInstance) return dbInstance;

  // This creates a path like: C:/Users/You/Project/database/coffee.sqlite
  // We go up one level (..) because db.js is inside the 'config' folder
  const dbPath = path.join(__dirname, "..", "database", "coffee.sqlite");

  dbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  return dbInstance;
}
