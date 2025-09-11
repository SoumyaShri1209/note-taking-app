'use client';

import NoteCard from "@/components/Cards/NoteCard";
import Navbar from "@/components/Navbar";
import TagInput from "@/components/TagInput";
import { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import EmptyCard from "@/components/EmptyCared/EmptyCard";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useSelector((state) => state.user);

  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState([]);
  const [openAddEditModel, setOpenAddEditModel] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState("");
  const [Error, setError] = useState(null);
  const [isPinned, setIsPinned] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isSearch, setIsSearch] = useState(false);

  // Close modal
  const onClose = () => {
    setOpenAddEditModel({ isShown: false, type: "add", data: null });
    setTags([]);
    setTitle("");
    setContent("");
    setError(null);
  };

  // Edit note
  const editNote = async () => {
    try {
      const res = await axios.put(
        `/api/note/home/${openAddEditModel.data._id}`,
        { title, content, tags, isPinned },
        { withCredentials: true }
      );

      if (!res.data.success) {
        setError(res.data.error);
        return;
      }

   
      setAllNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === res.data.note._id ? res.data.note : note
        )
      );

      toast.success("Note updated successfully");
      onClose();
    } catch (error) {
      toast.error("Note not updated");
    }
  };

  // Add new note
  const addNewNote = async () => {
    try {
      const res = await axios.post(
        "/api/note/home",
        { title, content, tags },
        { withCredentials: true }
      );

      if (!res.data.success) {
        setError(res.data.message);
        return;
      }

      getAllNotes(user._id);
      onClose();
      toast.success("Note added successfully");
    } catch (error) {
      toast.error("Note not added");
    }
  };

  // Delete note
  const deleteNote = async (data) => {
    const noteId = data._id;

    try {
      const res = await axios.delete(`/api/note/home/${noteId}`, {
        withCredentials: true,
      });

      if (!res.data.success) {
        toast.error("Note not deleted");
        return;
      }

      toast.success("Note deleted successfully");
      getAllNotes(user._id);
    } catch (error) {
      toast.error("Note not deleted");
    }
  };

  // Add / Update note handler
  const handleAddNote = () => {
    if (!title) {
      setError("Please enter the title");
      return;
    }
    if (!content) {
      setError("Please enter the content");
      return;
    }
    setError("");
    if (openAddEditModel.type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };

  // Edit note modal
  const handleEdit = (noteDetails) => {
    setOpenAddEditModel({ isShown: true, data: noteDetails, type: "edit" });
    setTitle(noteDetails.title);
    setContent(noteDetails.content);
    setTags(noteDetails.tags || []);
    setIsPinned(noteDetails.isPinned || false);
  };

  // Fetch all notes (with optional search query)
const getAllNotes = async (userId, query = "") => {
  try {
    const url = query
      ? `/api/note/home?query=${encodeURIComponent(query)}`
      : "/api/note/home";

    const res = await axios.get(url, { withCredentials: true }); 

    if (res.data.success) {
      const sortedNotes = res.data.notes.sort((a, b) => b.isPinned - a.isPinned);
      setAllNotes(sortedNotes);
    }
  } catch (err) {
    console.error("Error fetching notes:", err.message);

    if (err.response?.status === 401) {
   
      router.push("/login");
    }
  }
};


  // Handle search
  const handleSearchNotes = (query) => {
    if (query.trim()) {
      setIsSearch(true);
      getAllNotes(user._id, query);
    } else {
      setIsSearch(false);
      getAllNotes(user._id);
    }
  };

  const updateIsPinned = async (noteData) => {
    try {
      const res = await axios.put(
        `/api/note/home/${noteData._id}`,
        { ...noteData, isPinned: !noteData.isPinned },
        { withCredentials: true }
      );

      if (!res.data.success) {
        toast.error("Not pinned, something went wrong");
        return;
      }

      toast.success(noteData.isPinned ? "Unpinned successfully" : "Pinned successfully");
      getAllNotes(user._id);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted) {
      if (!user) {
        router.push("/login");
      } else {
        setUserInfo(user);
        getAllNotes(user._id);
      }
    }
  }, [mounted, user, router]);

  if (!mounted) return null; // Prevent hydration mismatch
  if (loading) return <p className="text-center text-pink-900">Loading...</p>;
  if (!user) return null; // Redirect handled in useEffect

  return (
    <>
      <div className="bg-[linear-gradient(135deg,theme(colors.pink.600),theme(colors.pink.400))] min-h-screen">
        <Navbar userInfo={userInfo} onSearch={handleSearchNotes} />

        <div className="container mx-auto p-4">
          {allNotes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 max-md:mt-5 pb-20">
              {allNotes.map((note) => (
                <NoteCard
                  key={note._id}
                  title={note.title}
                  date={note.createdAt?.slice(0, 10)}
                  content={note.content}
                  tags={note.tags}
                  isPinned={note.isPinned}
                  onEdit={() => handleEdit(note)}
                  onDelete={() => deleteNote(note)}
                  onPinNote={() => updateIsPinned(note)}
                />
              ))}
            </div>
          ) : isSearch ? (
            <EmptyCard
              imgSrc="https://cdn-icons-png.flaticon.com/512/7486/7486764.png"
              message="Oops! No note found"
            />
          ) : (
            <EmptyCard
              imgSrc="https://imgs.search.brave.com/pUe5B5Xard0u5zam-QQZvsCQv5rOMvP2e3a1OdM2120/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9ub3Rl/LXBhcGVyLTI3MTQx/MjUuanBn"
              message="Ready to capture your ideas? Click the 'Add' button to start noting down your thoughts, inspiration and reminders. Let's get started!."
            />
          )}
        </div>
      </div>

      {/* Floating Add Button */}
      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-green-600 hover:bg-green-700 cursor-pointer fixed right-10 bottom-10"
        onClick={() =>
          setOpenAddEditModel({ isShown: true, type: "add", data: null })
        }
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      {/* Modal */}
      <Modal
        isOpen={openAddEditModel.isShown}
        onRequestClose={onClose}
        contentLabel="Add/Edit Note Modal"
        ariaHideApp={false}
        className="w-[40%] max-md:w-[60%] max-sm:w-[70%] max-h-3/4"
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 50,
          },
          content: {
            position: "relative",
            inset: "auto",
            padding: "1.5rem",
            borderRadius: "1rem",
            width: "100%",
            maxWidth: "60%",
            height: "auto",
            maxHeight: "80vh",
            overflowY: "auto",
            backgroundColor: "rgb(210, 130, 144)",
          },
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-pink-900">
            Add/Edit Note
          </h2>
          <button
            onClick={onClose}
            className="text-pink-900 text-2xl md:text-3xl font-bold hover:text-red-800 cursor-pointer"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Title..."
            className="p-2 border border-white rounded focus:outline-none focus:ring-1 focus:ring-pink-400 w-full text-sm md:text-base text-pink-950 placeholder-gray-200"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="p-2 border rounded focus:outline-none focus:ring-1 focus:ring-pink-400 w-full text-sm md:text-base placeholder-gray-200 text-pink-950 border-white"
            rows={5}
          />
          <TagInput tags={tags} setTags={setTags} />
        </div>

        {Error && <p className="text-red-600 text-s pt-4">{Error}</p>}

        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 rounded hover:bg-red-600 w-full sm:w-auto cursor-pointer"
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full sm:w-auto cursor-pointer"
            onClick={handleAddNote}
          >
            {openAddEditModel.type === "edit" ? "Update" : "Add"}
          </button>
        </div>
      </Modal>
    </>
  );
}


