import bcrypt from "bcrypt";
import { VandorPayload } from "../dto";
import jwt from "jsonwebtoken";
import { Request } from "express";
import { APP_SECRET } from "../config";

const GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

const GeneratePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

const ValidatePassword = async (
  enteredPassword: string,
  savedPassword: string,
  salt: string
) => {
  return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};

const GenerateSignature = (payload: VandorPayload) => {
  return jwt.sign(payload, APP_SECRET, { expiresIn: "1h" });
};

const ValidateSignature = async (req: Request) => {
  const signature = req.get("Authorization");
};

export { GenerateSalt, GeneratePassword, ValidatePassword, GenerateSignature };
