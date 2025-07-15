import React, { useContext } from "react";
import { MyContext } from "../App";
import { CheckCircle, AlertCircle, X } from "lucide-react";

export const AlertBox: React.FC = () => {
  const { alertBox, setAlertBox } = useContext(MyContext);

  if (!alertBox || !alertBox.open) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div
        className={`flex items-center gap-3 p-4 rounded-lg shadow-lg ${
          alertBox.error
            ? "bg-red-50 border border-red-200 text-red-800"
            : "bg-green-50 border border-green-200 text-green-800"
        }`}
      >
        {alertBox.error ? (
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
        ) : (
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
        )}

        <p
          className="flex-1 font-medium text-sm"
          style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
        >
          {alertBox.msg}
        </p>

        <button
          onClick={() => setAlertBox?.({ open: false, error: false, msg: "" })}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
