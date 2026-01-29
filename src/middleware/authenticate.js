import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/config.service.js";
import { ErrorException, NotFoundException } from "../common/utils/index.js";
import { UserModel } from "../DB/model/user.model.js";
export const verifyToken = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token === undefined) {
      ErrorException({
        message: "please enter token",
        cause: { status: 500 },
      });
    }
    token = token.split(" ")[1];
    /// verify token
    if (!token) {
      NotFoundException("token not found");
    }
    const verifyToken = jwt.verify(token, JWT_SECRET);
     const user = await UserModel.findById(verifyToken.userId);
    
      if (!user) {
        NotFoundException("Invalid Token");
      }
    req.user = verifyToken;
    next();
  } catch (error) {
    console.log(error);
    ErrorException({
      message: `Some Thing Went Wrong ... ${error}`,
      cause: { status: 500 },
    });
  }
};
