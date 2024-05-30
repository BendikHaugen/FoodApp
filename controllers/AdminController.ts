import { Request, Response, NextFunction } from "express";
import { CreateVandorInput } from "../dto";
import { Vandor } from "../models";

const CreateVandor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    address,
    pincode,
    foodType,
    email,
    password,
    ownerName,
    phone,
  } = <CreateVandorInput>req.body;

  const createdVandor = await Vandor.create({
    name: name,
    address: address,
    pincode: pincode,
    foodType: foodType,
    email: email,
    password: password,
    ownerName: ownerName,
    phone: phone,
    salt: "",
    serviceAvailable: false,
    coverImages: [],
    rating: 0,
  });

  return res.json({
    name,
    address,
    pincode,
    foodType,
    email,
    password,
    ownerName,
    phone,
  });
};

const GetVandors = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Get Vandors" });
};

const GetVanodrById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.json({ message: "Update Vandor" });
};

export { CreateVandor, GetVandors, GetVanodrById };
