import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BookCopy, BookOpen, LogOutIcon } from 'lucide-react'
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom'

const NavBar = () => {

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: logoutMutation } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Logout failed");
      return data;
    },
    onSuccess: () => {
      toast.success("Logged out successfully!");
      queryClient.invalidateQueries(["authUser"]);
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });


  return (
    <div className="border-b border-gray-600">
      <div className='flex items-center justify-between px-2 py-3 sm:py-4 sm:px-10'>
        <Link to="/" >
          <div className='flex gap-1 items-center'>
            <BookOpen className="size-7 text-primary" />
            <span className="text-2xl sm:text-3xl font-bold font-mono bg-clip-text text-transparent 
          bg-gradient-to-r from-primary to-secondary tracking-wider">
              InkWell
            </span>
          </div>
        </Link>

        <div className='flex gap-2'>
          <Link to={"/collections"} className='btn bg-gradient-to-tr to-gray-900 from-gray-800 border-0
                rounded-xl w-auto h-8 bg-blue-500 bg-opacity-50'>
            <div className='flex justify-between items-center'>
              <BookCopy className='text-white size-5 pr-1' />
              <span className="hidden sm:inline py-1 text-white">Collections</span>
            </div>
          </Link>

          <button onClick={logoutMutation} className='btn bg-gradient-to-tr to-gray-900 from-gray-800 border-0
                rounded-xl w-auto h-8 bg-blue-500 bg-opacity-50'>
            <div className='flex justify-between items-center'>
              <LogOutIcon className='text-white size-5' />
              <span className="hidden sm:inline py-1 text-white">Logout</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default NavBar