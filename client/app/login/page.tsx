"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import firebase_app from "@/firebase/firebase";

const auth = getAuth(firebase_app);

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (result) {
        router.push("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex items-center justify-between min-h-[calc(100vh-110px)] bg-white">
      <div className="flex flex-col justify-center md:flex-row w-full max-w-md md:max-w-5xl">
        <div className="md:w-1/2">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-center mb-6">
              Login to your account
            </h2>

            <form className="px-8 pt-6 pb-8 mb-4 flex flex-col items-center">
              <div className="mb-4">
                <input
                  className="shadow appearance-none bg-gray-100 border rounded-lg w-full py-2 px-3 pr-10 text-gray-800  focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  placeholder="Email address"
                  onChange={(e: any) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <input
                  className="shadow appearance-none border bg-gray-100 rounded-lg w-full py-2 px-3 pr-10 text-gray-800 focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="Password"
                  onChange={(e: any) => setPassword(e.target.value)}
                />
              </div>

              <button
                className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-10 rounded-3xl focus:outline-none focus:shadow-outline"
                type="submit"
                onClick={handleSubmit}
                onKeyDown={(e: any) => {
                  console.log(e.key);
                  e.key === "Enter" ? handleSubmit : null;
                }}
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="md:w-1/3 absolute right-0 bg-gray-200 p-8 flex flex-col justify-center items-end h-screen">
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-bold mb-4">New here?</h1>
          <p className="mb-4">
            Sign up and discover a great amount of new opportunities!
          </p>
          <div className="flex flex-col items-center">
            <button
              className="text-blue-500 hover:text-blue-700 bg-white self-center font-bold py-2 px-10 rounded-3xl focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => router.push("/signup")}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
