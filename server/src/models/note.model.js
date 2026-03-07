import mongoose from "mongoose";

const collaboratorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: ["editor", "viewer"],
      default: "viewer",
    },
  },
  { _id: false }
);

const noteSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      default: "",
      trim: true,
    },

    content: {
      type: String,
      default: "", // TipTap HTML
    },

    pinned: {
      type: Boolean,
      default: false,
    },

    archived: {
      type: Boolean,
      default: false,
    },

    trashed: {
      type: Boolean,
      default: false,
    },

    collaborators: [collaboratorSchema],
  },
  { timestamps: true }
);

noteSchema.index({ title: "text", content: "text" });

export default mongoose.model("Note", noteSchema);