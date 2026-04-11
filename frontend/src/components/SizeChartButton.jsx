import React, { useState } from "react";

const SizeChartButton = ({ sizeChart }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!sizeChart) {
    return null;
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="border-2 border-gray-300 px-4 py-2 rounded font-medium text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
      >
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zm0 8a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" />
        </svg>
        <span>Size Chart</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border-2 border-gray-300 rounded shadow-lg z-10 min-w-96">
          <div className="p-4">
            <h3 className="font-bold text-lg mb-3 text-gray-900">
              {sizeChart.name} - Size Guide
            </h3>
            {sizeChart.description && (
              <p className="text-sm text-gray-600 mb-3">{sizeChart.description}</p>
            )}

            {/* Size Chart Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="px-3 py-2 text-left font-semibold">Size</th>
                    {sizeChart.sizes[0] &&
                      Object.keys(sizeChart.sizes[0].measurements || {}).map(
                        (key) => (
                          <th
                            key={key}
                            className="px-3 py-2 text-left font-semibold"
                          >
                            {key}
                          </th>
                        )
                      )}
                  </tr>
                </thead>
                <tbody>
                  {sizeChart.sizes.map((sizeData, idx) => (
                    <tr
                      key={idx}
                      className={`border-b ${
                        idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="px-3 py-2 font-semibold text-gray-900">
                        {sizeData.size}
                      </td>
                      {Object.entries(sizeData.measurements || {}).map(
                        ([key, value]) => (
                          <td key={key} className="px-3 py-2 text-gray-700">
                            {value}
                          </td>
                        )
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="mt-3 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SizeChartButton;
