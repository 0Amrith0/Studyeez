import { Navigate, Route, Routes } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Toaster } from "react-hot-toast"
import { Loader, NotebookIcon } from "lucide-react"


import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import HomePage from "./pages/HomePage"
import BookCollection from "./components/BookCollection"
import Note from "./components/Note"
import X from "./components/x"


function App() {

  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include"
        });

        if (res.status === 400 || res.status === 401) {
          return null;
        }

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        console.log("authUser", data);
        return data;

      } catch (error) {
        throw error;
      }
    },
    retry: false
  })

  if (isLoading) {
    return (
      <div className='h-screen flex animate-spin justify-center items-center'>
        <Loader className="text-xs" />
      </div>
    )
  }

  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={authUser ? <Navigate to="/collections" /> : <Navigate to="/login" />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/collections" />} />
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/collections" />} />
          <Route path="/books/:id" element={authUser ? <HomePage authUser={authUser} /> : <Navigate to="/login" />} />
          <Route path="/collections" element={authUser ? <BookCollection authUser={authUser} /> : <Navigate to="/login" />} />
        </Routes>

        <Toaster />
      </div>
      {/* <X /> */}

    </>
  )
}

export default App
