import { Request, Response, NextFunction } from "express";
import { EditVandorInputs, VandorLoginInputs } from "../dto";
import { GenerateSignature, ValidatePassword } from "../utility";
import { FindVandor } from "./AdminController";
import { CreateFoodInputs } from "../dto/Food.dto";
import { Food } from "../models";

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
) => {
  const { foodTypes, name, address, phone } = <EditVandorInputs>req.body;
  const user = req.user;

  if (user) {
    const existingVandor = await FindVandor(user._id);

    if (existingVandor) {
      existingVandor.name = name;
      existingVandor.foodType = foodTypes;
      existingVandor.address = address;
      existingVandor.phone = phone;
      const savedResult = existingVandor.save();
      return res.json(savedResult);
    }
  }
  return res.json({ message: "Vandor information not found" });
};

const UpdateVandorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const existingVandor = await FindVandor(user._id);

    if (existingVandor) {
      existingVandor.serviceAvailable = !existingVandor.serviceAvailable;
      const savedResult = existingVandor.save();
      return res.json(savedResult);
    }
  }
  return res.json({ message: "Vandor information not found" });
};

const addFood = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (user) {
    // prettier-ignore
    const { name, description, category, foodType, readyTime, price } = <CreateFoodInputs>req.body;
    const vandor = await FindVandor(user._id);
    if (vandor) {
      const createdFood = await Food.create({
        vandorId: vandor._id,
        name: name,
        description: description,
        category: category,
        foodType: foodType,
        images: [],
      });
      vandor.foods.push(createdFood);
      const result = await vandor.save();

      return res.json(result);
    }
  }
};

const getFoods = async (req: Request, res: Response, next: NextFunction) => {};

export {
  GetVandorProfile,
  UpdateVandorProfile,
  UpdateVandorService,
  VandorLogin,
  addFood,
};
