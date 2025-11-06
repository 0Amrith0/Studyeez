import { NotebookIcon } from "lucide-react";

const NoBook = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-3 pb-8 max-w-screen mx-auto text-center">
      <div className="flex items-center justify-center bg-gradient-to-br to-black from-gray-700 size-fit rounded-full mt-10 p-8">
        <NotebookIcon className="size-18 text-gray-300" />
      </div>
      <p className="text-gray-400">
        No books yet. Add your first book!
      </p>
    </div>
  );
};

export default NoBook;
