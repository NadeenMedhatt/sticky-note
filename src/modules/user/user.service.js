import {
  ErrorException,
  NotFoundException,
} from "../../common/utils/response/index.js";
import { encryptValue } from "../../common/utils/security/encryption.js";
import { decodeToken } from "../../common/utils/security/tokenDecode.js";
import { UserModel } from "../../DB/model/index.js";

/*Update logged-in user information (Except Password). (If user want to update the email, check the newemail
doesn’t exist before. (Get the id for the logged-in user (userId) from the token not the body) (send the tokenintheheaders)  */

export const updateUser = async (inputs, token) => {
  const { name, email, phone, age } = inputs;

  const decoded = await decodeToken(token);

  const user = await UserModel.findById(decoded.userId);

  if (!user) {
    NotFoundException("User Not Found");
  }

  if (user.email != email) {
    const checkEmailExists = await UserModel.findOne({ email });

    if (checkEmailExists) {
      ErrorException({
        message: "Duplicated Email",
        cause: { status: 409 },
      });
    }
  }

  const encryptPhone = encryptValue(phone);

  const updatedUser = await UserModel.updateOne(
    { _id: decoded.userId },
    {
      $set: {
        name,
        email,
        phone: encryptPhone,
        age,
      },
    },
  );

  return updatedUser;
};

/* Delete logged-in user. (Get the id for the logged-in user (userId) from the token not the body) (send the tokeninthe headers) */
export const deleteUser = async (token) => {
  const decoded = await decodeToken(token);
  const user = await UserModel.findById(decoded.userId);
  if (!user) {
    NotFoundException("User Not Found");
  }

  const updatedUser = await UserModel.deleteOne({ _id: decoded.userId });

  return updatedUser;
};

/* Get logged-in user data by his ID. (Get the id for the logged-in user (userId) from the token not the body) (sendthetoken in the headers) */
export const findUser = async (token) => {
  const decoded = await decodeToken(token);
  const user = await UserModel.findById(decoded.userId);
  if (!user) {
    NotFoundException("User Not Found");
  }
  return user;
};
