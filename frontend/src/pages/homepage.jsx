import React, { useEffect, useState } from "react";
import Dashboard from "./dashboard";
import OpenSidebar from "../components/openSidebar";
import { useSelector } from "react-redux";

const Homepage = () => {
  const isOpened = useSelector((state) => state.sidebar.sidebar);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col w-full">
      {isSmallScreen && isOpened ? <OpenSidebar /> : <Dashboard />}
    </div>
  );
};

export default Homepage;
