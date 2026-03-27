import { getDBConnection } from "../config/db.js";
/**
 * GET ALL COFFEES (With Dynamic Filtering)
 */
async function getAllCoffees(req, res) {
  try {
    const db = await getDBConnection();

    let query = "SELECT * FROM coffee";
    const conditions = [];
    const params = [];

    // Build Dynamic SQL based on Query Params
    for (const [key, value] of Object.entries(req.query)) {
      switch (key) {
        case "id":
        case "price":
        case "rating":
          conditions.push(`${key} = ?`);
          params.push(Number(value));
          break;
        case "size":
          conditions.push("LOWER(size) = LOWER(?)");
          params.push(value);
          break;
        case "name":
        case "ingredients":
          conditions.push(`${key} LIKE ?`);
          params.push(`%${value}%`);
          break;
        case "isHot":
          conditions.push("isHot = ?");
          params.push(value === "true" ? 1 : 0);
          break;
      }
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    const rows = await db.all(query, params);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No matching coffee found" });
    }

    // Transform data back to JS-friendly types (String -> Array, 1/0 -> Boolean)
    const formattedResult = rows.map((item) => ({
      ...item,
      ingredients: item.ingredients ? item.ingredients.split(", ") : [],
      isHot: item.isHot === 1,
    }));

    res.json(formattedResult);
  } catch (err) {
    console.error("Database Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/**
 * GET COFFEE BY ID
 */
async function getCoffeeById(req, res) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const db = await getDBConnection();
    const coffee = await db.get(`SELECT * FROM coffee WHERE id = ?`, [id]);

    if (!coffee) {
      return res.status(404).json({ error: "ID not found" });
    }

    // Transform for the single object too
    const formattedCoffee = {
      ...coffee,
      ingredients: coffee.ingredients ? coffee.ingredients.split(", ") : [],
      isHot: coffee.isHot === 1,
    };

    res.json(formattedCoffee);
  } catch (err) {
    console.error("Database Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/**
 * CREATE NEW COFFEE
 */
async function createCoffee(req, res) {
  try {
    const { name, price, size, isHot, ingredients, rating } = req.body;

    if (Object.hasOwn(req.body, "id")) {
      return res.status(400).json({
        error: "Please do not provide an ID. The system generates it.",
      });
    }

    const db = await getDBConnection();
    const result = await db.run(
      `INSERT INTO coffee (name, price, size, isHot, ingredients, rating)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        name,
        Number(price),
        size,
        isHot ? 1 : 0,
        Array.isArray(ingredients) ? ingredients.join(", ") : ingredients,
        Number(rating),
      ],
    );

    res.status(201).json({ id: result.lastID, ...req.body });
  } catch (err) {
    console.error("Database Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export { getAllCoffees, getCoffeeById, createCoffee };
