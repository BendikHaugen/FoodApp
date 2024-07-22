import express, { Request, Response, NextFunction } from "express";
import { plainToClass, plainToInstance } from "class-transformer";
import { CreateCustomerInputs, UserLoginInputs } from "../dto/Customer.dto";
import { validate } from "class-validator";
import {
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
  generateOTP,
  onRequestOTP,
} from "../utility";
import { Customer } from "../models/Customer";

export const CustomerSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customerInput = plainToClass(CreateCustomerInputs, req.body);

  const inputErrors = await validate(customerInput, {
    validationError: { target: false },
  });

  if (inputErrors) {
    return res.status(400).json({ errors: inputErrors });
  }
  const { email, phone, password } = customerInput;

  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);

  const { otp, expiry } = generateOTP();

  const otp_expiry = new Date();

  const result = await Customer.create({
    email,
    phone,
    password: userPassword,
    salt,
    otp,
    otp_expiry,
    firstName: "",
    lastName: "",
    address: "",
    verified: false,
    lat: 0,
    lng: 0,
  });

  if (result) {
    // send OTP to user
    await onRequestOTP(otp, phone);
    // genertate the signature
    const signature = GenerateSignature({
      _id: result.id,
      email: result.email,
      verified: result.verified,
    });
    // send the result to client
    return res.status(201).json({
      signature: signature,
      verified: result.verified,
      email: result.email,
      phone: result.phone,
      id: result.id,
    });
  }
  return res.status(500).json({ message: "Error creating user" });
};

export const CustomerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const loginInputs = plainToInstance(UserLoginInputs, req.body);

  const lgoinErrors = await validate(loginInputs, {
    validationError: { target: false },
  });

  if (lgoinErrors.length) {
    return res.status(400).json({ errors: lgoinErrors });
  }

  const { email, password } = loginInputs;

  const customer = await Customer.findOne({ email: email });

  if (customer) {
    const validation = await ValidatePassword(
      password,
      customer.password,
      customer.salt
    );
    if (validation) {
      const signature = GenerateSignature({
        _id: customer.id,
        email: customer.email,
        verified: customer.verified,
      });
      // send the result to client
      return res.status(201).json({
        signature: signature,
        verified: customer.verified,
        email: customer.email,
        phone: customer.phone,
        id: customer.id,
      });
    } else {
      return res.status(500).json({ message: "Password and email not valid" });
    }
  }
  return res.status(500).json({ message: "Loggin error" });
};

export const CustomerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { otp } = req.body;

  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      if (profile.otp === parseInt(otp) && profile.otp_expiry > new Date()) {
        profile.verified = true;

        const result = await profile.save();

        const signature = GenerateSignature({
          _id: profile.id,
          email: profile.email,
          verified: profile.verified,
        });

        return res.status(201).json({
          signature: signature,
          verified: result.verified,
          email: result.email,
          phone: result.phone,
        });
      }
      return res.status(500).json({ message: "OTP is not valid" });
    }
    return res.status(404).json({ message: "User not found" });
  }
};

export const GetCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const EditCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
