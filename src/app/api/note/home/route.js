



import { NextResponse } from "next/server";
import Note from "@/models/noteModel.js";
import jwt from "jsonwebtoken";
import { connect } from "@/dbConfig/dbConfig.js";

connect();

// GET all notes (with optional search)
export async function GET(request) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { searchParams } = request.nextUrl;
    const query = searchParams.get("query");

    let notes;

    if (query) {
      notes = await Note.find({
        userId,
        $or: [
          { title: { $regex: query, $options: "i" } },
          { content: { $regex: query, $options: "i" } },
        ],
      }).sort({ isPinned: -1 });
    } else {
      notes = await Note.find({ userId }).sort({ isPinned: -1 });
    }

    return NextResponse.json({
      success: true,
      notes,
      message: query ? "Filtered notes" : "All notes",
    });
  } catch (error) {
    console.error("GET /api/note/home error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST add new note
export async function POST(request) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { title, content, tags } = await request.json();

    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });
    if (!content) return NextResponse.json({ error: "Content is required" }, { status: 400 });

    const note = new Note({ title, content, tags, userId });
    await note.save();

    return NextResponse.json({ success: true, message: "Note added successfully", note });
  } catch (error) {
    console.error("POST /api/note/home error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update note
export async function PUT(request, { params }) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { noteId } = params;
    const { title, content, tags, isPinned } = await request.json();

    const note = await Note.findById(noteId);
    if (!note) return NextResponse.json({ error: "Note not found" }, { status: 404 });
    if (note.userId.toString() !== userId)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (tags !== undefined) note.tags = tags;
    if (isPinned !== undefined) note.isPinned = isPinned;

    await note.save();
    return NextResponse.json({ success: true, message: "Note updated successfully", note });
  } catch (error) {
    console.error("PUT /api/note/home/[noteId] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



