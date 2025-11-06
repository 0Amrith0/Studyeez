import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BookOpen } from "lucide-react";
import { Link } from "react-router"
import { useState } from 'react'
import toast from 'react-hot-toast';

const SignUpPage = () => {

    const queryClient = useQueryClient();

    const [loginData, setLoginData] = useState({
        username: "",
        password: ""
    })

    const { mutate: loginMutation, isPending, error, isError } = useMutation({
        mutationFn: async ({ username, password }) => {
            try {
                const res = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({ username, password })
                })

                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Sign up failed");
                }

                return data;

            } catch (error) {
                console.log(error);
                throw error;
            }
        },
        onSuccess: () => {
            toast.success("Logged in successfully!");
            queryClient.invalidateQueries(["authUser"])
        }
    })

    const handleLogin = (e) => {
        e.preventDefault();
        loginMutation(loginData);
    }


    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-800 
                p-2 sm:p-4 md:p-6 transition-all'>
            <div className='w-full max-w-5xl flex flex-col sm:flex-row items-stretch bg-gradient-to-br from-gray-700 to-black rounded-2xl justify-center overflow-hidden'>

                <div className='w-full sm:w-1/2 flex items-center justify-center'>
                    <div className="max-w-md p-8">
                        <div className="relative aspect-square max-w-sm mx-auto">
                            <img src="/i.png" className="w-full h-full" />
                        </div>
                    </div>
                </div>

                <div className='w-full sm:w-1/2 flex-col items-center justify-center'>
                    <div className="max-w-md p-8 flex-col items-center justify-center">
                        <div className="mb-4 flex items-center justify-start gap-2">
                            <BookOpen className="size-9 text-primary" />
                            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                                InkWell
                            </span>
                        </div>
                        <div>
                            <form onSubmit={handleLogin}>
                                <div className="space-y-4">
                                    <div className='text-white'>
                                        <p className="text-sm opacity-70">
                                            Sign in to continue with your book !
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="form-control w-full">
                                            <label className="label text-gray-400">
                                                <span className="label-text">Username</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter you username"
                                                className="input input-bordered w-full rounded-xl"
                                                value={loginData.username}
                                                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="form-control w-full">
                                            <label className="label text-gray-400">
                                                <span className="label-text">Password</span>
                                            </label>
                                            <input
                                                type="password"
                                                placeholder="********"
                                                className="input input-bordered w-full rounded-xl"
                                                value={loginData.password}
                                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button className="btn bg-blue-600 border-0 w-full text-white mt-4" type="submit">
                                        {isPending ? (
                                            <>
                                                <span className="loading loading-spinner loading-xs"></span>
                                                Loading...
                                            </>
                                        ) : ("Log in")}
                                    </button>
                                    {isError && <p className='text-red-500'>{error.message}</p>}

                                    <div className="text-center mt-4">
                                        <p className="text-sm text-white">
                                            Don't have an account?{" "}
                                            <Link to="/signup" className="text-blue-500 hover:underline">
                                                Sign Up
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default SignUpPage