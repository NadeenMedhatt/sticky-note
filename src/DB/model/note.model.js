import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title Is Required"],
      validate: {
        validator: function (value) {
          return value !== value.toUpperCase();
        },
        message: (props) => `Title Cannot be totally UpperCase`,
      },
    },
    content: {
      type: String,
      required: [true, "Content Is Required"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId Is Required"],
    },
  },
  {
    collection: "NOTES",
    strict: true,
    timestamps: true,
    autoIndex: true,
    validateBeforeSave: true,
  },
);

export const NoteModel =
  mongoose.models.Note || mongoose.model("Note", noteSchema);
