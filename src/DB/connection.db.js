import mongoose from "mongoose";
import { DB_URI } from "../../config/config.service.js";

export const authenticateDB = async () => {
  try {
      const result = await mongoose.connect(DB_URI, {});
      
      console.log(`DB connected successfully`);
  } catch (error) {
    console.log(`Fail to connect to DB ${error}`);
  }
};
