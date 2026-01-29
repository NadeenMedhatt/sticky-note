import { Router } from "express";
import {
  createOneNote,
  replaceOneNote,
  updateManyNotes,
  updateOneNote,
  getUserNotes,
  getOneNote,
  getUserNotesByContent,
  getUserNotesDetailed,
  getUserNotesAggregate,
  deleteUserNotes,
  deleteOneNote,
} from "./note.service.js";
import { successResponse } from "../../common/utils/response/index.js";

const router = Router();

router.post("/", async (req, res, next) => {
  const result = await createOneNote(req.body, req.headers.authorization);
  return successResponse({
    res,
    message: "Note Created Successfully",
    status: 200,
    data: { result },
  });
});
router.patch("/all", async (req, res, next) => {
  const result = await updateManyNotes(req.body, req.headers.authorization);
  return successResponse({
    res,
    message: "Note Created Successfully",
    status: 200,
    data: { result },
  });
});
router.patch("/:noteId", async (req, res, next) => {
  const result = await updateOneNote(
    req.body,
    req.params.noteId,
    req.headers.authorization,
  );
  return successResponse({
    res,
    message: "Note Updated Successfully",
    status: 200,
    data: { result },
  });
});

router.put("/replace/:noteId", async (req, res, next) => {
  const result = await replaceOneNote(
    req.body,
    req.params.noteId,
    req.headers.authorization,
  );
  return successResponse({
    res,
    message: "Note Replaced Successfully",
    status: 200,
    data: { result },
  });
});

router.delete("/:noteId", async (req, res, next) => {
  const result = await deleteOneNote(
    req.params.noteId,
    req.headers.authorization,
  );
  return successResponse({
    res,
    message: "Note Created Successfully",
    status: 200,
    data: { result },
  });
});

router.get("/paginate-sort", async (req, res, next) => {
  const result = await getUserNotes(
    req.query.page,
    req.query.limit,
    req.headers.authorization,
  );
  return successResponse({
    res,
    message: "Notes Retrieved Successfully",
    status: 200,
    data: { result },
  });
});

router.get("/note-by-content", async (req, res, next) => {
  const result = await getUserNotesByContent(
    req.query.content,
    req.headers.authorization,
  );
  return successResponse({
    res,
    message: "Notes Retrieved Successfully",
    status: 200,
    data: { result },
  });
});
router.get("/note-with-user", async (req, res, next) => {
  const result = await getUserNotesDetailed(req.headers.authorization);
  return successResponse({
    res,
    message: "Notes Retrieved Successfully",
    status: 200,
    data: { result },
  });
});
router.get("/aggregate", async (req, res, next) => {
  const result = await getUserNotesAggregate(
    req.query.title,
    req.headers.authorization,
  );
  return successResponse({
    res,
    message: "Notes Retrieved Successfully",
    status: 200,
    data: { result },
  });
});
router.get("/:noteId", async (req, res, next) => {
  const result = await getOneNote(req.params.noteId, req.headers.authorization);
  return successResponse({
    res,
    message: "Note Retrieved Successfully",
    status: 200,
    data: { result },
  });
});
router.delete("/", async (req, res, next) => {
  const result = await deleteUserNotes(req.headers.authorization);
  return successResponse({
    res,
    message: "Notes Deleted Successfully",
    status: 200,
    data: { result },
  });
});
export default router;
