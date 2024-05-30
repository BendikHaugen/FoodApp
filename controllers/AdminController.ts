import { Request, Response, NextFunction } from "express";
import { CreateVandorInput } from "../dto";

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
