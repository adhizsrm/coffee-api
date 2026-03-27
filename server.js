import express from "express";
import { initDB } from "./database/init.js";
import coffeeRoute from "./routes/coffeeRoute.js";

const app = express();
const PORT = 8000;
app.use(express.json());
app.use("/coffee", coffeeRoute);
app.use((req, res) => {
  res.status(404).json({ error: "Route not found. Try /coffee" });
});

/**
 * STARTUP LOGIC
 * We wrap everything in an async function to handle the
 * database setup before the server opens for business.
 */
async function startServer() {
  try {
    console.log("Initializing database...");

    // Wait for tables to be created and seeded
    await initDB();

    console.log("Database ready.");

    // Only start the server if the database is healthy
    const server = app.listen(PORT, () => {
      console.log(`☕ Coffee Shop API running at http://localhost:${PORT}`);
    });

    // Error handling for the server itself
    server.on("error", (err) => {
      console.error("Server failed to start:", err);
    });
  } catch (err) {
    // If the DB fails to connect, we kill the process
    console.error("CRITICAL ERROR: Could not initialize app.");
    console.error(err.message);
    process.exit(1);
  }
}

startServer();
