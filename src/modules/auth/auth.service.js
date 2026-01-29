import {
  ErrorException,
  NotFoundException,
} from "../../common/utils/index.js";
import { UserModel } from "../../DB/model/index.js";
import {
  comparePass,
  encryptValue,
  hashPass,
} from "../../common/utils/security/index.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../../config/config.service.js";


/* Signup (make sure that the email does not exist before) (Don’t forget to hash the password and encrypt the phone). */
export const signup = async (inputs) => {
  const { name, email, password, phone, age } = inputs;
  const checkEmailExists = await UserModel.findOne({ email });

  if (checkEmailExists) {
    ErrorException({
      message: "Duplicated Email",
      cause: { status: 409 },
    });
  }
  const encryptPass = await hashPass(password);
  const encryptPhone = encryptValue(phone);
  const user = new UserModel({
    name,
    email,
    password: encryptPass,
    phone: encryptPhone,
    age,
  });
  await user.save();
  return user;
};

/* Create an API for authenticating users (Login) and return a JSON Web Token (JWT) that contains the userId and will expireafter “1 hour”. (Get the email and the password from the body). */
export const login = async (inputs) => {
  const { email, password } = inputs;

  const user = await UserModel.findOne({ email });
  console.log({user});
  
  if (!user) {
    NotFoundException("Invalid Credentials");
  }
  const matchPass = await comparePass(password, user.password);
  console.log({ matchPass });

  if (!matchPass) {
    NotFoundException("Invalid Credentials");
  }
  const payload = {
    userId: user._id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

  return token;
};
