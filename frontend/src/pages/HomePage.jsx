import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import RightBar from "../components/RightBar";
import ViewBook from "../components/ViewBook";
import { useState } from "react";

const HomePage = () => {

    const { id: bookId } = useParams();

    const [pageNumber, setPageNumber] = useState(1);
    const [editingNote, setEditingNote] = useState(null);
    const [isHighlightMode, setIsHighlightMode] = useState(false);
    const [highlightColor, setHighlightColor] = useState("#FFFF00");
    const [highlightWidth, setHighlightWidth] = useState(20);


    return (
        <div className="flex flex-col bg-gradient-to-br from-gray-700 to-black min-h-screen">
            <NavBar />
            <div className="flex gap-8 justify-center w-full">
                <ViewBook
                    bookId={bookId}
                    pageNumber={pageNumber}
                    setPageNumber={setPageNumber}
                    setEditingNote={setEditingNote}
                    isHighlightMode={isHighlightMode}
                    highlightColor={highlightColor}
                    highlightWidth={highlightWidth}
                />

                <RightBar
                    pageNumber={pageNumber}
                    editingNote={editingNote}
                    isHighlightMode={isHighlightMode}
                    setIsHighlightMode={setIsHighlightMode}
                    highlightColor={highlightColor}
                    setHighlightColor={setHighlightColor}
                    highlightWidth={highlightWidth}
                    setHighlightWidth={setHighlightWidth}
                />
            </div>

        </div>
    );
};

export default HomePage;
