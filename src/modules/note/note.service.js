import {
  ErrorException,
  NotFoundException,
} from "../../common/utils/response/error.response.js";
import { decodeToken } from "../../common/utils/security/tokenDecode.js";
import { NoteModel } from "../../DB/model/note.model.js";
import { UserModel } from "../../DB/model/user.model.js";

/* Create a Single Note (Get the id for the logged-in user (userId) from the token not the body) (send the tokenintheheaders) */
/*URL: POST /notes */
export const createOneNote = async (inputs, token) => {
  const { title, content } = inputs;

  const decoded = await decodeToken(token);

  const user = await UserModel.findById(decoded.userId);

  if (!user) {
    NotFoundException("User Not Found");
  }

  const note = await NoteModel.create({
    title,
    content,
    userId: decoded.userId,
  });

  return note;
};

/*Update a single Note by its id and return the updated note. (Only the owner of the note can make this operation)
(Get the id for the logged-in user (userId) from the token not the bod */
/*  PATCH /notes/:noteId => /notes/64d91c42d8979e1f30a12346 */
export const updateOneNote = async (inputs, noteId, token) => {
  const { title, content } = inputs;

  const decoded = await decodeToken(token);

  const user = await UserModel.findById(decoded.userId);

  if (!user) {
    NotFoundException("User Not Found");
  }

  const note = await NoteModel.findById(noteId);

  if (!note) {
    NotFoundException("Note Not Found");
  }

  if (note.userId.toString() !== user._id.toString()) {
    ErrorException({
      message: "You Are Not The Owner",
      cause: { status: 500 },
    });
  }

  const updatedNote = await NoteModel.updateOne(
    { _id: noteId },
    {
      $set: {
        title,
        content,
        userId: decoded.userId,
      },
    },
  );

  return updatedNote;
};
/*Replace the entire note document with the new data provided in the request body. (Only the owner of the notecanmake this operation) (Get the id for the logged-in user (userId) from the token not the body)  */
/* PUT /notes/replace/:noteId=> /notes/replace/64d91c42d8979e1f30a1234 */
export const replaceOneNote = async (inputs, noteId, token) => {
  const { title, content } = inputs;

  const decoded = await decodeToken(token);

  const user = await UserModel.findById(decoded.userId);

  if (!user) {
    NotFoundException("User Not Found");
  }

  const note = await NoteModel.findById(noteId);

  if (!note) {
    NotFoundException("Note Not Found");
  }

  if (note.userId.toString() !== user._id.toString()) {
    ErrorException({
      message: "You Are Not The Owner",
      cause: { status: 500 },
    });
  }

  const replacedNote = await NoteModel.replaceOne(
    { _id: noteId },
    {
      title,
      content,
      userId: decoded.userId,
    },
  );

  return replacedNote;
};
/* Updates the title of all notes created by a logged-in user.) (Get the new Title from the body) (Get the id for the
logged-in user (userId) from the token not the body)  */
/* PATCH /notes/all */
export const updateManyNotes = async (inputs, token) => {
  const { title } = inputs;

  const decoded = await decodeToken(token);

  const user = await UserModel.findById(decoded.userId);

  if (!user) {
    NotFoundException("User Not Found");
  }

  const updatedNotes = await NoteModel.updateMany(
    { userId: user._id },
    {
      $set: {
        title,
      },
    },
  );

  return updatedNotes;
};

/* Delete a single Note by its id and return the deleted note. (Only the owner of the note can make this operation)
(Get the id for the logged-in user from the token not the body) */
/*  DELET /notes/:noteId => /notes/64d91c42d8979e1f30a12346 */
export const deleteOneNote = async (noteId, token) => {
  const decoded = await decodeToken(token);

  const user = await UserModel.findById(decoded.userId);

  if (!user) {
    NotFoundException("User Not Found");
  }

  const note = await NoteModel.findById(noteId);

  if (!note) {
    NotFoundException("Note Not Found");
  }

  if (note.userId.toString() !== user._id.toString()) {
    ErrorException({
      message: "You Are Not The Owner",
      cause: { status: 500 },
    });
  }

  const deletedNote = await NoteModel.deleteOne({ _id: noteId });

  return deletedNote;
};

