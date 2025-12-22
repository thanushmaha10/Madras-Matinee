import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";

const AdminNavbar = () => {
  return (
    <div className="flex h-18 items-center justify-between border-b border-gray-300/30 px-6 md:px-10">
      <Link to="/">
        <img src={assets.logo} alt="logo" className="h-auto w-24" />
      </Link>
    </div>
  );
};

export default AdminNavbar;
