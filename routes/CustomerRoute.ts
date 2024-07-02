import express from "express";
import {
  CustomerSignup,
  CustomerVerify,
  CustomerLogin,
  RequestOtp,
  GetCustomerProfile,
  EditCustomerProfile,
} from "../controllers";

const router = express.Router();

router.post("/signup", CustomerSignup);
router.get("/login", CustomerLogin);

router.get("/verify", CustomerVerify);
router.get("/otp", RequestOtp);
router.get("/profile", GetCustomerProfile);
router.patch("/profile", EditCustomerProfile);

export { router as CustomerRoute };
