import express from "express";
import {
  CustomerSignup,
  CustomerVerify,
  CustomerLogin,
  RequestOTP,
  GetCustomerProfile,
  EditCustomerProfile,
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

export { router as CustomerRoute };
