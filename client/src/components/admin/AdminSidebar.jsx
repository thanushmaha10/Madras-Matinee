import {
  LayoutDashboardIcon,
  ListCollapseIcon,
  ListIcon,
  PlusSquareIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { assets } from "../../assets/assets";

const AdminSidebar = () => {
  const user = {
    firstName: "Admin",
    lastName: "User",
    imageUrl: assets.profile,
  };

  const adminNavlinks = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboardIcon },
    { name: "Add Shows", path: "/admin/add-shows", icon: PlusSquareIcon },
    { name: "List Shows", path: "/admin/list-shows", icon: ListIcon },
    {
      name: "List Bookings",
      path: "/admin/list-bookings",
      icon: ListCollapseIcon,
    },
  ];
  return (
    <div className="h-[calc(100vh-64px)] w-full max-w-13 flex-col items-center border-r border-gray-300/20 pt-8 text-sm md:flex md:max-w-60">
      <img
        className="mx-auto h-9 w-9 rounded-full md:h-14 md:w-14"
        src={user.imageUrl}
        alt="sidebar"
      />
      <p className="mt-2 text-base max-md:hidden">
        {user.firstName} {user.lastName}
      </p>
      <div className="w-full">
        {adminNavlinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            end
            className={({ isActive }) =>
              `relative flex w-full items-center gap-2 py-2.5 text-gray-400 first:mt-6 max-md:justify-center min-md:pl-10 ${isActive && "bg-primary/15 text-primary group"}`
            }
          >
            {({ isActive }) => (
              <>
                <link.icon className="h-5 w-5" />
                <p className="max-md:hidden">{link.name}</p>
                <span
                  className={`absolute right-0 h-10 w-1.5 rounded-l ${isActive && "bg-primary"}`}
                />
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;
