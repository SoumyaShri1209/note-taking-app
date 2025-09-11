import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [String],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isPinned: { type: Boolean, default: false },
}, { timestamps: true });

const Note = mongoose.models.Note || mongoose.model("Note", noteSchema);

export default Note;
