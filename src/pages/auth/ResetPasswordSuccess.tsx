import React from "react";
import { Link } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const ResetSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3effd] px-4">
      <div className="bg-white p-10 rounded-2xl shadow-md border border-purple-100 w-full max-w-md text-center">
        <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-6" />

        <div className="  bg-[#f4f1fa] text-black-800 border border-green-200 rounded-lg p-4">
          <p>
            Password reset link has been sent successfully! Please check your
            email and follow the instructions to reset your password.
          </p>
        </div>

        <div className="text-right pt-4 ">
          <Link
            to="/login"
            className="text-[#4b2a75] hover:underline font-medium text-sm ">
            ← Back to Sign In page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetSuccess;
