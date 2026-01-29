import { Router } from "express";
import { deleteUser, findUser, updateUser } from "./user.service.js";
import { successResponse } from "../../common/utils/response/index.js";
const router = Router();

router.patch("/", async (req, res, next) => {  
  const result = await updateUser(req.body, req.headers.authorization);
  return successResponse({
    res,
    message: "User Updated",
    status: 200,
    data: { result },
  });
});
router.delete("/", async (req, res, next) => {
  const result = await deleteUser(req.headers.authorization);
  return successResponse({
    res,
    message: "User Deleted",
    status: 200,
    data: { result },
  });
});
router.get("/", async (req, res, next) => {
  const result = await findUser(req.headers.authorization);
  return successResponse({
    res,
    message: "Retrieved Successfully",
    status: 200,
    data: { result },
  });
});

export default router;
