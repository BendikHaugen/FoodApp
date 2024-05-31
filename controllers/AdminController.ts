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

  const existingVandor = await Vandor.findOne({ email: email });

  if (existingVandor) {
    return res
      .status(400)
      .json({ message: `Vandor with email: ${email} already exists` });
  }

  const createdVandor = await Vandor.create({
    name: name,
    address: address,
    pincode: pincode,
    foodType: foodType,
    email: email,
    password: password,
    ownerName: ownerName,
    phone: phone,
    salt: "SALT",
    serviceAvailable: false,
    coverImages: [],
    rating: 0,
  });

  return res.json(createdVandor);
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
