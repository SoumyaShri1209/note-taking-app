
// "use client";

// import { getInitials } from "@/helpers/profilelogo";
// import React, { useState, useEffect } from "react";
// import { Menu, X } from "lucide-react"; // icons
// import { useDispatch, useSelector } from "react-redux";
// import { logoutFailure, logoutStart, logoutSuccess } from "@/redux/user/userSlice";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";
// import axios from "axios";


// const ProfileInfo = ({userInfo}) => {
//   const [isOpen, setIsOpen] = useState(false);
//   // const [mounted, setMounted] = useState(false); // hydration fix
//   const dispatch = useDispatch();
//   const router = useRouter();

//   // Get user info from Redux
//   const { user } = useSelector((state) => state.user);



//   const handleLogout = async() => {
//     // dispatch(logout());
//     // redirect to login after logout

//     try {
//       dispatch(logoutStart());

//       const res = await axios.get("/api/user/logout",{withCredentials:true});

//       if(res.data.success===false){
//             dispatch(logoutFailure(res.data.message))
//             toast.error("Logout failed");
//               return
//       }

//       dispatch(logoutSuccess())
//       toast.success("Logout successful");
//        router.push("/login");
      
//     } catch (error) {
//       dispatch(logoutFailure("Logout failed"));
//        toast.error("Logout failed");
//     }
//   };

//   return (
//     <div className="relative">
//       {/* 👇 Small screens: show hamburger */}
//       <div className="sm:hidden">
//         {isOpen ? (
//           <X
//             className="w-8 h-8 cursor-pointer text-pink-950 hover:text-pink-800"
//             onClick={() => setIsOpen(false)}
//           />
//         ) : (
//           <Menu
//             className="w-8 h-8 cursor-pointer text-pink-950 hover:text-pink-800"
//             onClick={() => setIsOpen(true)}
//           />
//         )}
//       </div>

//       {/* 👇 Profile info (always visible on larger screens, toggle on small) */}
//       <div
//         className={`flex flex-col sm:flex-row items-center gap-3 
//         sm:static absolute top-12 right-0 bg-white sm:bg-transparent shadow-md sm:shadow-none p-4 sm:p-0 rounded-lg 
//         transition-all duration-300 ease-in-out 
//         ${isOpen ? "block" : "hidden sm:flex"}`}
//       >
//         <div className="w-11 h-11 flex justify-center items-center rounded-full text-pink-950 bg-slate-100 max-sm:bg-pink-300 font-medium">
//           { getInitials(userInfo?.username)}
//         </div>
//         <div>
//           <p className="text-[18px] max-sm:text-sm font-medium text-pink-950">
//             { userInfo?.username}
//           </p>
//         </div>
//         <button
//           className="text-sm bg-red-500 p-2 rounded-md text-white hover:bg-red-600 cursor-pointer"
//           onClick={handleLogout}
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProfileInfo;






"use client";

import { getInitials } from "@/helpers/profilelogo";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutFailure, logoutStart, logoutSuccess } from "@/redux/user/userSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";

const ProfileInfo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  // ✅ get user directly from Redux
  const { user } = useSelector((state) => state.user);

  const handleLogout = async () => {
    try {
      dispatch(logoutStart());
      const res = await axios.get("/api/user/logout", { withCredentials: true });

      if (res.data.success === false) {
        dispatch(logoutFailure(res.data.message));
        toast.error("Logout failed");
        return;
      }

      dispatch(logoutSuccess());
      toast.success("Logout successful");
      router.push("/login");
    } catch (error) {
      dispatch(logoutFailure("Logout failed"));
      toast.error("Logout failed");
    }
  };

  return (
    <div className="relative">
      {/* Mobile toggle */}
      <div className="sm:hidden">
        {isOpen ? (
          <X
            className="w-8 h-8 cursor-pointer text-pink-950 hover:text-pink-800"
            onClick={() => setIsOpen(false)}
          />
        ) : (
          <Menu
            className="w-8 h-8 cursor-pointer text-pink-950 hover:text-pink-800"
            onClick={() => setIsOpen(true)}
          />
        )}
      </div>

      {/* Profile info */}
      <div
        className={`flex flex-col sm:flex-row items-center gap-3 
        sm:static absolute top-12 right-0 bg-white sm:bg-transparent shadow-md sm:shadow-none p-4 sm:p-0 rounded-lg 
        transition-all duration-300 ease-in-out 
        ${isOpen ? "block" : "hidden sm:flex"}`}
      >
        <div className="w-11 h-11 flex justify-center items-center rounded-full text-pink-950 bg-slate-100 max-sm:bg-pink-300 font-medium">
          {getInitials(user?.username)}
        </div>
        <div>
          <p className="text-[18px] max-sm:text-sm font-medium text-pink-950">
            {user?.username}
          </p>
        </div>
        <button
          className="text-sm bg-red-500 p-2 rounded-md text-white hover:bg-red-600 cursor-pointer"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;












