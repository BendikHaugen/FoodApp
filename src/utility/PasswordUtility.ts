import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request } from "express";
import { APP_SECRET } from "../config";
import { AuthPayload } from "../dto/Auth.dto";

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

const GenerateSignature = (payload: AuthPayload) => {
  return jwt.sign(payload, APP_SECRET, { expiresIn: "1h" });
};

const ValidateSignature = async (req: Request) => {
  const signature = req.get("Authorization");
  if (signature) {
    const payload = (await jwt.verify(
      signature.split(" ")[1],
      APP_SECRET
    )) as AuthPayload;
    req.user = payload;

    return true;
  }
};

export {
  GenerateSalt,
  GeneratePassword,
  ValidatePassword,
  GenerateSignature,
  ValidateSignature,
};
