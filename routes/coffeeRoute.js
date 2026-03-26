import express from "express";
import { getAllCoffees, getCoffeeById } from "../controllers/coffeeController.js";

const coffeeRoute = express.Router();

coffeeRoute.get("/coffee", getAllCoffees);
coffeeRoute.get("/coffee/:id", getCoffeeById);

export default coffeeRoute;