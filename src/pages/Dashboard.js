import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiLogOut, FiHome, FiBell, FiBarChart, FiMenu } from "react-icons/fi";
import { MdArchive } from "react-icons/md";
import TaskList from "../components/Task/TaskList";
import Notification from "../components/Notification";
import Analytics from "../components/Analytics";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../redux/userSlice";
import { auth } from "../firebase/firebaseConfig";
import Archived from "../components/Archived";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user.userInfo);
  const tasks = useSelector((state) => state.tasks.taskList);

  const [activeComponent, setActiveComponent] = useState("taskList");
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  useEffect(() => {
    if (location.pathname === "/notification")
      setActiveComponent("notification");
    else if (location.pathname === "/archived") setActiveComponent("archived");
    else if (location.pathname === "/analytics")
      setActiveComponent("analytics");
    else setActiveComponent("taskList");
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      dispatch(clearUser());
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  const handleNavigation = (component) => {
    setActiveComponent(component);
    navigate(`/${component === "taskList" ? "" : component}`);
    setIsSidebarVisible(false); // Close sidebar on mobile after navigation
  };

  const toggleSidebar = () => setIsSidebarVisible((prevState) => !prevState);

  return (
    <div className="flex bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white flex flex-col justify-between items-center p-4 w-16 fixed h-full transition-transform ${
          isSidebarVisible ? "transform-none" : "transform -translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex flex-col items-center mb-4">
          <div className="flex items-center justify-center bg-gray-600 rounded-full w-10 h-10 text-xl font-bold mb-4">
            {user?.displayName?.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col items-center space-y-6">
            <div
              className="cursor-pointer"
              onClick={() => handleNavigation("taskList")}
            >
              <FiHome
                size={28}
                className={`text-gray-400 hover:text-white ${
                  activeComponent === "taskList" && "text-white"
                }`}
              />
            </div>
            <div
              className="cursor-pointer"
              onClick={() => handleNavigation("notification")}
            >
              <FiBell
                size={28}
                className={`text-gray-400 hover:text-white ${
                  activeComponent === "notification" && "text-white"
                }`}
              />
            </div>
            <div
              className="cursor-pointer"
              onClick={() => handleNavigation("analytics")}
            >
              <FiBarChart
                size={28}
                className={`text-gray-400 hover:text-white ${
                  activeComponent === "analytics" && "text-white"
                }`}
              />
            </div>
            <div
              className="cursor-pointer"
              onClick={() => handleNavigation("archived")}
            >
              <MdArchive
                size={28}
                className={`text-gray-400 hover:text-white ${
                  activeComponent === "archived" && "text-white"
                }`}
              />
            </div>
          </div>
        </div>
        <div className="mb-2">
          <FiLogOut
            size={32}
            className="cursor-pointer text-red-600 hover:text-red-500"
            onClick={handleLogout}
          />
        </div>
      </div>

      {/* Main content */}
      <div
        className={`flex-grow overflow-y-auto transition-all duration-300 ${
          isSidebarVisible ? "ml-16" : "sm:ml-16 ml-0"
        }`}
      >
        <div className="bg-white rounded-lg shadow-md p-4">
          {activeComponent === "taskList" && <TaskList />}
          {activeComponent === "notification" && <Notification tasks={tasks} />}
          {activeComponent === "analytics" && <Analytics tasks={tasks} />}
          {activeComponent === "archived" && <Archived />}
        </div>
      </div>

      {/* Hamburger Menu for mobile */}
      <div
        className="md:hidden fixed bottom-5 right-5 bg-gray-800 text-white p-3 rounded-full cursor-pointer"
        onClick={toggleSidebar}
      >
        <FiMenu size={24} />
      </div>
    </div>
  );
};

export default Dashboard;
