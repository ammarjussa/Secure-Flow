"use client";

import React from "react";

const LoginPage: React.FC = () => {
  return (
    <div className="flex items-center justify-between min-h-[calc(100vh-114px)] bg-white">
      <div className="flex flex-col justify-center md:flex-row w-full max-w-md md:max-w-5xl">
        <div className="md:w-1/2">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-center mb-6">
              Welcome to SecureFlow
            </h2>
            <form className="px-8 pt-6 pb-8 mb-4">
              <div className="mb-4">
                <input
                  className="shadow appearance-none bg-gray-100 border rounded-lg w-full py-2 px-3 text-gray-800  focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  placeholder="Email address"
                />
              </div>
              <div className="mb-4">
                <input
                  className="shadow appearance-none border bg-gray-100 rounded-lg w-full py-2 px-3 text-gray-800 focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="Password"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                >
                  Sign In
                </button>
                <a
                  className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                  href="#"
                >
                  Forgot Password?
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="md:w-1/3 absolute right-0 bg-gray-200 p-8 flex flex-col justify-center items-end h-screen">
        <div className="flex flex-col items-center justify-center h-full">
          <h3 className="text-2xl font-bold mb-4">
            New here? Sign up and discover a great amount of new opportunities!
          </h3>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
