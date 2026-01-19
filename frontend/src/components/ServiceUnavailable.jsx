import React from "react";
import { Link } from "react-router-dom";

const ServiceUnavailable = ({ onRetry }) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border p-8 text-center">
        <div className="mx-auto w-14 h-14 rounded-full bg-black text-white flex items-center justify-center text-2xl">
          404
        </div>

        <h2 className="mt-5 text-2xl font-semibold text-gray-900">
          Sorry, the service is not available
        </h2>

        <p className="mt-2 text-gray-600 text-sm sm:text-base">
          Our server is not responding at the moment. Please try again later.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={onRetry}
            className="px-5 py-2 rounded-lg bg-black text-white text-sm hover:bg-gray-800 transition"
          >
            Try Again
          </button>

          <Link
            to="/"
            className="px-5 py-2 rounded-lg border text-sm text-gray-700 hover:bg-gray-50 transition"
          >
            Go Home
          </Link>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          If the problem continues, please check again in a few minutes.
        </p>
      </div>
    </div>
  );
};

export default ServiceUnavailable;
