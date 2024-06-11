import bcrypt from "bcrypt";

const GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

const GeneratePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export { GenerateSalt, GeneratePassword };
