import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { MenuIcon, SearchIcon, TicketPlus, XIcon } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showExtras, setShowExtras] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowExtras(false);
      } else {
        setShowExtras(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">
      <Link
        to="/"
        className={`transition-all duration-300 ${
          showExtras
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-6 pointer-events-none"
        }`}
      >
        <img
          src={assets.logo}
          alt="Madras Matinee Logo"
          className="w-24 h-auto"
        />
      </Link>

      <div
        className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium
        max-md:text-lg z-50 flex flex-col md:flex-row items-center
        max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen
        min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border
        border-gray-300/20 overflow-hidden transition-[width] duration-300 ${
          isOpen ? "max-md:w-full" : "max-md:w-0"
        }`}
      >
        <XIcon
          className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer"
          onClick={() => setIsOpen(false)}
        />

        {["/", "/movies", "/releases", "/favorites"].map((path, i) => {
          const labels = ["Home", "Movies", "Releases", "Favorites"];
          return (
            <Link
              key={path}
              to={path}
              onClick={() => {
                scrollTo(0, 0);
                setIsOpen(false);
              }}
            >
              {labels[i]}
            </Link>
          );
        })}

        {user && (
          <Link
            to="/my-bookings"
            onClick={() => {
              scrollTo(0, 0);
              setIsOpen(false);
            }}
          >
            My Bookings
          </Link>
        )}
      </div>

      <div
        className={`flex items-center gap-8 transition-all duration-300 ${
          showExtras
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-6 pointer-events-none"
        }`}
      >
        <SearchIcon className="max-md:hidden w-6 h-6 cursor-pointer" />

        {!user ? (
          <button
            onClick={openSignIn}
            className="px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
          >
            Login
          </button>
        ) : (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="My Bookings"
                labelIcon={<TicketPlus width={15} />}
                onClick={() => navigate("/my-bookings")}
              />
            </UserButton.MenuItems>
          </UserButton>
        )}
      </div>

      <MenuIcon
        className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer"
        onClick={() => setIsOpen(true)}
      />
    </div>
  );
};

export default Navbar;
