import { Request, Response, NextFunction } from "express";
import { VandorLoginInputs } from "../dto";
import { GenerateSignature, ValidatePassword } from "../utility";
import { FindVandor } from "./AdminController";

const VandorLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = <VandorLoginInputs>req.body;

  const existingVandor = await FindVandor(undefined, email);

  if (existingVandor) {
    const valid = await ValidatePassword(
      password,
      existingVandor.password,
      existingVandor.salt
    );
    if (valid) {
      const signature = GenerateSignature({
        _id: existingVandor.id,
        email: existingVandor.email,
        foodtypes: existingVandor.foodType,
        name: existingVandor.name,
      });
      return res.json(signature);
    }
    return res.json({ message: "Password is not valid" });
  }

  return res.json({ message: "Login credentials not valid" });
};

const GetVandorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const existingVandor = await FindVandor(user._id);
    return res.json(existingVandor);
  }
  return res.json({ message: "Vandor information not found" });
};

const UpdateVandorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

const UpdateVandorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export {
  GetVandorProfile,
  UpdateVandorProfile,
  UpdateVandorService,
  VandorLogin,
};
