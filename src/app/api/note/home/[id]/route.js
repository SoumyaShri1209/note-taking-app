import { connect } from "@/dbConfig/dbConfig.js";
import Note from "@/models/noteModel.js";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";  

connect();


export async function PUT(request, { params }) {
  try {
    const noteId = params.id; // dynamic id from URL
    const body = await request.json();
    const { title, content, tags, isPinned } = body;

  
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;


    const updatedNote = await Note.findOneAndUpdate(
      { _id: noteId, userId },
      { title, content, tags, isPinned },
      { new: true }
    );

    if (!updatedNote) {
      return NextResponse.json({ success: false, error: "Note not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ success: true, note: updatedNote });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const noteId = params.id;

  
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) {
      return NextResponse.json({ error: "Note not found or unauthorized" }, { status: 404 });
    }

    await note.deleteOne();

    return NextResponse.json({ message: "Note deleted successfully", success: true });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
