import express from "express";
import {
  CustomerSignup,
  CustomerVerify,
  CustomerLogin,
  RequestOTP,
  GetCustomerProfile,
  EditCustomerProfile,
  getOrders,
  getOrderById,
  createOrder,
} from "../controllers";
import { Authenticate } from "../middlewares";

const router = express.Router();

router.post("/signup", CustomerSignup);
router.get("/login", CustomerLogin);
router.use(Authenticate);
router.get("/verify", CustomerVerify);
router.get("/otp", RequestOTP);
router.get("/profile", GetCustomerProfile);
router.patch("/profile", EditCustomerProfile);
router.get("/orders", getOrders);
router.get("/order/:id", getOrderById);
router.post("/create-order", createOrder);
router.get("/profile", GetCustomerProfile);

export { router as CustomerRoute };
