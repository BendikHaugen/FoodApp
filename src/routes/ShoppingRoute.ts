import express, { Request, Response, NextFunction } from "express";
import {
  GetFoodAvailability,
  GetTopRestaurants,
  RestaurantById,
  SearchFoods,
  GetFoodsIn30Min,
} from "../controllers";

const router = express.Router();

router.get("/:pincode", GetFoodAvailability);
router.get("/:top-resturants/:pincode", GetTopRestaurants);
router.get("/foods-in-30-min/:pincode", GetFoodsIn30Min);
router.get("/seartch/:pincode", SearchFoods);
router.get("/restaurant/:pincode", RestaurantById);

export { router as ShoppingRoute };
