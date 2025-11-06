import { useLocation } from 'react-router-dom';
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ArrowLeft, ArrowRight } from "lucide-react";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import Note from './Note';


pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();


const ViewBook = ({ bookId, pageNumber, setPageNumber, setEditingNote,
  isHighlightMode, highlightColor, highlightWidth }) => {

  const location = useLocation();
  const metadata = location.state;

  const [numPages, setNumPages] = useState(null);
  const [startPos, setStartPos] = useState(null);
  const [currentHighlight, setCurrentHighlight] = useState(null);

  const { data: book, isLoading: loadingBook } = useQuery({
    queryKey: ["book", bookId],
    queryFn: async () => {
      const res = await fetch(`/api/books/${bookId}`,
        {
          credentials: "include"
        });
      if (!res.ok) throw new Error("Failed to fetch book");
      return res.json();
    }
  });

  const { data: notes, isLoading: loadingNote } = useQuery({
    queryKey: ["notes", bookId, pageNumber],
    queryFn: async () => {
      const res = await fetch(`/api/books/notes/${bookId}?pageNumber=${pageNumber}`,
        {
          credentials: "include"
        });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch notes");
      return data;
    },
    retry: false
  });

  const { mutate: highlight } = useMutation({
    mutationFn: async (highlight) => {
      try {
        await fetch(`/api/books/notes/${bookId}/highlights`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            pageNumber,
            x: highlight.x,
            y: highlight.y,
            width: highlight.width,
            height: highlight.height,
            color: highlight.color,
          }),
        })
      } catch (error) {
        console.error("Error saving highlight:", error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["highlights", bookId]);
    }
  })

  const { data: highlights = [] } = useQuery({
    queryKey: ["highlights", bookId],
    queryFn: async () => {
      const res = await fetch(`/api/books/notes/${bookId}/highlights`,
        {
          credentials: "include"
        });
      return res.json();
    },
    retry: false
  });

  if (loadingBook || loadingNote) return <p className="text-white">Loading...</p>;
  if (!book) return <p className="text-red-400">Book not found</p>;

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const nextPage = () => pageNumber < numPages && setPageNumber(page => page + 1);
  const prevPage = () => pageNumber > 1 && setPageNumber(page => page - 1);


  return (
    <>
      <div className="min-h-screen max-w-4xl w-full text-white flex justify-center items-center py-4">
        <div className='flex flex-col items-center'>

          <p className="pb-3">Page {pageNumber} of {numPages}</p>

          <div className="relative inline-block">

            <Document file={`http://localhost:6060${metadata.filePath}`} onLoadSuccess={onDocumentLoadSuccess}>
              <Page pageNumber={pageNumber} scale={1.5} className="pointer-events-none" />
            </Document>

            {notes?.map((note) => (
              <Note
                key={note._id}
                note={note}
                x={note.position?.x}
                y={note.position?.y}
                content={note.content}
                bookId={bookId}
                pageNumber={pageNumber}
                setEditingNote={setEditingNote}
              />
            ))}

            <div
              className="absolute top-0 left-0 w-full h-full"
              onMouseDown={(e) => {
                if (!isHighlightMode) return;
                const rect = e.target.getBoundingClientRect();
                setStartPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
              }}
              onMouseMove={(e) => {
                if (!isHighlightMode || !startPos) return;
                const rect = e.target.getBoundingClientRect();
                const x = e.clientX - rect.left;
                setCurrentHighlight({
                  x: startPos.x,
                  y: startPos.y,
                  width: x - startPos.x,
                  height: highlightWidth,
                  color: highlightColor,
                });
              }}
              onMouseUp={() => {
                if (currentHighlight) {
                  highlight(currentHighlight);
                }
                setStartPos(null);
                setCurrentHighlight(null);
              }}
            >

              {currentHighlight && (
                <div
                  style={{
                    position: "absolute",
                    top: currentHighlight.y,
                    left: currentHighlight.x,
                    width: currentHighlight.width,
                    height: currentHighlight.height,
                    backgroundColor: currentHighlight.color,
                    opacity: 0.3,
                    pointerEvents: "none",
                  }}
                />
              )}

              {highlights
                .filter((hl) => hl.pageNumber === pageNumber)
                .map((hl, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: "absolute",
                      top: hl.y,
                      left: hl.x,
                      width: hl.width,
                      height: hl.height,
                      backgroundColor: hl.color,
                      opacity: 0.3,
                      pointerEvents: "none",
                    }}
                  />
                ))}
            </div>
          </div>

          <div className="flex gap-4 items-center mt-4">
            <button onClick={prevPage} className="bg-gray-700 rounded-full p-2"><ArrowLeft /></button>
            <span>{pageNumber} / {numPages}</span>
            <button onClick={nextPage} className="bg-gray-700 rounded-full p-2"><ArrowRight /></button>
          </div>
        </div>
      </div >
    </>
  );
};

export default ViewBook;

