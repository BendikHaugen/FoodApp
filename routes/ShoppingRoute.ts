import express, { Request, Response, NextFunction } from "express";

const router = express.Router();

router.get("/:pincode");
router.get("/:top-resturants/:pincode");
router.get("/:pincode");
router.get("/:pincode");
router.get("/:pincode");

export { router as ShoppingRoute };
