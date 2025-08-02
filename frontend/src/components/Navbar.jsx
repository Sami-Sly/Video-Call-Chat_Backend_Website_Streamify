import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
// import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";
import ThemeSelector from "./ThemeSelector";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  // const queryClient = useQueryClient();
  // const { mutate: logoutMutation } = useMutation({
  //   mutationFn: logout,
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  // });

  const { logoutMutation } = useLogout();

  return (

  <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-14 sm:h-16 flex items-center">
  <div className="container mx-auto px-2 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between w-full">
      
      {/* LOGO - ONLY IN THE CHAT PAGE */}
      {isChatPage && (
        <div className="pl-1 sm:pl-3">
          <Link to="/" className="flex items-center gap-1 sm:gap-2.5">
            <ShipWheelIcon className="w-6 h-6 sm:w-7 sm:h-7 md:size-9 text-primary" />
            <span className="text-[0.7rem] sm:text-sm md:text-xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-tight sm:tracking-wide md:tracking-wider">
              Video Calling App
            </span>
          </Link>
        </div>
      )}

      <div className="flex items-center gap-1.5 sm:gap-3 ml-auto">
        {/* Notification */}
        <Link to={"/notifications"}>
          <button className="btn btn-ghost btn-circle btn-xs sm:btn-sm">
            <BellIcon className="w-4 h-4 sm:w-5 sm:h-5 text-base-content opacity-70" />
          </button>
        </Link>

<div className="hidden sm:block sm:scale-90 md:scale-100">
  <ThemeSelector />
</div>


        {/* Avatar */}
        <div className="avatar">
          <div className="w-5 sm:w-9 rounded-full">
            <img src={authUser?.profilePic} alt="User Avatar" rel="noreferrer" />
          </div>
        </div>

        {/* Logout */}
        <button className="btn btn-ghost btn-circle btn-xs sm:btn-sm" onClick={logoutMutation}>
          <LogOutIcon className="w-4 h-4 sm:w-5 sm:h-5 text-base-content opacity-70" />
        </button>
      </div>
    </div>
  </div>
</nav>

//     <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-end w-full">
//           {/* LOGO - ONLY IN THE CHAT PAGE */}
          
//           {isChatPage && (
//             <div className="pl-5">
//               <Link to="/" className="flex items-center gap-2.5">
//                 <ShipWheelIcon className="size-9 text-primary" />
//         <span className="text-sm
//          sm:text-xl md:text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-normal sm:tracking-wide md:tracking-wider">
//   Video Calling App
// </span>

//               </Link>
//             </div>
//           )}



//           <div className="flex items-center gap-3 sm:gap-4 ml-auto">
//             <Link to={"/notifications"}>
//               <button className="btn btn-ghost btn-circle">
//                 <BellIcon className="h-6 w-6 text-base-content opacity-70" />
//               </button>
//             </Link>
//           </div>

//           {/* TODO */}
//           <ThemeSelector />

//           <div className="avatar">
//             <div className="w-9 rounded-full">
//               <img src={authUser?.profilePic} alt="User Avatar" rel="noreferrer" />
//             </div>
//           </div>

//           {/* Logout button */}
//           <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
//             <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
//           </button>
//         </div>
//       </div>
//     </nav>
  );
};
export default Navbar;