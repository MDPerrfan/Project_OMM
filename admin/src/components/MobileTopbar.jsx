import React from "react";
import { NavLink } from "react-router-dom";
import { Plus, ListChecks, Ruler, Package, Globe } from "lucide-react";

const MobileTopbar = () => {
  return (
    <div className="md:hidden bg-white border-b border-gray-300">
      <div className="flex justify-around items-center py-3 px-2">
        <NavLink
          to={"/add"}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-3 py-2 ${
              isActive ? "text-blue-600" : "text-gray-600"
            }`
          }
        >
          <Plus className="w-5 h-5" />
          <p className="text-xs">Add</p>
        </NavLink>
        <NavLink
          to={"/list"}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-3 py-2 ${
              isActive ? "text-blue-600" : "text-gray-600"
            }`
          }
        >
          <ListChecks className="w-5 h-5" />
          <p className="text-xs">List</p>
        </NavLink>
        <NavLink
          to={"/size-chart"}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-3 py-2 ${
              isActive ? "text-blue-600" : "text-gray-600"
            }`
          }
        >
          <Ruler className="w-5 h-5" />
          <p className="text-xs">Size</p>
        </NavLink>
        <NavLink
          to={"/orders"}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-3 py-2 ${
              isActive ? "text-blue-600" : "text-gray-600"
            }`
          }
        >
          <Package className="w-5 h-5" />
          <p className="text-xs">Orders</p>
        </NavLink>
        <NavLink
          to={"/website-info"}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-3 py-2 ${
              isActive ? "text-blue-600" : "text-gray-600"
            }`
          }
        >
          <Globe className="w-5 h-5" />
          <p className="text-xs">Website</p>
        </NavLink>
      </div>
    </div>
  );
};

export default MobileTopbar;
