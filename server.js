import express from "express";
import coffeeRoute from "./routes/coffeeRoute.js";

const PORT = 8000;
const app = express();

app.use("/", coffeeRoute);

app.use((req, res) => res.status(404).json({ error: "Route not found" }));

app
  .listen(PORT, () =>
    console.log(`☕ Coffee Shop API running at http://localhost:${PORT}`),
  )
  .on("error", (err) => {
    console.error(err);
  });