/* Retrieve a paginated list of notes for the logged-in user, sorted by “createdAt”in descending order. (Get page and limit from query parameters) (Get the id for the logged-in user (userId) from the token not the body) (sendthetoken in the headers)  */
/*  GET /notes/paginate-sort => for example /notes/paginate-sort?page=2&limit=3 */
export const getUserNotes = async (page, limit, token) => {
  const decoded = await decodeToken(token);

  const user = await UserModel.findById(decoded.userId);

  if (!user) {
    NotFoundException("User Not Found");
  }

  const skip = (page - 1) * limit;

  const userNotes = await NoteModel.find({ userId: decoded.userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const totalNotes = await NoteModel.countDocuments({ userId: decoded.userId });

  const totalPages = Math.ceil(totalNotes / limit);

  return {
    data: userNotes,
    meta: {
      total: totalNotes,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};
/* Get a note by its id. (Only the owner of the note can make this operation) (Get the id for the logged-in user (userId)from the token not the body) */
/* GET /notes/:id => /posts/64a3baf1e567890124 */
export const getOneNote = async (noteId, token) => {
  const decoded = await decodeToken(token);

  const user = await UserModel.findById(decoded.userId);

  if (!user) {
    NotFoundException("User Not Found");
  }

  const note = await NoteModel.findById(noteId);

  if (!note) {
    NotFoundException("Note Not Found");
  }

  if (note.userId.toString() !== user._id.toString()) {
    ErrorException({
      message: "You Are Not The Owner",
      cause: { status: 500 },
    });
  }

  return note;
};
/* Get a note for logged-in user by its content. (Get the id for the logged-in user (userId) from the token not the body) */
/* GET /notes/note-by-content => / notes/note-by-content?content=Workout Plan */
export const getUserNotesByContent = async (content, token) => {
  const decoded = await decodeToken(token);

  const user = await UserModel.findById(decoded.userId);

  if (!user) {
    NotFoundException("User Not Found");
  }
  const userNotes = await NoteModel.find({
    userId: decoded.userId,
    content,
  }).lean();

  return userNotes;
};
/* Retrieves all notes for the logged-in user with user information, selecting only the “title, userId and createdAt”
from the note and the “email” from the user. (Get the id for the logged-in user (userId) from the token not thebody) */
/* GET /notes/note-with-user */
export const getUserNotesDetailed = async (token) => {
  const decoded = await decodeToken(token);

  const user = await UserModel.findById(decoded.userId);

  if (!user) {
    NotFoundException("User Not Found");
  }
  const userNotes = await NoteModel.find({
    userId: decoded.userId,
  })
    .select("title userId createdAt")
    .populate({
      path: "userId",
      select: "email",
    })
    .lean();

  return userNotes;
};
/*  Using aggregation, retrieves all notes for the logged-in user with user information (name and email) and allowsearching notes by the title.  */
/* GET /notes/aggregate => /notes/aggregate?title=Code Review Notes */
export const getUserNotesAggregate = async (title, token) => {
  const decoded = await decodeToken(token);

  const user = await UserModel.findById(decoded.userId);

  if (!user) {
    NotFoundException("User Not Found");
  }
  const userNotes = await NoteModel.aggregate([
    {
      $match: {
        userId: user._id,
        title,
      },
    },
    {
      $lookup: {
        from: "USERS",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $project: {
        title: 1,
        content: 1,
        createdAt: 1,
        "user.name": 1,
        "user.email": 1,
      },
    },
  ]);

  return userNotes;
};
/*Delete all notes for the logged-in user. (Get the id for the logged-in user (userId) from the token not the body)  */
/* DELETE /notes */
export const deleteUserNotes = async (token) => {
  const decoded = await decodeToken(token);

  const user = await UserModel.findById(decoded.userId);

  if (!user) {
    NotFoundException("User Not Found");
  }
  const userNotes = await NoteModel.deleteMany({ userId: decoded.userId });

  return userNotes;
};
