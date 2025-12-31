import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";
import { useAppContext } from "../../context/AppContext";
import { useEffect } from "react";
import Loader from "../../components/Loader";

const Layout = () => {
  const { isAdmin, fetchIsAdmin } = useAppContext();

  useEffect(() => {
    fetchIsAdmin();
  }, []);

  return isAdmin ? (
    <>
      <AdminNavbar />
      <div className="flex">
        <AdminSidebar />
        <div className="h-[calc(100vh-64px)] flex-1 overflow-y-auto px-4 py-10 md:px-10">
          <Outlet />
        </div>
      </div>
    </>
  ) : (
    <Loader />
  );
};

export default Layout;
