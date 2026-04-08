import React, { useEffect, useState } from "react";
import { subscribeToToast } from "../utils/toast";

const typeConfig = {
  success: {
    title: "Success",
    stroke: "#22C55E",
  },
  error: {
    title: "Error",
    stroke: "#EF4444",
  },
  warning: {
    title: "Warning",
    stroke: "#F59E0B",
  },
  info: {
    title: "Notice",
    stroke: "#3B82F6",
  },
};

const ToastCard = ({ item, onClose }) => {
  const cfg = typeConfig[item.type] || typeConfig.info;

  return (
    <div className="bg-white/70 backdrop-blur-xl inline-flex items-center justify-between space-x-3 p-3 text-sm rounded-xl border border-white/60 shadow-lg min-w-[320px] max-w-[90vw]">
     
      <div className="flex items-center gap-2 justify-center">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M16.5 8.31V9a7.5 7.5 0 1 1-4.447-6.855M16.5 3 9 10.508l-2.25-2.25"
          stroke={cfg.stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="pr-2 inline-flex items-center gap-2 justify-center">
        <h3 className="text-slate-700 font-medium">{cfg.title}</h3>
        <p className="text-slate-500">{item.message}</p>
      </div>
      </div>
      <button
        type="button"
        aria-label="close"
        onClick={() => onClose(item.id)}
        className="cursor-pointer mb-auto text-slate-400 hover:text-slate-600 active:scale-95 transition"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect
            y="12.532"
            width="17.498"
            height="2.1"
            rx="1.05"
            transform="rotate(-45.74 0 12.532)"
            fill="currentColor"
            fillOpacity=".7"
          />
          <rect
            x="12.531"
            y="13.914"
            width="17.498"
            height="2.1"
            rx="1.05"
            transform="rotate(-135.74 12.531 13.914)"
            fill="currentColor"
            fillOpacity=".7"
          />
        </svg>
      </button>
    </div>
  );
};

const ToastProvider = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToToast((payload) => {
      setItems((prev) => [...prev, payload]);
      setTimeout(() => {
        setItems((prev) => prev.filter((toastItem) => toastItem.id !== payload.id));
      }, 2600);
    });
    return unsubscribe;
  }, []);

  const removeToast = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  if (!items.length) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 items-center ">
      {items.map((item) => (
        <ToastCard key={item.id} item={item} onClose={removeToast} />
      ))}
    </div>
  );
};

export default ToastProvider;

