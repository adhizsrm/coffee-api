import coffeeData from "../db/coffeeData.js";

async function createCoffee(req, res) {
  let newCoffee = req.body;
  if (Object.hasOwn(req.body, "id")) {
    return res
      .status(400)
      .json({ error: "Please do not provide an ID. The system generates it." });
  }
  const id =
    coffeeData.length > 0 ? coffeeData[coffeeData.length - 1].id + 1 : 1;
  newCoffee = { id: id, ...newCoffee };
  coffeeData.push(newCoffee);
  res.status(201).json(newCoffee);
}

async function getAllCoffees(req, res) {
  let result = coffeeData;

  for (const [key, value] of Object.entries(req.query)) {
    result = result.filter((item) => {
      switch (key) {
        case "id":
          return item.id === Number(value);

        case "name":
          return item.name.toLowerCase().includes(value.toLowerCase());

        case "price":
          return item.price === Number(value);

        case "size":
          return item.size.toLowerCase() === value.toLowerCase();

        case "isHot":
          return item.isHot === (value === "true");

        case "ingredients":
          return item.ingredients.some((ing) =>
            ing.toLowerCase().includes(value.toLowerCase()),
          );

        case "rating":
          return item.rating === Number(value);

        default:
          return true; // ignore unknown filters
      }
    });
  }

  if (result.length === 0) {
    return res.status(404).json({ error: "query not found" });
  }
  res.json(result);
}

async function getCoffeeById(req, res) {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({
      error: "Invalid id",
    });
  }

  const coffee = coffeeData.find((item) => item.id === id);
  return !coffee
    ? res.status(404).json({ error: "id Not Found" })
    : res.json(coffee);
}

export { createCoffee, getAllCoffees, getCoffeeById };
