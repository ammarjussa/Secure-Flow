"use client";

import React from "react";

const LoginPage: React.FC = () => {
  return (
    <div className="flex items-center justify-between min-h-[calc(100vh-110px)] bg-white">
      <div className="flex flex-col justify-center md:flex-row w-full max-w-md md:max-w-5xl">
        <div className="md:w-1/2">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-center mb-6">
              Login to your account
            </h2>
            <div className="flex flex-col items-center">
              <h5>Login using social networks</h5>
              <div className="flex flex-row items-center">
                <img
                  alt="google"
                  className="mt-2 w-10 h-10 cursor-pointer"
                  src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                />
              </div>
              <span className="mt-4">OR</span>
            </div>
            <form className="px-8 pt-6 pb-8 mb-4 flex flex-col items-center">
              <div className="mb-4">
                <input
                  className="shadow appearance-none bg-gray-100 border rounded-lg w-full py-2 px-3 pr-10 text-gray-800  focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  placeholder="Email address"
                />
              </div>
              <div className="mb-4">
                <input
                  className="shadow appearance-none border bg-gray-100 rounded-lg w-full py-2 px-3 pr-10 text-gray-800 focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="Password"
                />
              </div>

              <button
                className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-10 rounded-3xl focus:outline-none focus:shadow-outline"
                type="button"
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
