import React, { Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import { signout } from "../helpers/auth";
import { ToastContainer, toast } from "react-toastify";
import { isAuth } from "../helpers/auth";

function App({ history }) {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <ToastContainer />
      <div className="max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-8/12 p-6 sm:p-12">
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-2xl font-extrabold  text-center ">
              Ultimate Auth with Email & Facebook & Google with diferent roles,
              email verification & Forget passwored{" "}
            </h1>
            <div className="w-full flex-1 mt-8 text-indigo-500">
              <div className="my-12 border-b text-center">
                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                  Features
                </div>
              </div>
              <div className="mx-auto max-w-xs relative ">
                {isAuth() ? (
                  <Fragment>
                    <button
                      onClick={() => {
                        signout(() => {
                          toast.error("Signout Successfully");
                          history.push("/");
                        });
                      }}
                      className="mt-5 tracking-wide font-semibold bg-pink-500 text-gray-100 w-full py-4 rounded-lg hover:bg-pink-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                    >
                      <i className="fas fa-sign-out-alt  w-6  -ml-2" />
                      <span className="ml-3">Signout</span>
                    </button>

                    <Link
                      to="/dashboard"
                      className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                    >
                      <i className="fas fa-sign-in-alt  w-6  -ml-2" />
                      <span className="ml-3">Dashboard</span>
                    </Link>
                  </Fragment>
                ) : (
                  <Fragment>
                    <Link
                      to="/login"
                      className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                    >
                      <i className="fas fa-sign-in-alt  w-6  -ml-2" />
                      <span className="ml-3">Sign In</span>
                    </Link>
                  </Fragment>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      ;
    </div>
  );
}

export default App;
