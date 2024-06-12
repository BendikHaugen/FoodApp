import { Request, Response, NextFunction } from "express";
import { CreateVandorInput } from "../dto";
import { Vandor } from "../models";
import { GeneratePassword, GenerateSalt } from "../utility";

export const FindVandor = async (id: string | undefined, email?: string) => {
  if (id) {
    return await Vandor.findById(id);
  }
  return await Vandor.findOne({ email: email });
};

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

  const existingVandor = await FindVandor(email);

  if (existingVandor) {
    return res
      .status(400)
      .json({ message: `Vandor with email: ${email} already exists` });
  }

  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);

  const createdVandor = await Vandor.create({
    name: name,
    address: address,
    pincode: pincode,
    foodType: foodType,
    email: email,
    password: userPassword,
    ownerName: ownerName,
    phone: phone,
    salt: salt,
    serviceAvailable: false,
    coverImages: [],
    rating: 0,
  });

  return res.json(createdVandor);
};

const GetVandors = async (req: Request, res: Response, next: NextFunction) => {
  const vandors = await Vandor.find();

  if (vandors !== null) {
    return res.json(vandors);
  }

  return res.json({ message: "Vandors data not available" });
};

const GetVanodrById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vandorId = req.params.id;

  const vandor = await FindVandor(vandorId);

  if (vandor !== null) {
    return res.json(vandor);
  }

  return res.json({ message: "Vandors data not available" });
};

export { CreateVandor, GetVandors, GetVanodrById };
