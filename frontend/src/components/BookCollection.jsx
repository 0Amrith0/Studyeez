import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AiFillDelete, AiFillFolder } from "react-icons/ai";
import NavBar from "./NavBar";
import NoBook from "./NoBook";
import { UploadCloud } from "lucide-react";

const BookCollection = ({ authUser }) => {
 
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: books = [], isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const res = await fetch("/api/books", {
        credentials: "include"
      });
      if (!res.ok) {
        throw new Error("Failed to fetch books");
      }
      return res.json();
    },
  });

  const { mutate: uploadBook } = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/books", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to upload");
      return data;
    },
    onSuccess: (data) => {
      toast.success("Book uploaded successfully!");
      queryClient.setQueryData(["books"],
        old => [data.newBook, ...old]);

      queryClient.setQueryData(["authUser"],
        old => ({ ...old, books: [data.newBook._id, ...old.books] }));
    },
    onError: (err) => {
      toast.error(err.message || "Upload failed");
    },
  });

  const { mutate: deleteBook } = useMutation({
    mutationFn: async (bookId) => {
      try {
        const res = await fetch(`/api/books/${bookId}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to delete book");
        return bookId;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (bookId) => {
      toast.success("Book deleted successfully!");
      queryClient.setQueryData(["books"],
        (old) => old.filter((book) => book._id !== bookId));

      queryClient.setQueryData(["authUser"], old => ({
        ...old,
        books: old.books.filter(id => id !== bookId)
      }));
    }
  });

  const [file, setFile] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    uploadBook(file);
    setFile("");
  };

  const handleOpenBook = (book) => {
    const metadata = {
      _id: book._id,
      filePath: book.filePath,
      title: book.title,
      timestamp: Date.now(),
    };
    navigate(`/books/${book._id}`, { state: metadata });
  };

  if (isLoading) return <div className="text-white text-center py-10">Loading books...</div>;

  return (
    <>
      <div className="flex flex-col bg-gradient-to-br min-h-screen from-gray-700 to-black">
        <NavBar />

        <div className="flex">

          <div className="flex flex-col items-center w-full pt-6">
            <label className="max-w-2xl py-2 flex flex-col gap-2 items-center border-2 border-dashed 
            rounded-lg border-gray-600 cursor-pointer text-gray-400 px-3">
              <UploadCloud className="text-gray-300" size={60} />
              {file ? file.name : "Click here to upload your book"}
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              {file ? (
                <button className="btn px-2 h-auto border-0 text-white shadow-none bg-gray-500"
                  onClick={handleUpload}>
                  Upload
                </button>
              ) : ("")}

            </label>
            <h2 className="text-2xl pt-2 text-white font-bold">Welcome, {authUser.username} !</h2>
            {(books?.length) === 0 ? <NoBook /> :
              (
                <div className="grid grid-cols-1 sm:grid-cols-3 px-2 sm:px-5 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
                  {books.map((book) => (
                    <div
                      key={book._id}
                      className="flex flex-col items-center cursor-pointer p-2 bg-gray-800 rounded-md hover:bg-gray-700 transition"
                      onClick={() => handleOpenBook(book)}
                    >
                      <AiFillFolder className="text-yellow-400 text-7xl mb-2" />
                      <span className="text-white text-md text-center truncate w-full">{book.title}</span>
                      <button
                        className="mt-1 text-red-500 hover:text-red-700 flex items-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteBook(book._id);
                        }}
                      >
                        <AiFillDelete /> Delete
                      </button>
                    </div>
                  ))}
                </div>
              )
            }

          </div>

        </div>
      </div>
    </>
  );
};

export default BookCollection;
