import { JWT_SECRET } from "../../../../config/config.service.js";
import jwt from "jsonwebtoken";

export const decodeToken = async (token) => {
  token = token.split(" ")[1];
  const verifyToken = jwt.verify(token, JWT_SECRET);
  return verifyToken;
};
