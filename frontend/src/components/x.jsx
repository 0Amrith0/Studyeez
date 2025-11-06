import { Circle, Minimize2, Pencil, Trash2 } from "lucide-react";
import { useRef, useState, useEffect } from "react";

const x = ({ note, updatePosition }) => {

    // ✅ Initialize position safely
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const noteRef = useRef(null);

    // ✅ When note or its position changes, update local position
    useEffect(() => {
        if (note?.position) {
            setPosition({
                x: note.position.x,
                y: note.position.y
            });
        }
    }, [note]);

    const setEditingNote = () => { };
    const handleDelete = () => { };
    const handleClick = () => setOpenNote(prev => !prev);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        noteRef.current.startX = e.clientX - position.x;
        noteRef.current.startY = e.clientY - position.y;
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const newX = e.clientX - noteRef.current.startX;
        const newY = e.clientY - noteRef.current.startY;
        setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = async () => {
        if (isDragging) {
            setIsDragging(false);
            if (note?._id) {
                await updatePosition(note._id, position);
            }
        }
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        } else {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging]);

    
    return (
        <div
            ref={noteRef}
            onMouseDown={handleMouseDown}
            className="absolute cursor-grab active:cursor-grabbing"
            style={{ top: position.y, left: position.x }}
        >
            {openNote ? (
                <div className="relative flex border-2 border-gray-500 flex-col transition-all duration-500
                items-center justify-center bg-gradient-to-br from-black to-gray-800 rounded-b-lg py-4 px-2">

                    <div className="absolute top-1 left-26 flex items-center justify-center">
                        <Circle className="text-gray-500 fill-white size-4" />
                    </div>

                    <p className="max-w-48 mt-4 text-xs h-full text-gray-400 text-center">
                        fdfgfds g dsg fdgs dgdgsd gsg dsgsdg shwtg  t  egfs ger g sergs
                        erg serg sgdf geg re g esrgeg ge gg sedf gg gesg t h g sg g er geger
                        e gesr geg ger gesg erg esges gesg esg erg er   hsre h rg ges gse g
                    </p>

                    <div className="flex absolute top-2 right-0 items-center gap-1 px-3">
                        <button onClick={handleClick} className="text-blue-400 btn-circle p-1 hover:bg-gray-700 transition cursor-pointer">
                            <Minimize2 size={15} />
                        </button>
                        <button
                            className="text-blue-400 btn-circle p-1 hover:bg-gray-700 transition cursor-pointer"
                            onClick={() => setEditingNote({ _id: note._id, content: note.content })}
                        >
                            <Pencil size={15} />
                        </button>
                        <button onClick={handleDelete} className="btn-circle p-1 hover:bg-gray-700 text-red-400 transition cursor-pointer">
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
};

export default x;
