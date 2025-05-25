import React from "react";
import ClosedSidebar from "../components/closedSidebar";
import OpenSidebar from "../components/openSidebar";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const isOpened = useSelector((state) => state.sidebar.sidebar);

  return (
    <div className={`my-3 mx-2`}>
      {isOpened ? <OpenSidebar /> : <ClosedSidebar />}
    </div>
  );
};

export default Sidebar;
