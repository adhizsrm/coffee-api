import { getDBConnection } from "../config/db.js";
import seedData from "./coffeeData.js";

export async function initDB() {
  const db = await getDBConnection();

  // Create Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS coffee (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL,
      size TEXT,
      isHot INTEGER,
      ingredients TEXT,
      rating REAL
    )
  `);

  // Check if we need to seed
  const { count } = await db.get("SELECT COUNT(*) as count FROM coffee");
  if (count === 0) {
    console.log("Seeding initial data...");
    for (const item of seedData) {
      await db.run(
        "INSERT INTO coffee (name, price, size, isHot, ingredients, rating) VALUES (?, ?, ?, ?, ?, ?)",
        [
          item.name,
          item.price,
          item.size,
          item.isHot ? 1 : 0,
          item.ingredients.join(", "),
          item.rating,
        ],
      );
    }
  }
}
