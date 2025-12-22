import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";

const Layout = () => {
  return (
    <>
      <AdminNavbar />
      <div className="flex">
        <AdminSidebar />
        <div className="h-[calc(100vh-64px)] flex-1 overflow-y-auto px-4 py-10 md:px-10">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;
