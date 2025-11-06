import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { PlusIcon, X } from "lucide-react";

const RightBar = ({ pageNumber, editingNote, isHighlightMode, setIsHighlightMode,
  highlightColor, setHighlightColor, highlightWidth, setHighlightWidth }) => {

  const queryClient = useQueryClient();
  const location = useLocation();

  const metadata = location.state;

  const handleToggle = () => {
    setOpenDrawer(prevState => !prevState);
  }

  const [openDrawer, setOpenDrawer] = useState(true);
  const [note, setNote] = useState({
    content: ""
  })

  useEffect(() => {
    if (editingNote) {
      setNote({ content: editingNote.content });
    }
  }, [editingNote]);


  const { mutate: noteMutation, isError, error } = useMutation({
    mutationFn: async ({ content, bookId, pageNumber, id, isEdit }) => {
      if (isEdit) {
        const res = await fetch(`/api/books/notes/${bookId}/${id}/edit`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
          credentials: "include",
        });
        return res.json();
      } else {
        const res = await fetch(`/api/books/notes/${bookId}?pageNumber=${pageNumber}&x=100&y=100`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
          credentials: "include",
        });
        return res.json();
      }
    },
    onSuccess: (data, variables) => {
      toast.success(variables.isEdit ? "Note updated successfully!" : "Note added!");
      setNote({ content: "" });
      queryClient.invalidateQueries(["notes", variables.bookId, variables.pageNumber]);
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  })

  const handleNoteChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value })
  }

  const handleNoteSubmit = (e) => {
    e.preventDefault();

    if (editingNote) {
      noteMutation({
        content: note.content,
        bookId: metadata._id,
        pageNumber,
        id: editingNote._id,
        isEdit: true,
      });
    } else {
      noteMutation({
        content: note.content,
        bookId: metadata._id,
        pageNumber,
      });
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen gap-20 w-full max-w-96 pr-2">

        {openDrawer ? (
          <>
            <form className="flex flex-col gap-2 w-full"
              onSubmit={handleNoteSubmit}
            >
              <h2 className='flex justify-between items-center pt-3'>
                <span className="text-xl font-semibold text-gray-300">
                  Add a Note
                </span>
                <span className="pt-2">
                  <X className='text-gray-600 hover:btn-circle hover:bg-gray-400 transition-all duration-300 cursor-pointer'
                    size={15}
                    onClick={handleToggle} />
                </span>
              </h2>

              <div className="relative">
                <textarea
                  name="content"
                  placeholder="Content"
                  className="textarea bg-gradient-to-br text-gray-200 from-gray-800 to-gray-950 textarea-bordered rounded-xl h-56 w-full"
                  onChange={handleNoteChange}
                  value={note.content}
                />

                <button
                  type="submit"
                  className="absolute bottom-2 right-2 bg-gray-900 hover:bg-gray-700 rounded-full p-2"
                >
                  <PlusIcon size={18} className="text-gray-400" />
                </button>
              </div>
              {isError && <p className='text-red-600'>{error.message}</p>}
            </form>

            <div className="p-3 bg-gray-800 rounded-lg mt-4">
              <h3 className="text-lg font-semibold text-gray-300 mb-3">Highlight</h3>

              <button
                className={`px-4 py-2 rounded-lg w-full 
                  ${isHighlightMode ? "bg-yellow-500 text-black" : "bg-gray-700 text-white"}`}
                onClick={() => setIsHighlightMode(!isHighlightMode)}
              >
                {isHighlightMode ? "Click to disable Highlight" : "Click to enable Highlight"}
              </button>

              <div className="mt-3">
                <label className="text-gray-400 text-sm">Color</label>
                <input
                  type="color"
                  value={highlightColor}
                  onChange={(e) => setHighlightColor(e.target.value)}
                  className="w-full h-10 rounded"
                />
              </div>

              <div className="mt-3">
                <label className="text-gray-400 text-sm">Width: {highlightWidth}</label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={highlightWidth}
                  onChange={(e) => setHighlightWidth(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

          </>) : (
          <button className="btn btn-circle bg-gradient-to-tr from-gray-600 to-gray-800 border-0
           rounded-full fixed bottom-4 right-4 animate-bounce" onClick={handleToggle}>
            <span className="text-lg text-center text-white"><PlusIcon /> </span>
          </button>
        )}

      </div>
    </>
  )

}

export default RightBar
