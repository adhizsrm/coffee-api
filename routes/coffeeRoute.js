import express from "express";
import {
  createCoffee,
  getAllCoffees,
  getCoffeeById,
} from "../controllers/coffeeController.js";

const coffeeRoute = express.Router();

coffeeRoute.post("/", createCoffee);

coffeeRoute.get("/", getAllCoffees);
coffeeRoute.get("/:id", getCoffeeById);

export default coffeeRoute;
