import bcrypt from "bcryptjs";


export const hashPass = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword;
  } catch (error) {
    console.log(error);
  }
};

export const comparePass = async (password, hashPass) => {
  try {
    return await bcrypt.compare(password, hashPass);
  } catch (error) {
    console.log(error);
  }
};
