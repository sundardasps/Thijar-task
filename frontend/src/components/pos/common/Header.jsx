import { Settings, UserCircle } from "lucide-react";
import { useState } from "react";

function HeaderTab({ title = "", showIcons = false, onLogout }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="
      flex md:flex-row text-center py-2 text-xs md:text-base 
      text-white font-semibold bg-blue-900 border-r border-blue-300 
      last:border-0 relative
      "
    >
      <h6 className="flex-2">{title}</h6>

      {showIcons && (
        <div className="flex items-center gap-1 md:gap-2 mr-2 md:mr-5">
          <Settings className="w-4 h-4 md:w-5 md:h-5 cursor-pointer" />

          {/* User Icon */}
          <div className="relative">
            <UserCircle
              className="w-4 h-4 md:w-5 md:h-5 cursor-pointer"
              onClick={() => setOpen((prev) => !prev)}
            />

            {/* Dropdown */}
            {open && (
              <div
                className="
                absolute right-0 mt-2 w-32 bg-white text-black rounded shadow-lg 
                border border-gray-200 z-50
              "
                onMouseLeave={() => setOpen(false)}
              >
                <button className="w-full text-left px-3 py-2 hover:bg-gray-100">
                  Profile
                </button>

                <button
                  onClick={onLogout}
                  className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default HeaderTab;
