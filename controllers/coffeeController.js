import coffeeData from "../db/coffeeData.js";
async function getAllCoffees(req, res) {
  const { id, name, price, size, isHot, ingredients, rating } = req.query;
  let result = coffeeData;

  if (id) {
    result = result.filter((item) => item.id === Number(id));
  }

  if (name) {
    result = result.filter(
      (item) => item.name.toLowerCase() === name.toLowerCase(),
    );
  }

  if (price) {
    result = result.filter((item) => item.price === Number(price));
  }

  if (size) {
    result = result.filter(
      (item) => item.size.toLowerCase() === size.toLowerCase(),
    );
  }

  if (isHot) {
    result = result.filter((item) => item.isHot === (isHot === "true"));
  }

  if (ingredients) {
    result = result.filter((item) =>
      item.ingredients.some((ing) =>
        ing.toLowerCase().includes(ingredients.toLowerCase()),
      ),
    );
  }

  if (rating) {
    result = result.filter((item) => item.rating === Number(rating));
  }

  if (result.length === 0) {
    return res.status(404).json({ error: "query not found" });
  }
  res.json(result);
}

async function getCoffeeById(req, res) {
  const { id } = req.params;
  const filteredData = coffeeData.filter((item) => item.id === Number(id));

  if (filteredData.length === 0) {
    return res.status(404).json({
      error: "id Not Found",
    });
  }
  res.json(filteredData);
}

export { getAllCoffees, getCoffeeById };
