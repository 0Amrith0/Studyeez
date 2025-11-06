import { Circle, Minimize2, Pencil, Trash2 } from 'lucide-react'
import { useState, useRef } from 'react'
import Draggable from "react-draggable";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useEffect } from 'react';

const Note = ({ note, _id, x, y, content, bookId, pageNumber, setEditingNote }) => {
  const [openNote, setOpenNote] = useState(false)
  const [position, setPosition] = useState({ x: x ?? 100, y: y ?? 100 });
  const [isDragging, setIsDragging] = useState(false);
  const noteRef = useRef(null);
  const queryClient = useQueryClient();


  const { mutate: moveNote } = useMutation({
    mutationFn: async ({ id, x, y }) => {
      const res = await fetch(`/api/books/notes/${bookId}/${id}/move?x=${x}&y=${y}`, {
        method: "PUT",
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to move the note");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notes", bookId, pageNumber]);
    }
  });

  const { mutate: deleteNote } = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/books/notes/${bookId}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete the note");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notes", bookId, pageNumber]);
      toast.success("Note deleted Successfully");
    }
  });

  useEffect(() => {
    if (note?.position) {
      setPosition({
        x: note.position.x,
        y: note.position.y
      });
    }
  }, [note]);

  const handleMouseDown = (e) => {
    if (!noteRef.current) return;
    setIsDragging(true);
    noteRef.current.startX = e.clientX - position.x;
    noteRef.current.startY = e.clientY - position.y;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newX = e.clientX - noteRef.current.startX;
    const newY = e.clientY - noteRef.current.startY;

    const pageWidth = noteRef.current.parentElement.offsetWidth;
    const pageHeight = noteRef.current.parentElement.offsetHeight;

    setPosition({
      x: Math.max(0, Math.min(newX, pageWidth - 50)),
      y: Math.max(0, Math.min(newY, pageHeight - 50))
    });
  };

  const handleMouseUp = async () => {
    if (isDragging) {
      setIsDragging(false);
      if (note?._id) {
        moveNote({ id: note._id, x: position.x, y: position.y });
      }
    }
  };

  const handleClick = () => setOpenNote(prev => !prev);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="absolute cursor-grab active:cursor-grabbing z-50"
      onMouseDown={handleMouseDown} ref={noteRef}
      style={{ top: position.y, left: position.x }}
    >
      {openNote ? (
        <div className="relative min-w-22 flex w-auto flex-col transition-all duration-500
                items-center justify-center bg-black border-6 border-white from-black to-gray-800 rounded-2xl py-4 px-2">

          <p className="max-w-48 mt-4 text-xs h-full text-gray-400 text-center">
            {content}
          </p>

          <div className="absolute top-1 right-1 flex items-center gap-1">
            <button className="text-blue-400 btn-circle p-1 hover:bg-gray-700 transition cursor-pointer"
              onClick={handleClick} >
              <Minimize2 size={15} />
            </button>

            <button className="text-blue-400 btn-circle p-1 hover:bg-gray-700 transition cursor-pointer"
              onClick={() => setEditingNote({ _id: note._id, content: note.content })}>
              <Pencil size={15} />
            </button>

            <button className="btn-circle p-1 hover:bg-gray-700 text-red-400 transition cursor-pointer"
              onClick={() => note?._id && deleteNote(note._id)} >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      ) : (
        <img
          src="/pin.png"
          className='w-4 h-6 cursor-pointer'
          onClick={handleClick}
        />
      )}
    </div>
  );
}

export default Note;