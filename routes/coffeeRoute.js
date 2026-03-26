import express from "express";
import { createCoffee, getAllCoffees, getCoffeeById } from "../controllers/coffeeController.js";

const coffeeRoute = express.Router();

coffeeRoute.post("/coffee", createCoffee);

coffeeRoute.get("/coffee", getAllCoffees);
coffeeRoute.get("/coffee/:id", getCoffeeById);

export default coffeeRoute;