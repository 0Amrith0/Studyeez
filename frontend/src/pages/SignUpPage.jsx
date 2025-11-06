import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BookOpen } from "lucide-react";
import { Link } from "react-router"
import { useState } from 'react'
import toast from 'react-hot-toast';

const SignUpPage = () => {

    const queryClient = useQueryClient();

    const [signupData, setSignupData] = useState({
        email: "",
        username: "",
        password: ""
    })

    const { mutate: signUpMutation, isPending, error, isError } = useMutation({
        mutationFn: async ({ email, username, password }) => {
            try {
                const res = await fetch("/api/auth/signup", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({ email, username, password })
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

    const handleSignup = (e) => {
        e.preventDefault();
        signUpMutation(signupData);
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-800 
                p-2 sm:p-4 md:p-6 transition-all'>
            <div className='w-full max-w-5xl flex flex-col sm:flex-row items-stretch bg-gradient-to-br from-gray-700 to-black rounded-2xl justify-center overflow-hidden'>

                <div className='w-full sm:w-1/2 flex-col items-center justify-center'>
                    <div className="max-w-md pr-8 pl-8 pb-8 flex-col items-center justify-center">
                        <div className="relative aspect-square max-w-sm mx-auto">
                            <img src="/i.png" className="w-full h-full" />
                        </div>
                        <div className="text-center space-y-3 mt-6 flex-col items-center justify-center">
                            <h2 className="text-xl text-gray-100 font-semibold">Read smarter. Summarize faster. Remember better.</h2>
                            <p className="text-gray-300 opacity-70">
                                From reading to insight - instantly with InkWell.
                            </p>
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
                            <form onSubmit={handleSignup}>
                                <div className="space-y-4">
                                    <div className='text-white'>
                                        <h2 className="text-xl font-semibold">Create an Account</h2>
                                        <p className="text-sm opacity-70">
                                            Join InkWell and read the way you want !
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="form-control w-full">
                                            <label className="label text-gray-400">
                                                <span className="label-text">Username</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Choose a username"
                                                className="input input-bordered w-full rounded-xl"
                                                value={signupData.username}
                                                onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="form-control w-full">
                                            <label className="label text-gray-400">
                                                <span className="label-text">Email</span>
                                            </label>
                                            <input
                                                type="email"
                                                placeholder="abc@example.com"
                                                className="input input-bordered w-full rounded-xl"
                                                value={signupData.email}
                                                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
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
                                                value={signupData.password}
                                                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                                required
                                            />
                                            <p className="text-xs opacity-70 mt-1 text-white">
                                                Password must be at least 6 characters long
                                            </p>
                                        </div>
                                    </div>

                                    <button className="btn bg-blue-600 border-0 w-full text-white" type="submit">
                                        {isPending ? (
                                            <>
                                                <span className="loading loading-spinner loading-xs"></span>
                                                Loading...
                                            </>
                                        ) : ("Create Account")}
                                    </button>
                                    {isError && <p className='text-red-500'>{error.message}</p>}

                                    <div className="text-center mt-4">
                                        <p className="text-sm text-white">
                                            Already have an account?{" "}
                                            <Link to="/login" className="text-blue-500 hover:underline">
                                                Sign in
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