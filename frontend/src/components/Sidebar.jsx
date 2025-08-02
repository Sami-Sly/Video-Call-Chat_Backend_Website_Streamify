import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { Users, UserPlus, UserCheck,BellIcon, HomeIcon,MenuIcon,XIcon  } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

 const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Listen for screen resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0 },
    exit: { x: "-100%" },
  };

  const menuItems = [
    { to: "/", label: "Home", icon: <HomeIcon className="size-5" /> },
    { to: "/friends", label: "Friends", icon: <UserCheck className="size-5" /> },
    { to: "/notifications", label: "Notifications", icon: <BellIcon className="size-5" /> },
    { to: "/groups", label: "All Groups", icon: <Users className="size-5" /> },
    { to: "/create-group", label: "Create Groups", icon: <UserPlus className="size-5" /> },
  ];
  return (

         <>
      {/* HEADER with TOGGLE BUTTON */}
      {isMobile && (
        <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-base-100 border-b border-base-300 flex items-center px-4 z-50">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setIsSidebarOpen(true)}
          >
            <MenuIcon className="size-5" />
          </button>
          <h1 className="text-lg font-bold ml-4">SLY Hub </h1>
        </header>
      )}

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 z-40"
              onClick={() => setIsSidebarOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Sidebar */}
            <motion.aside
              className="w-64 bg-base-200 border-r border-base-300 flex flex-col h-screen fixed top-0 left-0 z-50"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={sidebarVariants}
              transition={{ duration: 0.3 }}
            >
              <div className="p-5 border-b border-base-300 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2.5">
                  <span className="text-2xl font-bold font-mono text-primary">SLY HUB</span>
                </Link>
                <button onClick={() => setIsSidebarOpen(false)}>
                  <XIcon className="size-5" />
                </button>
              </div>

              <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
                      currentPath === item.to ? "btn-active" : ""
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>

              <div className="p-4 border-t border-base-300 mt-auto">
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-10 rounded-full">
                      <img src={authUser?.profilePic} alt="User Avatar" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{authUser?.fullName}</p>
                    <p className="text-xs text-success flex items-center gap-1">
                      <span className="size-2 rounded-full bg-success inline-block" />
                      Online
                    </p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* DESKTOP STATIC SIDEBAR */}
      {!isMobile && (
        <aside className="w-64 bg-base-200 border-r border-base-300 flex flex-col h-screen sticky top-0">
          <div className="p-5 border-b border-base-300">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="text-2xl font-bold font-mono text-primary">SLY HUB</span>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
                  currentPath === item.to ? "btn-active" : ""
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-base-300 mt-auto">
            <div className="flex items-center gap-3">
              <div className="avatar">
                <div className="w-10 rounded-full">
                  <img src={authUser?.profilePic} alt="User Avatar" />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{authUser?.fullName}</p>
                <p className="text-xs text-success flex items-center gap-1">
                  <span className="size-2 rounded-full bg-success inline-block" />
                  Online
                </p>
              </div>
            </div>
          </div>
        </aside>
      )}
    </>

  );
};
export default Sidebar;